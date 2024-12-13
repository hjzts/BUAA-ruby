class Api::V1::ColorsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :ensure_admin!, except: [:index, :show]
  before_action :set_color, only: [:show, :update, :destroy]

  def index
    @colors = Color.all
    render json: ColorSerializer.new(@colors).serializable_hash
  end

  def show
    render json: ColorSerializer.new(@color).serializable_hash
  end

  def create
    @color = Color.new(color_params)
    if @color.save
      render json: ColorSerializer.new(@color).serializable_hash, status: :created
    else
      render json: { errors: @color.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @color.update(color_params)
      render json: ColorSerializer.new(@color).serializable_hash
    else
      render json: { errors: @color.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @color.destroy
    head :no_content
  end

  private

  def set_color
    @color = Color.find(params[:id])
  end

  def color_params
    params.require(:color).permit(:rgb, :description)
  end
end
