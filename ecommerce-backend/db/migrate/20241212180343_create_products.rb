class CreateProducts < ActiveRecord::Migration[7.2]
  def change
    create_table :products do |t|
      t.string :product_name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :stock_quantity, default: 0
      t.integer :sales_count, default: 0
      t.string :status, default: 'active'

      t.timestamps
    end

    add_index :products, :product_name
    add_index :products, :status
  end
end
