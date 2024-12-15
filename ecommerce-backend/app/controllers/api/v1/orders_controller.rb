class Api::V1::OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_order, only: [:show, :update, :cancel]

  def index
    @orders = current_user.orders.includes(:order_items, order_items: :product)

    # 状态筛选
    @orders = @orders.where(status: params[:status]) if params[:status].present?

    # 时间范围筛选
    if params[:start_date].present? && params[:end_date].present?
      @orders = @orders.where(created_at: params[:start_date]..params[:end_date])
    end

    # 分页
    @orders = @orders.page(params[:page]).per(params[:per_page] || 10)

    render json: OrderSerializer.new(@orders).serializable_hash
  end

  def show
    render json: OrderSerializer.new(@order).serializable_hash
  end

  def create
    @order = current_user.orders.build(order_params)
    # Rails.logger.info(current_user)

    # 先检查库存是否充足
    inventory_check_results = check_inventory(params[:items])
    if inventory_check_results[:has_insufficient]
      render json: {
        errors: "Insufficient stock for products: #{inventory_check_results[:insufficient_items].join(', ')}"
      }, status: :unprocessable_entity
      return
    end

    Order.transaction do
      if @order.save
        # 从购物车创建订单项
        current_user.cart_items.each do |cart_item|
          @order.order_items.create!(
            product: cart_item.product,
            quantity: cart_item.quantity,
            unit_price: cart_item.product.price
          )
          cart_item.product.update_stock!(cart_item.quantity, :decrease)
        end

        @order.update!(total_amount: @order.order_items.sum(&:total_price))
        current_user.cart_items.destroy_all # 清空购物车

        render json: OrderSerializer.new(@order).serializable_hash, status: :created
      else
        render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  def update
    case params[:action_type]
    when "pay"
      if @order.pay!
        render json: OrderSerializer.new(@order).serializable_hash
      else
        render json: { error: "Cannot pay this order" }, status: :unprocessable_entity
      end
    when "deliver"
      if @order.deliver!
        render json: OrderSerializer.new(@order).serializable_hash
      else
        render json: { error: "Cannot deliver this order" }, status: :unprocessable_entity
      end
    else
      render json: { error: "Invalid action" }, status: :bad_request
    end
  end

  def pay
    if @order.pay!
      render json: OrderSerializer.new(@order).serializable_hash
    else
      render json: { error: "Cannot pay this order" }, status: :unprocessable_entity
    end
  end

  def cancel
    if @order.cancel!(params[:reason])
      render json: OrderSerializer.new(@order).serializable_hash
    else
      render json: { error: "Cannot cancel this order" }, status: :unprocessable_entity
    end
  end

  def confirm_delivery
    @order=Order.find(params[:id])
    if @order.deliver!
      render json: OrderSerializer.new(@order).serializable_hash
    else
      render json: { error: "Cannot deliver this order" }, status: :unprocessable_entity
    end
  end

  private

  def set_order
    @order = current_user.orders.find(params[:id])
  end

  def order_params
    params.require(:order).permit(
      :recipient_name,
      :shipping_address,
      :phone_number,
      :postal_code,
      :total_amount
    )
  end

  # 检查商品库存
  def check_inventory(items)
    insufficient_items = []

    items.each do |item|
      product = Product.find(item[:product_id])
      if product.stock_quantity < item[:quantity].to_i
        insufficient_items << "#{product.product_name} (requested: #{item[:quantity]}, available: #{product.stock_quantity})"
      end
    end

    {
      has_insufficient: insufficient_items.any?,
      insufficient_items: insufficient_items
    }
  end
end
