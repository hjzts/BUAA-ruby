class ProductDesignSerializer
  include JSONAPI::Serializer
  attributes :price_adjustment

  attribute :design_number do |product_design|
    product_design.design.design_number
  end

  attribute :sales do |product_design|
    product_design.design.sales
  end
end
