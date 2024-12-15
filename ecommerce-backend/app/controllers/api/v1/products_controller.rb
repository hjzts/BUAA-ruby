class Api::V1::ProductsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :ensure_admin!, only: [:create, :update, :destroy, :manage_stock]
  before_action :set_product, only: [:show, :update, :destroy, :manage_stock]

  def index
    @products = Product.all

    # 状态过滤
    @products = @products.available if params[:available] == "true"
    @products = @products.out_of_stock if params[:out_of_stock] == "true"

    # 价格范围过滤
    if params[:min_price].present? && params[:max_price].present?
      @products = @products.price_between(params[:min_price], params[:max_price])
    end

    # 搜索
    @products = @products.where("product_name LIKE ?", "%#{params[:search]}%") if params[:search].present?

    # 预加载关联数据
    @products = @products.includes(
      :image_attachment,
      product_sizes: :size,
      product_colors: :color,
      product_designs: :design,
      categories: {}
    )

    # 排序
    # @products = @products.order(params[:order] => params[:direction]) if params[:order].present?

    # 分页
    @products = @products.page(params[:page]).per(params[:per_page] || 12)

    render json: {
      products: ProductSerializer.new(@products).serializable_hash[:data],
      meta: {
        total_pages: @products.total_pages,
        current_page: @products.current_page,
        total_count: @products.total_count
      }
    }
  end

  def show
    render json: ProductSerializer.new(@product).serializable_hash[:data]
    # 我希望这里把product相关的信息都返回，包括product_sizes, product_designs, product_colors, product_categories
    # render json: ProductSerializer.new(@product, include: [:product_sizes, :product_designs, :product_colors, :product_categories])
  end

  def create
    @product = Product.new(product_params)

    if @product.save
      @product.image.attach(params[:image]) if params[:image].present?
      render json: {
        status: :created,
        product: ProductSerializer.new(@product).serializable_hash[:data]
      }
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      @product.image.attach(params[:image]) if params[:image].present?
      render json: ProductSerializer.new(@product).serializable_hash[:data]
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @product.soft_delete!
    head :no_content
  end

  def manage_stock
    operation = params[:operation]
    amount = params[:amount].to_i

    success = case operation
              when "increase"
                @product.increase_stock!(amount)
              when "decrease"
                @product.decrease_stock!(amount)
              else
                false
              end

    if success
      render json: ProductSerializer.new(@product).serializable_hash[:data]
    else
      render  json: { errors: ["Failed to #{operation} stock"] }, status: :unprocessable_entity
    end
  end

  private

  def set_product
    @product = Product.includes(
      :image_attachment,
      product_sizes: :size,
      product_colors: :color,
      product_designs: :design,
      categories: {}
    ).find(params[:id])
  end

  def product_params
    params.permit(
      :product_names,
      :description,
      :price,
      :stock_quantity,
      :status,
      :image,
      category_ids: []
    )
  end
end
