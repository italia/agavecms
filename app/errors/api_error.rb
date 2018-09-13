class ApiError
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_reader :code, :details

  def initialize(code, details = {})
    @code = code
    @details = details
  end

  def attributes
    { code: code, details: details }
  end

  alias_method :id, :code
end
