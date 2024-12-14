class CreateFavorites < ActiveRecord::Migration[7.2]
  def change
    create_table :favorites do |t|
      t.references :user, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.datetime :added_at, null: false

      t.timestamps
    end

    add_index :favorites, [:user_id, :product_id], unique: true
  end
end
