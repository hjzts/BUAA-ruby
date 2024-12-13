class ProductColorSerializer
  include JSONAPI::Serializer
  attributes :price_adjustment

  attribute :color do |product_color|
    {
      rgb: product_color.color.rgb,
      description: product_color.color.description
    }
  end
end
