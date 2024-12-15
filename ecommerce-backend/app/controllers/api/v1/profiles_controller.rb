class Api::V1::ProfilesController < ApplicationController
  before_action :authenticate_user!
  
  def show
    render json: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
  end

  def update
    if current_user.update(profile_params)
      if params[:avatar].present?
        current_user.avatar.purge if current_user.avatar.attached?
        current_user.avatar.attach(params[:avatar])
      end

      render json: {
        status: {code: 200, message: "profile updated successfully"},
        data: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
      }
    else
      render json: {
        status: {code: 422, message: current_user.errors.full_messages.join(", ")}
      }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.permit(:username, :phone_number, :address, :avatar)
  end
end
