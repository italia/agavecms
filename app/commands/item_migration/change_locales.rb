module ItemMigration
  class ChangeLocales
    attr_reader :site, :old_locales, :new_locales

    def initialize(site, old_locales)
      @site = site
      @old_locales = old_locales
      @new_locales = site.locales
    end

    def call
      return if old_locales.to_set == new_locales.to_set

      change_locales!
      change_global_seo!
    end

    def change_locales!
      locales_to_add = new_locales - old_locales
      locales_to_keep = new_locales - locales_to_add
      locales_to_remove = old_locales - locales_to_keep

      site.item_types.each do |item_type|
        if item_type.fields.localized.any?
          ChangeItemTypeLocales.new(
            item_type,
            locales_to_add,
            locales_to_keep,
            locales_to_remove
          ).call
        end
      end
    end

    def change_global_seo!
      if old_locales.size > 1 && new_locales.size == 1
        DelocalizeGlobalSeo.new(site).call
      elsif new_locales.size > 1
        LocalizeGlobalSeo.new(site, old_locales.size > 1).call
      end
    end
  end
end
