class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :product

  validates :user_id, uniqueness: { scope: :product_id, message: "has already favorited this product" }
  validates :added_at, presence: true

  before_validation :set_added_at, on: :create

  private

  def set_added_at
    self.added_at = Time.current
  end
end
