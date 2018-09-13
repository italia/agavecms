class AccessToken < ApplicationRecord
  belongs_to :site,
    inverse_of: :access_tokens

  belongs_to :role,
    inverse_of: :access_tokens

  validates :site, :name, :token, presence: true

  validates :token, uniqueness: true
  validates :name, uniqueness: { scope: :site_id }

  validates :hardcoded_type, inclusion: {
    in: %w(readonly admin), allow_blank: true
  }
  validate :check_presence_of_role_or_hardcoded_type

  private

  def check_presence_of_role_or_hardcoded_type
    if !role && hardcoded_type.blank?
      errors.add(:role, :required)
    end
  end
end
