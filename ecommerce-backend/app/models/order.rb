require 'aasm'
class Order < ApplicationRecord
  include AASM

  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items

  validates :recipient_name, :shipping_address, :phone_number, :postal_code, presence: true
  # validates :total_amount, numericality: { greater_than: 0 }
  validates :total_amount, numericality: { greater_than_or_equal_to: 0 }
  validates :phone_number, format: { with: /\A\d{10,11}\z/, message: "should be 10-11 digits" }
  validates :status, inclusion: { in: %w[pending paid shipped delivered cancelled] }

  # 订单状态枚举
  enum :status , {
    pending: "pending",
    paid: "paid",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled"
  }

  # 状态机
  aasm column: 'status' do
    state :pending, initial: true
    state :paid, :shipped, :delivered, :cancelled

    event :pay do
      transitions from: :pending, to: :paid
      after do
        update!(paid_at: Time.current)
      end
    end

    event :ship do
      transitions from: :paid, to: :shipped
      after do
        update!(shipped_at: Time.current)
      end
    end

    event :deliver do
      transitions from: :shipped, to: :delivered
      after do
        update!(delivered_at: Time.current)
      end
    end

    event :cancel do
      transitions from: [:pending, :paid], to: :cancelled
      after do |reason|
        update!(cancelled_at: Time.current, cancellation_reason: reason)
        # 恢复库存
        order_items.each do |item|
          item.product.update_stock!(item.quantity, :increase)
        end
      end
    end
  end

  # 回调
  before_validation :set_initial_status, on: :create
  before_validation :calculate_total_amount
  after_create :update_product_stocks

  # 作用域
  scope :pending, -> { where(status: "pending") }
  scope :paid, -> { where(status: "paid") }
  scope :shipped, -> { where(status: "shipped") }
  scope :delivered, -> { where(status: "delivered") }
  scope :cancelled, -> { where(status: "cancelled") }
  scope :recent, -> { order(created_at: :desc) }

  # 状态机方法
  def status_changeable?
    !cancelled? && !delivered?
  end

  # 更新订单状态的方法
  def pay!
    return false unless pending?

    transaction do
      update!(status: "paid", paid_at: Time.current)
    end
  end

  def ship!
    return false unless paid?

    transaction do
      update!(status: "shipped", shipped_at: Time.current)
    end
  end

  def deliver!
    return false unless shipped?

    transaction do
      update!(status: "delivered", delivered_at: Time.current)
    end
  end

  def cancel!(reason)
    return false unless status_changeable?

    transaction do
      update!(
        status: "cancelled",
        cancelled_at: Time.current,
        cancellation_reason: reason
      )
      restore_product_stocks
    end
  end

  def set_initial_status
    self.status ||= "pending"
  end

  def calculate_total_amount
    self.total_amount = order_items.sum(&:total_price)
  end

  # 计算订单总金额
  def calculate_total
    order_items.sum(&:total_price)
  end

  def update_product_stocks
    order_items.each do |item|
      item.product.decrement!(:stock_quantity, item.quantity)
    end
  end

  def restore_product_stocks
    order_items.each do |item|
      item.product.increment!(:stock_quantity, item.quantity)
    end
  end
end
