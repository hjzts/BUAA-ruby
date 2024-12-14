class Api::V1::Admin::ProductsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin!
  before_action :set_product, only: [:show, :update, :destroy]

  def index
    @products = Product.includes(:categories, :sizes, :colors, :designs)
                       .order(created_at: :desc)
                       .page(params[:page])
                       .per(params[:per_page] || 20)

    render json: {
      products: ProductSerializer.new(@products).serializable_hash,
      meta: {
        total_pages: @products.total_pages,
        current_page: @products.current_page,
        total_count: @products.total_count
      }
    }
  end

  def show
    render json: ProductSerializer.new(@product).serializable_hash[:data]
  end

  def create
    @product = Product.new(product_params)
    @product.user = current_user

    if @product.save
      attach_variants
      render json: ProductSerializer.new(@product).serializable_hash, status: :created
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      attach_variants
      render json: ProductSerializer.new(@product).serializable_hash
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @product.update(status: :deleted)
    head :no_content
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(
      :product_name, :description, :price, :stock_quantity,
      :status, :image, category_ids: []
    )
  end

  def attach_variants
    if params[:variants].present?
      # 处理尺码变体
      if params[:variants][:sizes].present?
        @product.product_sizes.destroy_all
        params[:variants][:sizes].each do |size|
          @product.product_sizes.create!(
            size_id: size[:id],
            stock_quantity: size[:stock_quantity],
            price_adjustment: size[:price_adjustment]
          )
        end
      end

      # 处理颜色变体
      if params[:variants][:colors].present?
        @product.product_colors.destroy_all
        params[:variants][:colors].each do |color|
          @product.product_colors.create!(
            color_id: color[:id],
            price_adjustment: color[:price_adjustment]
          )
        end
      end

      # 处理设计变体
      if params[:variants][:designs].present?
        @product.product_designs.destroy_all
        params[:variants][:designs].each do |design|
          @product.product_designs.create!(
            design_id: design[:id],
            price_adjustment: design[:price_adjustment]
          )
        end
      end
    end
  end
end
