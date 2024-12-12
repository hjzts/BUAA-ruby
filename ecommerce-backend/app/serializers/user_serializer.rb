class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :user_id, :username, :email, :role, :phone_number, :address, :avatar_url, :created_at

  attribute :avatar_url do |user|
    user.avatar_url
  end
end
