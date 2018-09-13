class DestroyUser
  attr_reader :site, :user, :current_user, :role

  def initialize(site, user, role, current_user)
    @site = site
    @user = user
    @current_user = current_user
    @role = role
  end

  def call
    current_user == user and
      raise InvalidRecordError.new(
      "authenticated user cannot delete himself",
      ApiError.new("CANNOT_DESTROY_CURRENT_USER")
    )

    user.destroy!
  end
end
