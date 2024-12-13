class CreateProductColors < ActiveRecord::Migration[7.2]
  def change
    create_table :product_colors do |t|
      t.references :product, null: false, foreign_key: true
      t.references :color, null: false, foreign_key: true
      t.decimal :price_adjustment, precision: 10, scale: 2, default: 0.0

      t.timestamps
    end

    add_index :product_colors, [:product_id, :color_id], unique: true
  end
end
