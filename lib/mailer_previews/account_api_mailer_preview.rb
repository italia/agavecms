class AccountApiMailerPreview < ActionMailer::Preview
  def reset_password
    account = Account.first
    account.password_reset_token = "XXX"

    AccountApiMailer.reset_password(account)
  end
end
