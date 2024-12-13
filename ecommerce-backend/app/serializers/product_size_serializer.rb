class ProductSizeSerializer
  include JSONAPI::Serializer
  attributes :stock_quantity, :price_adjustment

  attribute :size_name do |product_size|
    product_size.size.size_name
  end

  attribute :size_description do |product_size|
    product_size.size.description
  end
end
