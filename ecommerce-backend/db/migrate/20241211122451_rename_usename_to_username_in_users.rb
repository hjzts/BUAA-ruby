class RenameUsenameToUsernameInUsers < ActiveRecord::Migration[7.2]
  def change
    rename_column :users, :usename, :username
  end
end
