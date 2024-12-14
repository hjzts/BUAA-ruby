class Product < ApplicationRecord
  # 使用active Storage处理图片
  has_one_attached :image

  belongs_to :user # 创建者/管理员
  has_many :product_sizes, dependent: :destroy
  has_many :sizes, through: :product_sizes
  has_many :product_designs, dependent: :destroy
  has_many :designs, through: :product_designs
  has_many :product_colors, dependent: :destroy
  has_many :colors, through: :product_colors
  has_many :favorites, dependent: :destroy
  has_many :favorited_by_users, through: :favorites, source: :user
  has_many :order_items
  has_many :orders, through: :order_items
  has_many :product_categories, dependent: :destroy
  has_many :categories, through: :product_categories
  has_many :cart_items, dependent: destroy

  # 定义status的可选值
  enum :status, {
    active: "active", # 正常销售
    inactive: "inactive", # 下架
    deleted: "deleted" # 删除
  }

  # 验证
  validates :product_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock_quantity, numericality: { greater_than_or_equal_to: 0 }
  validates :sales_count, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true, inclusion: { in: Product.statuses.keys }

  # 默认排序
  default_scope { order(created_at: :desc) }

  # 常用查询范围
  scope :available, -> { where(status: "active").where("stock_quantity > 0") }
  scope :by_category, ->(category_id) { joins(:categories).where(categories: { id: category_id }) }
  scope :out_of_stock, -> { where(status: "active").where("stock_quantity = 0") }
  scope :price_between, ->(min, max) { where(price: min..max) }
  scope :search, ->(query) {
    where('product_name ILIKE :q OR description ILIKE :q', q: "%#{query}%")
  }

  # 订单相关作用域
  scope :ordered, -> { joins(:order_items).distinct }
  scope :best_sellers, -> {
    joins(:order_items)
      .select('products.*, SUM(order_items.quantity) as total_sold')
      .group('products.id')
      .order('total_sold DESC')
  }

  # 获取图片URL
  def image_url
    Rails.application.routes.url_helpers.url_for(image) if image.attached?
  end

  # 检查库存
  def in_stock?
    stock_quantity.positive?
  end

  # 减少库存
  def decrease_stock!(amount = 1)
    return false if stock_quantity < amount

    transaction do
      self.stock_quantity -= amount
      self.sales_count += amount
      save!
    end
    true
  rescue StandardError => e
    Rails.logger.error "Failed to decrease stock: #{e.message}"
    false
  end

  # 增加库存
  def increase_stock!(amount = 1)
    transaction do
      self.stock_quantity += amount
      save!
    end
    true
  rescue StandardError => e
    Rails.logger.error "Failed to increase stock: #{e.message}"
    false
  end

  # 订单相关方法
  def total_sales_quantity
    order_items.sum(:quantity)
  end

  def total_sales_amount
    order_items.sum('quantity * unit_price')
  end

  def update_stock(amount)
    return false if amount < 0 && stock_quantity < amount.abs
    update(stock_quantity: stock_quantity + amount)
  end

  def update_stock!(amount, operation = :decrease)
    return false if operation == :decrease && amount > stock_quantity

    new_quantity = operation == :decrease ? (stock_quantity - amount) : (stock_quantity + amount)
    update!(stock_quantity: new_quantity)
  end

  # 软删除
  def soft_delete!
    update!(status: "deleted")
  end

  # 上架
  def activate!
    update!(status: "active")
  end

  # 下架
  def deactivate!
    update!(status: "inactive")
  end
end
