class AddAccountIdToSpaces < ActiveRecord::Migration[5.2]
  def change
    add_reference :spaces, :account, index: true, foreign_key: true
  end
end
