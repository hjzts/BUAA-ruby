# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :configure_sign_in_params, only: [:create]
  skip_before_action :verify_signed_out_user, only: [:destroy]
  respond_to :json

  # POST /resource/sign_in
  def create
    # 检查是否存在current_user 且 登录邮箱与当前用户不同
    if current_user && current_user.email != sign_in_params[:email]
      # 记录要退出的用户信息，用户之后的消息提示
      old_user_email = current_user.email

      # 退出当前用户
      sign_out(current_user)

      # 尝试用新的凭证登录
      self.resource = warden.authenticate!(auth_options)

      # 登录新用户
      sign_in(resource_name, resource)

      # 生成新的 JWT token
      token = generate_jwt_token(resource)

      render json: {
        status: {
          code: 200,
          message: "Switched user from #{old_user_email} to #{resource.email}.",
          token: token
        },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      },status: :ok
    else
      # 正常的登录流程
      self.resource = warden.authenticate!(auth_options)
      sign_in(resource_name, resource)

      token = generate_jwt_token(resource)

      render json: {
        status: {
          code: 200,
          message: "Logged in successfully.",
          token: tokenz
        },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      },status: :ok
    end
  rescue StandardError => e
    render json: {
      status: {
        code: 401,
        message: "Invalid email or password."
      }
    },status: :unauthorized
  end

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end


  private

  def respond_with(resource, _opt = {})
    @token = request.env["warden-jwt_auth.token"]
    headers["Authorization"] = @token

    render json: {
      status: {
        code: 200, message: "Logged in successfully.",
        token: @token,
        data: {
          user: UserSerializer.new(resource).serializable_hash[:data][:attributes]
        }
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    Rails.logger.info("respond_to_on_destroy")

    if request.headers["Authorization"].present?
      jwt_payload = JWT.decode(request.headers["Authorization"].split.last,
                               Rails.application.credentials.devise_jwt_secret_key!).first

      current_user = User.find(jwt_payload["sub"])
    end

    if current_user
      render json: {
        status: 200,
        message: "Logged out successfully."
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end


  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:username, :email, :password])
  end

  private

  def generate_jwt_token(user)
    @token = request.env["warden-jwt_auth.token"]
    response.headers["Authorization"] = "Bearer #{@token}"
    @token
  end
end
