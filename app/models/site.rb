class Site < ApplicationRecord
  STATUS_UNSTARTED = "unstarted".freeze
  STATUS_PENDING = "pending".freeze
  STATUS_SUCCESS = "success".freeze
  STATUS_FAIL = "fail".freeze

  STATUSES = [
    STATUS_UNSTARTED,
    STATUS_PENDING,
    STATUS_SUCCESS,
    STATUS_FAIL
  ]

  SSGS = %w(middleman hugo jekyll hexo metalsmith other)
  ALLOWED_TLDS = PAK::ValidatesHostname::ALLOWED_TLDS + ["ltd"]

  has_many :users,
    inverse_of: :site,
    dependent: :destroy

  has_many :access_tokens,
    inverse_of: :site,
    dependent: :destroy

  has_many :uploads,
    inverse_of: :site,
    dependent: :destroy,
    class_name: "Upload"

  has_many :item_types,
    inverse_of: :site,
    dependent: :destroy

  has_many :fields,
    through: :item_types

  has_many :items,
    through: :item_types

  has_many :menu_items,
    inverse_of: :site,
    dependent: :destroy

  has_many :deploy_events,
    inverse_of: :site,
    dependent: :destroy

  has_many :roles,
    inverse_of: :site,
    dependent: :destroy

  has_many :environments,
    inverse_of: :site,
    dependent: :destroy

  validates :domain,
    hostname: {
      require_valid_tld: true,
      valid_tlds: ALLOWED_TLDS,
      allow_blank: true
    },
    uniqueness: { allow_blank: true }

  validates :production_webhook_token,
    presence: true,
    uniqueness: true

  validates :name, :timezone,
    presence: true

  validates :theme,
    presence: true

  validate :check_presence_of_at_least_one_locale
  validate :check_timezone

  validates :production_deploy_status,
    presence: true,
    inclusion: { in: STATUSES }

  def self.by_domain(domain)
    where(domain: domain).
      first
  end

  def self.by_webhook_token(token)
    where(
      "production_webhook_token = :token",
      token: token
    ).first
  end

  def user_with_credentials(email, password)
    user = user_with_email(email)
    if user && user.authenticate(password)
      user
    end
  end

  def user_with_email(email)
    users.where(email: email).first
  end

  def user_with_invite_token(token)
    users.where(invite_token: token).first
  end

  def user_with_password_reset_token(token)
    users.where(password_reset_token: token).first
  end

  def item_type_by_id(id)
    item_types.where(id: id).first
  end

  def item_type_by_api_key(api_key)
    item_types.where(api_key: api_key).first
  end

  def item_by_id(id)
    items.where(id: id).first
  end

  def deployable?
    true
  end

  def main_locale
    locales.first
  end

  def url(path)
    "https://#{domain}#{path}"
  end

  def register_dump!(&block)
    notify = last_dump_at.nil?
    update_attributes!(last_dump_at: Time.now)
    block.call if notify
  end

  def editors_count
    users.where(invite_token: nil).count
  end

  def items_count
    items.count
  end

  def uploaded_bytes
    uploads.sum(:size)
  end

  def has_custom_domain?
    domain.present?
  end

  private

  def check_presence_of_at_least_one_locale
    if !locales || locales.empty?
      errors.add(:locales, :invalid)
      return
    end

    all_valid = locales.all? do |locale|
      LanguageList::LanguageInfo.find_by_iso_639_1(locale).present?
    end

    all_valid or errors.add(:locales, :invalid)
  end

  def check_timezone
    (timezone.present? && ActiveSupport::TimeZone[timezone].present?) or
      errors.add(:timezone, :invalid)
  end
end
