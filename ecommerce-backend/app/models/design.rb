class Design < ApplicationRecord
  has_many :product_designs, dependent: :destroy
  has_many :products, through: :product_designs

  validates :design_number, presence: true, uniqueness: true
  validates :sales, numericality: { greater_than_or_equal_to: 0 }

  def increment_sales!(amount = 1)
    increment!(:sales, amount)
  end
end