class MakeDomainOptional < ActiveRecord::Migration[5.2]
  def change
    change_column_null :spaces, :domain, true
  end
end
