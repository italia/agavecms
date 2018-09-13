class UpdateUser
  attr_reader :site, :attributes, :user, :current_user, :role

  def initialize(site, user, attributes, current_user, role)
    data = attributes[:data].with_indifferent_access
    @attributes = data[:attributes]
    @role_id = data[:relationships][:role][:data][:id]
    @site = site
    @user = user
    @current_user = current_user
    @role = role
  end

  def call
    ActiveRecord::Base.transaction do
      if current_user == user
        params = attributes.slice(
          :email,
          :first_name,
          :last_name,
          :password
        )
        user.update_attributes!(params)
      end

      if role.can_manage_users
        user.update_attributes!(role: site.roles.find(@role_id))
      end
    end
  rescue ActiveRecord::RecordInvalid => error
    raise InvalidRecordError.from_record_invalid(error)
  end
end
