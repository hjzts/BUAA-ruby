class Api::V1::DesignsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :ensure_admin!, except: [:index, :show]
  before_action :set_design, only: [:show, :update, :destroy]

  def index
    @designs = Design.all
    render json: DesignSerializer.new(@designs).serializable_hash
  end

  def show
    render json: DesignSerializer.new(@design).serializable_hash
  end

  def create
    @design = Design.new(design_params)
    if @design.save
      render json: DesignSerializer.new(@design).serializable_hash, status: :created
    else
      render json: { errors: @design.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @design.update(design_params)
      render json: DesignSerializer.new(@design).serializable_hash
    else
      render json: { errors: @design.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @design.destroy
    head :no_content
  end

  private

  def set_design
    @design = Design.find(params[:id])
  end

  def design_params
    params.require(:design).permit(:design_number)
  end
end
