class InviteUser
  attr_reader :site, :attributes, :role_id

  def initialize(site, attributes)
    data = attributes[:data].with_indifferent_access
    @attributes = data[:attributes]
    @role_id = data[:relationships][:role][:data][:id]
    @site = site
  end

  def call
    allowed_params = [:email, :first_name, :last_name]
    params = attributes.slice(*allowed_params)
    user = site.users.create!(
      params.merge(role_id: role_id, invite_token: invite_token)
    )
#    SiteApiMailer.invitation(site, user).deliver_now
    user
  rescue ActiveRecord::RecordInvalid => error
    raise InvalidRecordError.from_record_invalid(error)
  end

  private

  def invite_token
    @invite_token ||= SecureRandom.hex(25)
  end
end
