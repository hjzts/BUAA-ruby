class Api::V1::ProductCategoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin!
  before_action :set_product

  def create
    @product_category = @product.product_categories.build(product_category_params)

    if @product_category.save
      render json: ProductCategorySerializer.new(@product_category).serializable_hash,
             status: :created
    else
      render json: { errors: @product_category.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def destroy
    @product_category = @product.product_categories.find_by!(category_id: params[:id])
    @product_category.destroy
    head :no_content
  end

  private

  def set_product
    @product = Product.find(params[:product_id])
  end

  def product_category_params
    params.require(:product_category).permit(:category_id)
  end
end
