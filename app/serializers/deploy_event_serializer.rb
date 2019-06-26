class DeployEventSerializer < ApplicationSerializer
  attributes :event_type, :data, :created_at
  belongs_to :site
  belongs_to :environment
end
