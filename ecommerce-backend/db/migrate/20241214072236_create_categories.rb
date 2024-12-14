class CreateCategories < ActiveRecord::Migration[7.2]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.text :description
      t.string :icon_url
      t.integer :parent_id
      t.integer :position, default: 0

      t.timestamps
    end

    add_index :categories, :name
    add_index :categories, :parent_id
    add_index :categories, :position
  end
end
