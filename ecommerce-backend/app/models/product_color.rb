class ProductColor < ApplicationRecord
  belongs_to :product
  belongs_to :color

  validates :price_adjustment, numericality: true
  validates :color_id, uniqueness: { scope: :product_id }
end
