class Authentication
  attr_reader :site, :role, :user

  def initialize(site, role, user = nil)
    @site = site
    @role = role
    @user = user
  end
end
