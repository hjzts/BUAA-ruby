class Api::V1::Admin::OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin!
  before_action :set_order, only: [:show, :ship, :cancel]

  def index
    @orders = Order.includes(:user, :order_items)
                   .order(created_at: :desc)
                   .page(params[:page])
                   .per(params[:per_page] || 20)

    if params[:status].present?
      @orders = @orders.where(status: params[:status])
    end

    render json: {
      orders: OrderSerializer.new(@orders).serializable_hash,
      meta: {
        total_pages: @orders.total_pages,
        current_page: @orders.current_page,
        total_count: @orders.total_count
      }
    }
  end

  def ship
    if @order.ship
      render json: OrderSerializer.new(@order).serializable_hash
    else
      render json: { error: 'Cannot ship this order' }, status: :unprocessable_entity
    end
  end

  def cancel
    if @order.cancel(params[:reason])
      render json: OrderSerializer.new(@order).serializable_hash
    else
      render json: { error: 'Cannot cancel this order' }, status: :unprocessable_entity
    end
  end

  def show
    render json: OrderSerializer.new(@order).serializable_hash
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end
end
