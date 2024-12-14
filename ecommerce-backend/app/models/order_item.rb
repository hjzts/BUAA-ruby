class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product

  validates :quantity, presence: true,numericality: { greater_than: 0 }
  validates :unit_price, :total_price, numericality: { greater_than: 0 }

  # 回调
  before_validation :set_unit_price, on: :create
  before_save :calculate_total_price

  # 计算方法
  def subtotal
    quantity * unit_price
  end

  private

  def set_unit_price
    self.unit_price = product.price if unit_price.nil?
  end

  def calculate_total_price
    self.total_price = subtotal
  end

  def check_product_stock
    return unless product
    unless product.stock_quantity >= quantity
      errors.add(:quantity, "exceeds available stock (#{product.stock_quantity} available)")
    end
  end
end
