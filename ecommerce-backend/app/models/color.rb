class Color < ApplicationRecord
  has_many :product_colors, dependent: :destroy
  has_many :products, through: :product_colors

  validates :rgb, presence: true,
            uniqueness: true,
            format: { with: /\A#[0-9A-F]{6}\z/i,
                      message: 'must be a valid hex color code (e.g., #FF0000)' }

  before_validation :format_rgb

  private

  def format_rgb
    self.rgb = rgb.upcase if rgb.present?
  end
end
