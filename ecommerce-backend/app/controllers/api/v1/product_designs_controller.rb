class Api::V1::ProductDesignsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin!, except: [:index]
  before_action :set_product

  def index
    @product_designs = @product.product_designs.includes(:design)
    render json: ProductDesignSerializer.new(@product_designs).serializable_hash
  end

  def create
    @product_design = @product.product_designs.build(product_design_params)
    if @product_design.save
      render json: ProductDesignSerializer.new(@product_design).serializable_hash, status: :created
    else
      render json: { errors: @product_design.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @product_design = @product.product_designs.find(params[:id])
    if @product_design.update(product_design_params)
      render json: ProductDesignSerializer.new(@product_design).serializable_hash
    else
      render json: { errors: @product_design.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @product_design = @product.product_designs.find(params[:id])
    @product_design.destroy
    head :no_content
  end

  private

  def set_product
    @product = Product.find(params[:product_id])
  end

  def product_design_params
    params.require(:product_design).permit(:design_id, :price_adjustment)
  end
end
