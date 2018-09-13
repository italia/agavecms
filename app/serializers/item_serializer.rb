class ItemSerializer < ApplicationSerializer
  attributes :updated_at, :is_valid
  belongs_to :item_type

  def position
    if object.item_type.sortable
      object.position
    end
  end

  def version
    object.log_version
  end

  # rubocop:disable all
  def attributes(*args)
    fields = object.item_type.fields.to_a
    site = object.item_type.site
    result = AttributesDumper.new(
      fields, site, object.data,
      true, false,
      true, false,
      instance_options[:item_uploads_cache] || {}
    ).dumped_attributes.symbolize_keys

    if object.item_type.sortable || object.item_type.tree
      result[:position] = object.position
    end

    if object.item_type.tree
      result[:parent_id] = if object.parent_id
                             object.parent_id.to_s
                           end
    end

    super(*args).merge(result)
  end
  # rubocop:enable all
end
