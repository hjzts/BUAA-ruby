class CreateDesigns < ActiveRecord::Migration[7.2]
  def change
    create_table :designs do |t|
      t.integer :sales, default: 0
      t.string :design_number, null: false

      t.timestamps
    end

    add_index  :designs, :design_number, unique: true
  end
end
