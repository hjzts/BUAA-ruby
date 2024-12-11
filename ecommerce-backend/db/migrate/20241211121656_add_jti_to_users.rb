class AddJtiToUsers < ActiveRecord::Migration[7.2]
  def change
    add_index :users, :jti, unique: true
  end
end
