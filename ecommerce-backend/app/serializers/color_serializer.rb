class ColorSerializer
  include JSONAPI::Serializer
  attributes :rgb, :description
end
