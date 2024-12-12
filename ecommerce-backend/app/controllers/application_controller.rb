class ApplicationController < ActionController::API
    before_action :configure_permitted_parameters, if: :devise_controller?

    protected
  
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: %i[user_id, username])
  
      devise_parameter_sanitizer.permit(:account_update, keys: %i[user_id, username])
    end

    # # 检查是否为管理员
    # def ensure_admin!
    #   unless current_user&.role == "admin"
    #     render json: {
    #       error: "Unauthorized. Admin access required."
    #     }, status: :unauthorized
    #   end
    # end
    #
    # # 检查是否为特定用户或管理员
    # def ensure_owner_or_admin!(resource_user_id)
    #   unless current_user&.role == "admin" || current_user&.id == resource_user_id
    #     render json: {
    #       error: "Unauthorized. Admin or resource owner access required."
    #     }, status: :unauthorized
    #   end
    # end
    #
    # # 通用错误处理
    # def handle_authorization_error
    #   render json: {
    #     error: "You are not authorized to perform this action."
    #   }, status: :unauthorized
    # end

end
