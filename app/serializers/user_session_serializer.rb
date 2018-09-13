class UserSessionSerializer < ApplicationSerializer
  type "session"

  has_one :user
end
