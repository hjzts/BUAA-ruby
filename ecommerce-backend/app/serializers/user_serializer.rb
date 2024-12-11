class UserSerializer
  include JSONAPI::Serializer
  attributes :user_id, :username, :email, :id
end
