class AddEnvironmnetToDeployEvents < ActiveRecord::Migration[5.2]
  def change
    add_reference :deploy_events, :environment, foreign_key: true
  end
end
