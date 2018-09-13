module ItemMigration
  class LocalizeGlobalSeo
    attr_reader :site, :previously_localized

    def initialize(site, previously_localized)
      @site = site
      @previously_localized = previously_localized
    end

    def call
      ActiveRecord::Base.record_timestamps = false
      site.update_attributes!(global_seo: global_seo)
    ensure
      ActiveRecord::Base.record_timestamps = true
    end

    private

    def global_seo
      site.locales.inject({}) do |acc, locale|
        acc[locale] = if locale == site.main_locale && !previously_localized
                        site.global_seo
                      elsif previously_localized
                        site.global_seo[locale]
                      end
        acc
      end
    end
  end
end
