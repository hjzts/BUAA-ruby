class Category < ApplicationRecord
  has_many :product_categories, dependent: :destroy
  has_many :products, through: :product_categories

  # 树形结构关联
  belongs_to :parent, class_name: 'Category', optional: true
  has_many :children, class_name: 'Category', foreign_key: 'parent_id', dependent: :destroy

  validates :name, presence: true
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  default_scope { order(position: :asc) }
  scope :root_categories, -> { where(parent_id: nil) }

  # 获取所有祖先分类
  def ancestors
    ancestors = []
    current = self
    while current.parent
      ancestors << current.parent
      current = current.parent
    end
    ancestors.reverse
  end

  # 获取完整路径名称
  def full_path_name
    (ancestors.map(&:name) + [name]).join(' > ')
  end

  # 是否是叶子节点（没有子分类）
  def leaf?
    children.empty?
  end

  # 获取所有子孙分类
  def descendants
    children.each_with_object([]) do |child, descendants|
      descendants << child
      descendants.concat(child.descendants)
    end
  end
end
