class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_one_attached :avatar

  validates :username, presence: true
  validates :role, inclusion: { in: %w[admin buyer] }

  def avatar_url
    Rails.application.routes.url_helpers.url_for(avatar) if avatar.attached?
  end

  def generate_jwt
    JWT.encode(
      {
        sub: id,
        jti: jti,
        exp: 24.hours.from_now.to_i
      },
      Rails.application.credentials.devise_jwt_secret_key!
    )
  end

  def admin?
    role == "admin"
  end

  def buyer?
    role == "buyer"
  end
end
