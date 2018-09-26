class DeployEvent < ApplicationRecord
  REQUEST = "request".freeze
  REQUEST_FAILED = "request_failed".freeze
  RESPONSE_SUCCESS = "response_success".freeze
  RESPONSE_FAILURE = "response_failure".freeze
  RESPONSE_TIMEOUT = "response_timeout".freeze
  REQUEST_ABORTED = "request_aborted".freeze
  REQUEST_UNPROCESSABLE = "request_unprocessable".freeze

  EVENT_TYPES = [
    REQUEST,
    REQUEST_FAILED,
    RESPONSE_SUCCESS,
    RESPONSE_FAILURE,
    RESPONSE_TIMEOUT,
    REQUEST_ABORTED,
    REQUEST_UNPROCESSABLE
  ]

  belongs_to :site, inverse_of: :deploy_events
  belongs_to :environment, inverse_of: :deploy_events

  validates :site, :environment, presence: true
  validates :event_type, presence: true, inclusion: { in: EVENT_TYPES }

  scope :by_date_reverse, ->() { order("created_at desc") }
end
