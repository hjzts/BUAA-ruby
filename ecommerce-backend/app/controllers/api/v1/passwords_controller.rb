class Api::V1::PasswordsController < ApplicationController
  before_action :authenticate_user!

  def update
    if current_user.valid_password?(params[:current_password])
      if current_user.update(password_params)
        render json: {
          status: { code: 200, message: "Passwords updated successfully." }
        }
      else
        render json: {
          status: { code: 422, message: current_user.errors.full_messages.join(", ") }
        }, status: :unprocessable_entity
      end
    else
      render json: {
        status: { code: 401, message: "Current password is incorrect." }
      }, status: :unprocessable_entity
    end
  end

  private 

  def password_params
    params.permit(:password, :password_confirmation)
  end
end
