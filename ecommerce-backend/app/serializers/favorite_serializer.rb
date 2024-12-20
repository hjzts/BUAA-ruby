class FavoriteSerializer
  include JSONAPI::Serializer
  attributes :added_at

  attribute :product do |favorite|
    {
      id: favorite.product.id,
      product_name: favorite.product.product_name,
      price: favorite.product.price,
      image_url: favorite.product.image_url,
      description: favorite.product.description,
      price: favorite.product.price,
      in_stock: favorite.product.stock_quantity.positive?
    }
  end
end
