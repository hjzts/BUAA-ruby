class Api::V1::ProductColorsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin!, except: [:index]
  before_action :set_product

  def index
    @product_colors = @product.product_colors.includes(:color)
    render json: ProductColorSerializer.new(@product_colors).serializable_hash
  end

  def create
    @product_color = @product.product_colors.build(product_color_params)
    if @product_color.save
      render json: ProductColorSerializer.new(@product_color).serializable_hash, status: :created
    else
      render json: { errors: @product_color.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @product_color = @product.product_colors.find(params[:id])
    if @product_color.update(product_color_params)
      render json: ProductColorSerializer.new(@product_color).serializable_hash
    else
      render json: { errors: @product_color.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @product_color = @product.product_colors.find(params[:id])
    @product_color.destroy
    head :no_content
  end

  private

  def set_product
    @product = Product.find(params[:product_id])
  end

  def product_color_params
    params.require(:product_color).permit(:color_id, :price_adjustment)
  end
end
