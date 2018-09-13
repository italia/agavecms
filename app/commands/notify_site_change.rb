class NotifySiteChange
  attr_reader :site

  def initialize(site)
    @site = site
  end

  def call
    site.update_attributes!(last_data_change_at: Time.now)
  end
end
