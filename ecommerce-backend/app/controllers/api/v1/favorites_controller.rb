class Api::V1::FavoritesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_product, only: [ :create ]

  def index
    @favorites = current_user.favorites.includes(:product)
    render json: FavoriteSerializer.new(@favorites).serializable_hash
  end

  def create
    @favorite = current_user.favorites.build(product: @product)

    if @favorite.save
      render json: FavoriteSerializer.new(@favorite).serializable_hash, status: :created
    else
      render json: { errors: @favorite.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @favorite = current_user.favorites.find_by!(product_id: params[:id])
    @favorite.destroy
    head :no_content
  end

  def check
    product_id = params[:product_id]
    is_favorited = current_user.favorites.exists?(product_id: product_id)
    render json: { is_favorited: is_favorited }
  end

  private

  def set_product
    @product = Product.find(params[:product_id])
  end
end
