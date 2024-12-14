class CartItemSerializer
  include JSONAPI::Serializer
  attributes :quantity, :added_at

  attribute :product do |cart_item|
    {
      id: cart_item.product.id,
      name: cart_item.product.product_name,
      price: cart_item.product.price,
      image_url: cart_item.product.image_url,
      stock_quantity: cart_item.product.stock_quantity
    }
  end

  attribute :subtotal do |cart_item|
    cart_item.subtotal
  end
end
