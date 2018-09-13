class DeployJob < ApplicationJob
  queue_as :default

  def perform(deploy_event_id)
    BuildSite.new(deploy_event_id).perform
  end
end
