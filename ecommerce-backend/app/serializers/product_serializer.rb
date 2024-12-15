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

  # 产品尺码关联
  attribute :product_sizes do |product|
    product.product_sizes.map do |product_size|
      {
        id: product_size.id,
        size_id: product_size.size_id,
        stock_quantity: product_size.stock_quantity,
        price_adjustment: product_size.price_adjustment,
        size: {
          id: product_size.size.id,
          size_name: product_size.size.size_name,
          description: product_size.size.description
        }
      }
    end
  end

  # 产品颜色关联
  attribute :product_colors do |product|
    product.product_colors.map do |product_color|
      {
        id: product_color.id,
        color_id: product_color.color_id,
        price_adjustment: product_color.price_adjustment,
        color: {
          id: product_color.color.id,
          rgb: product_color.color.rgb,
          description: product_color.color.description
        }
      }
    end
  end

  # 产品设计关联
  attribute :product_designs do |product|
    product.product_designs.map do |product_design|
      {
        id: product_design.id,
        design_id: product_design.design_id,
        price_adjustment: product_design.price_adjustment,
        design: {
          id: product_design.design.id,
          design_number: product_design.design.design_number,
          sales: product_design.design.sales
        }
      }
    end
  end

  # 产品分类关联
  attribute :categories do |product|
    product.categories.map do |category|
      {
        id: category.id,
        name: category.name,
        description: category.description,
        icon_url: category.icon_url
      }
    end
  end
end
