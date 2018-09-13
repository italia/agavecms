class AccessTokenSerializer < ApplicationSerializer
  attributes :name, :token, :hardcoded_type
  belongs_to :role
end
