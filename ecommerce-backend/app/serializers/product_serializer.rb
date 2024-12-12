class ProductSerializer
  include JSONAPI::Serializer

  attributes :id, :product_name, :description, :price,
             :stock_quantity, :sales_count, :status, :created_at

  attribute :image_url do |product|
    product.image_url
  end

  attribute :in_stock do |product|
    product.in_stock?
  end
end
