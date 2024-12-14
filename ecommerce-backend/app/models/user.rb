class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_one_attached :avatar

  has_many :favorites, dependent: :destroy
  has_many :favorited_products, through: :favorites, source: :product
  has_many :orders, dependent: :destroy
  has_many :order_items, through: :orders
  has_many :cart_items, dependent: :destroy

  validates :username, presence: true
  validates :role, inclusion: { in: %w[admin buyer] }

  def avatar_url
    Rails.application.routes.url_helpers.url_for(avatar) if avatar.attached?
  end

  # 订单查询作用域
  scope :with_pending_orders, -> { joins(:orders).where(orders: { status: 'pending' }) }
  scope :with_paid_orders, -> { joins(:orders).where(orders: { status: 'paid' }) }
  scope :with_completed_orders, -> { joins(:orders).where(orders: { status: 'delivered' }) }

  # 订单统计方法
  def total_order_amount
    orders.sum(:total_amount)
  end

  def recent_orders(limit = 5)
    orders.order(created_at: :desc).limit(limit)
  end

  # 获取购物车中所有商品的总价
  def cart_total
    cart_items.sum(&:subtotal)
  end

  def generate_jwt
    JWT.encode(
      {
        sub: id,
        jti: jti,
        exp: 24.hours.from_now.to_i
      },
      Rails.application.credentials.devise_jwt_secret_key!
    )
  end

  def admin?
    role == "admin"
  end

  def buyer?
    role == "buyer"
  end
end
