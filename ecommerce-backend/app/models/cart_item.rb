class CartItem < ApplicationRecord
  belongs_to :user
  belongs_to :product

  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :product_id, uniqueness: { scope: :user_id }
  validates :added_at, presence: true

  before_validation :set_added_at, on: :create
  validate :validate_stock_quantity

  # 计算小计金额
  def subtotal
    product.price * quantity
  end

  def update!
    if quantity.zero?
      destroy
    else
      save
    end
  end

  private

  def set_added_at
    self.added_at = Time.current
  end

  def validate_stock_quantity
    # 这里先允许就算超过库存也可以继续加入购物车，只是购买的时候会报错
    true
    # return unless product
    #
    # if quantity > product.stock_quantity
    #   errors.add(:quantity, "exceeds available stock (#{product.stock_quantity} available)")
    # end
  end
end
