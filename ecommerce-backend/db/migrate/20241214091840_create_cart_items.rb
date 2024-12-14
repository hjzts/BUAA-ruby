class CreateCartItems < ActiveRecord::Migration[7.2]
  def change
    create_table :cart_items do |t|
      t.references :user, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :quantity, null: false, default: 1
      t.datetime :added_at, null: false

      t.timestamps
    end

    add_index :cart_items, [:user_id, :product_id], unique: true
  end
end
