class CreateSizes < ActiveRecord::Migration[7.2]
  def change
    create_table :sizes do |t|
      t.string :size_name, null: false
      t.string :description

      t.timestamps
    end

    add_index :sizes, :size_name, unique: true
  end
end
