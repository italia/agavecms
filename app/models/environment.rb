class Environment < ApplicationRecord
  belongs_to :site,
    inverse_of: :environments

  validates :site, :name,
    presence: true
end
