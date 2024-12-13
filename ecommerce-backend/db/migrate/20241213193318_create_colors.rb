class CreateColors < ActiveRecord::Migration[7.2]
  def change
    create_table :colors do |t|
      t.string :rgb, null: false
      t.string :description

      t.timestamps
    end

    add_index :colors, :rgb, unique: true
  end
end
