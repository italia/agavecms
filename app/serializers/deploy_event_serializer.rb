class DeployEventSerializer < ApplicationSerializer
  attributes :event_type, :data, :created_at, :environment
  belongs_to :site
end
