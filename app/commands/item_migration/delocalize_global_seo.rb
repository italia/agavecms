module ItemMigration
  class DelocalizeGlobalSeo
    attr_reader :site

    def initialize(site)
      @site = site
    end

    def call
      ActiveRecord::Base.record_timestamps = false
      site.update_attributes!(global_seo: global_seo)
    ensure
      ActiveRecord::Base.record_timestamps = true
    end

    private

    def global_seo
      if site.global_seo
        site.global_seo[site.main_locale]
      end
    end
  end
end
