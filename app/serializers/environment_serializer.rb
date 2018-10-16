class EnvironmentSerializer < ApplicationSerializer
  attributes :name,
    :git_repo_url,
    :frontend_url,
    :deploy_status,
    :deploy_adapter,
    :deploy_settings
end
