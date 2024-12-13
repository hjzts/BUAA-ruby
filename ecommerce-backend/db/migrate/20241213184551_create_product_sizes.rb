class CreateProductSizes < ActiveRecord::Migration[7.2]
  def change
    create_table :product_sizes do |t|
      t.references :product, null: false, foreign_key: true
      t.references :size, null: false, foreign_key: true
      t.integer :stock_quantity, default: 0
      t.decimal :price_adjustment, precision: 10, scale: 2, default: 0.0

      t.timestamps
    end

    add_index :product_sizes, [:product_id, :size_id], unique: true
  end
end
