class Invoice
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_reader :id, :date, :total, :status, :billing_profile

  def initialize(id, date, total, status, billing_profile)
    @id = id
    @date = date
    @total = total
    @status = status
    @billing_profile = billing_profile
  end
end
