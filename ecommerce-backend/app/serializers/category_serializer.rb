class CategorySerializer
  include JSONAPI::Serializer
  attributes :name, :description, :icon_url, :position

  attribute :parent_id do |category|
    category.parent_id
  end

  attribute :children do |category|
    category.children.map do |child|
      {
        id: child.id,
        name: child.name,
        description: child.description,
        icon_url: child.icon_url,
        position: child.position
      }
    end
  end

  attribute :full_path_name do |category|
    category.full_path_name
  end
end
