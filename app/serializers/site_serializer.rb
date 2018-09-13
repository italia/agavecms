class SiteSerializer < ApplicationSerializer
  BASE_ATTRIBUTES = [
    :name,
    :locales,
    :theme,
    :domain,
    :global_seo,
    :favicon,
    :no_index,
    :image_host
  ]

  EDITOR_ATTRIBUTES = [
    :last_data_change_at,
    :last_dump_at,
    :deployable,
    :production_deploy_status,
    :items_count
  ]

  ADMIN_ATTRIBUTES = [
    :timezone,
    :git_repo_url,
    :production_frontend_url
  ]

  attributes BASE_ATTRIBUTES

  has_many :users
  has_many :menu_items
  has_many :item_types
  has_many :roles

  def image_host
    ENV.fetch("IMAGES_ENDPOINT")
  end

  def attributes(options = {})
    data = super(options)

    additional_attributes = []

    if scope && scope.role.can_access_site
      additional_attributes += EDITOR_ATTRIBUTES
    end

    if scope && scope.role.can_edit_site
      additional_attributes += ADMIN_ATTRIBUTES
    end

    additional_attributes.each do |attr|
      data[attr] = if respond_to? attr
                     send(attr)
                   else
                     object.send(attr)
                   end
    end

    data
  end

  def deployable
    object.deployable?
  end

  def menu_items
    object.menu_items.includes(:children, :parent, :item_type)
  end

  def item_types
    object.item_types.includes(
      :fields,
      singleton_item: { item_type: [:fields, :site] }
    )
  end

  def items_count
    object.items.size
  end

  def production_frontend_url
    object.production_frontend_url
  end

  def git_repo_url
    object.git_repo_url
  end
end
