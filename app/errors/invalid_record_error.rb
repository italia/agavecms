class InvalidRecordError < RuntimeError
  attr_reader :errors

  def self.from_record_invalid(error)
    errors = error.record.errors.map do |field, code|
      ApiError.new("INVALID_FIELD", field: field, code: code)
    end

    new("Invalid data", errors)
  end

  def initialize(message = nil, errors = nil)
    super(message)
    @errors = Array(errors)
  end
end
