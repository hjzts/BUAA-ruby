class Product < ApplicationRecord
  # 使用active Storage处理图片
  has_one_attached :image
  
  # 定义status的可选值
  enum status: {
    active: "active",   # 正常销售
    inactive: "inactive", # 下架
    deleted: "deleted" # 删除
  }
  
  # 验证
  validates :product_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock_quantity, numericality: { greater_than_or_equal_to: 0 }
  validates :sales_count, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: Product.statuses.keys }
  
  # 默认排序
  default_scope { order(created_at: :desc) }
  
  # 常用查询范围
  scope :available, -> { where(status: "active").where("stock_quantity > 0") }
  scope :out_of_stock, -> { where(status: "active").where("stock_quantity = 0") }
  scope :price_between, ->(min, max) {where(price: min..max)}

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
