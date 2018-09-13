require "set"

class UpdateSite
  attr_reader :site, :attributes, :role

  def initialize(site, attributes, role)
    data = attributes[:data].with_indifferent_access
    @attributes = data[:attributes]
    @site = site
    @role = role
  end

  def call
    ItemValidator.new(
      item_type,
      attributes_to_validate,
      nil
    ).call

    if new_data != old_data
      change_items_locales_if_required do
        site.update_attributes!(new_data)
      end
      notify_changes!
    end

    site
  end

  private

  def change_items_locales_if_required
    old_locales = site.locales
    yield
    ItemMigration::ChangeLocales.new(site, old_locales).call
  end

  def notify_changes!
    NotifySiteChange.new(site).call
  end

  def attributes_to_validate
    @attributes_to_validate ||= attributes
  end

  def new_data
    @new_data ||= begin
      fields_to_dump = fields.select do |field|
        attributes_to_validate.keys.include?(field.api_key)
      end

      data = AttributesDumper.new(
        fields_to_dump, site, attributes,
        false, false,
        false, true
      ).dumped_attributes.deep_symbolize_keys
    end
  end

  def old_data
    @old_data ||= site.attributes.slice(*new_data.stringify_keys.keys)
  end

  def item_type
    @item_type ||= ItemType.new(
      name: "Site",
      api_key: "site",
      site: site,
      fields: fields
    )
  end

  def fields
    fields = []

    if role.can_edit_site
      fields += admin_fields
    end

    if role.can_edit_favicon
      fields += user_fields
    end

    fields
  end

  def user_fields
    [
      Field.new(
        field_type: "boolean",
        api_key: "no_index",
        validators: {}
      ),
      Field.new(
        field_type: "global_seo",
        api_key: "global_seo",
        localized: locales.size > 1,
        validators: {}
      ),
      Field.new(
        field_type: "image",
        api_key: "favicon",
        validators: {}
      )
    ]
  end

  def admin_fields
    [
      Field.new(
        field_type: "string",
        api_key: "name",
        appeareance: { type: "plain" },
        validators: { required: {} }
      ),
      Field.new(
        field_type: "string",
        api_key: "git_repo_url",
        appeareance: { type: "plain" },
        validators: {}
      ),
      Field.new(
        field_type: "string",
        api_key: "production_frontend_url",
        appeareance: { type: "plain" },
        validators: {}
      ),
      Field.new(
        field_type: "theme",
        api_key: "theme",
        validators: {}
      ),
      Field.new(
        field_type: "tokens",
        api_key: "locales",
        validators: { size: { min: 1 } }
      ),
      Field.new(
        field_type: "string",
        api_key: "timezone",
        validators: { required: {} },
        appeareance: { type: "plain" }
      )
    ]
  end

  def locales
    site.locales
  end
end
