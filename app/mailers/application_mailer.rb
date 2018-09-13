class ApplicationMailer < ActionMailer::Base
  layout "mailer"
  default from: ENV.fetch("FROM_EMAIL")
end
