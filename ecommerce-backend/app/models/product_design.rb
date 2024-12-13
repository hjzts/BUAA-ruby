class ProductDesign < ApplicationRecord
  belongs_to :product
  belongs_to :design

  validates :price_adjustment, numericality: true
  validates :design_id, uniqueness: { scope: :product_id }
end
