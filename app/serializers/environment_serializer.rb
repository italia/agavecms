class EnvironmentSerializer < ApplicationSerializer
  attributes :name, :git_repo_url, :frontend_url
end
