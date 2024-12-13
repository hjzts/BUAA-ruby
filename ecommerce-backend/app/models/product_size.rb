class ProductSize < ApplicationRecord
  belongs_to :product
  belongs_to :size

  validates :stock_quantity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :price_adjustment, presence: true, numericality: true
  validates :size_id, uniqueness: { scope: :product_id }
end
