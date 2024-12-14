class CreateOrderItems < ActiveRecord::Migration[7.2]
  def change
    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :quantity, null: false
      t.decimal :unit_price, precision: 10, scale: 2, null: false
      t.decimal :total_price, precision: 10, scale: 2, null: false

      t.timestamps
    end

    # 添加复合索引，用于优化订单商品的联合查询
    add_index :order_items, [:order_id, :product_id]

    # 添加total_price索引，用于价格范围查询和统计
    add_index :order_items, :total_price

    # 添加product_id和created_at的复合索引，用于商品销量统计
    add_index :order_items, [:product_id, :created_at]
  end
end
