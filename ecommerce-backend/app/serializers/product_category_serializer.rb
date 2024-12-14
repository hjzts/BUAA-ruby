class ProductCategorySerializer
  include JSONAPI::Serializer
  attributes :product_id, :category_id

  attribute :category_name do |product_category|
    product_category.category.name
  end
end
