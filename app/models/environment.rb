class Environment < ApplicationRecord
  belongs_to :site,
    inverse_of: :environments

  has_many :deploy_events,
    inverse_of: :site,
    dependent: :destroy

  validates :site, :name,
    presence: true
end
