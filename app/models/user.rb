class User < ApplicationRecord
  belongs_to :site,
    inverse_of: :users

  belongs_to :role,
    inverse_of: :users

  validates :email, :first_name, :last_name, :site, :role,
    presence: true

  validates :email,
    email: true,
    uniqueness: { scope: :site_id }

  validates :password_digest, presence: true, if: :registered?

  validates_length_of :password,
    maximum: ActiveModel::SecurePassword::MAX_PASSWORD_LENGTH_ALLOWED

  has_secure_password validations: false

  def authenticate(password)
    password_digest && super(password)
  end

  def registered?
    !invite_token
  end

  def email_address_with_name
    "#{first_name} #{last_name} <#{email}>"
  end
end
