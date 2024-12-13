class Api::V1::SizesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :ensure_admin!, except: [:index, :show]
  before_action :set_size, only: [:show, :update, :destroy]


  def index
    @sizes = Size.all
    render json: SizeSerializer.new(@sizes).serializable_hash
  end

  def show
    render json: SizeSerializer.new(@size).serializable_hash
  end

  def create
    @size = Size.new(size_params)
    if @size.save
      render json: SizeSerializer.new(@size).serializable_hash, status: :created
    else
      render json: { errors: @size.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @size.update(size_params)
      render json: SizeSerializer.new(@size).serializable_hash
    else
      render json: { errors: @size.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @size.destroy
    head :no_content
  end

  private

  def set_size
    @size = Size.find(params[:id])
  end

  def size_params
    params.require(:size).permit(:size_name, :description)
  end
end
