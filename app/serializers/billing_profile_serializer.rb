class BillingProfileSerializer < ApplicationSerializer
  attributes :full_name
  attributes :company
  attributes :card_last_4
  attributes :next_billing_at
  attributes :card_type
  attributes :card_expiry_month, :card_expiry_year
  attributes :address_line_1
  attributes :address_line_2
  attributes :email
  attributes :is_active

  def is_active
    object.active?
  end
end
