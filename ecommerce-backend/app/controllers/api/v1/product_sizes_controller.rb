class Api::V1::ProductSizesController < ApplicationController
  before_action :autheticate_user!
  before_action :ensure_admin!, except: [:index]
  before_action :set_product

  def index
    @product_sizes = @product.product_sizes.include(:size)
    render json: ProductSerializer.new(@product_sizes).serializable_hash
  end

  def create
    @product_size = @product.product_sizes.build(product_size_params)
    if @product_size.save
      render json: ProductSerializer.new(@product_size).serializable_hash, status: :created
    else
      render json: { errors: @product_size.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @product_size = @product.product_sizes.find(params[:id])
    if @product_size.update(product_size_params)
      render json: ProductSerializer.new(@product_size).serializable_hash
    else
      render json: { errors: @product_size.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @product_size = @product.product_sizes.find(params[:id])
    @product_size.destroy
    head :no_content
  end

  private

  def set_product
    @product = Product.find(params[:product_id])
  end

  def product_size_params
    params.require(:product_size).permit(:size_id, :stock_quantity, :price_adjustment)
  end
end
