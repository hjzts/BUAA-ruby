class OrderSerializer
  include JSONAPI::Serializer
  attributes :id, :recipient_name, :shipping_address, :phone_number, :postal_code, :status, :total_amount, :paid_at, :shipped_at, :delivered_at, :cancelled_at, :cancellation_reason, :created_at

  attribute :items do |order|
    order.order_items.map do |item|
      {
        id: item.id,
        product_name: item.product.product_name,
        description: item.product.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        image_url: item.product.image_url
      }
    end
  end
end
