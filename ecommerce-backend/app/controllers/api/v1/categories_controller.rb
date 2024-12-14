class Api::V1::CategoriesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :ensure_admin!, except: [:index, :show]
  before_action :set_category, only: [:show, :update, :destroy]

  def index
    @categories = Category.includes(:children)
    @categories = @categories.root_categories if params[:root_only]

    render json: CategorySerializer.new(@categories).serializable_hash
  end

  def show
    render json: CategorySerializer.new(@category).serializable_hash
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      render json: CategorySerializer.new(@category).serializable_hash, status: :created
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @category.update(category_params)
      render json: CategorySerializer.new(@category).serializable_hash
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @category.destroy
    head :no_content
  end

  private

  def set_category
    @category = Category.find(params[:id])
  end

  def category_params
    params.require(:category).permit(:name, :description, :icon_url, :parent_id, :position)
  end
end
