class CreateOrders < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.string :recipient_name, null: false
      t.string :shipping_address, null: false
      t.string :phone_number, null: false
      t.string :postal_code, null: false
      t.string :status, null: false, default: 'pending'
      t.decimal :total_amount, precision: 10, scale: 2, null: false
      t.datetime :paid_at
      t.datetime :shipped_at
      t.datetime :delivered_at
      t.datetime :cancelled_at
      t.text :cancellation_reason

      t.timestamps
    end

    add_index :orders, :status
    add_index :orders, :created_at
  end
end
