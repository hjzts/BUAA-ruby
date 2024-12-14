class Api::V1::CartItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cart_item, only: [:update, :destroy]

  def index
    @cart_items = current_user.cart_items.includes(:product)
    render json: CartItemSerializer.new(@cart_items).serializable_hash
  end

  def create
    @cart_item = current_user.cart_items.find_or_initialize_by(product_id: cart_item_params[:product_id])

    if @cart_item.new_record?
      @cart_item.quantity = cart_item_params[:quantity]
    else
      @cart_item.quantity += cart_item_params[:quantity].to_i
    end

    if @cart_item.save
      render json: CartItemSerializer.new(@cart_item).serializable_hash, status: :created
    else
      render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @cart_item.update(cart_item_params)
      render json: CartItemSerializer.new(@cart_item).serializable_hash
    else
      render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @cart_item.destroy
    head :no_content
  end

  def clear
    current_user.cart_items.destroy_all
    head :no_content
  end

  def count
    count = current_user.cart_items.sum(:quantity)
    render json: { count: count }
  end

  def total
    total = current_user.cart_total
    render json: { total: total }
  end

  private

  def set_cart_item
    @cart_item = current_user.cart_items.find(params[:id])
  end

  def cart_item_params
    params.require(:cart_item).permit(:product_id, :quantity)
  end
end
