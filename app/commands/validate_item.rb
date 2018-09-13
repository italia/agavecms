require "set"

class ValidateItem
  attr_reader :site, :attributes, :item_id

  def initialize(site, attributes, item_id)
    data = attributes[:data].with_indifferent_access
    @item_type_id = data[:relationships][:item_type][:data][:id]
    @attributes = data[:attributes]
    @item_id = item_id
    @site = site
  end

  def call
    check_for_valid_item_type!
    ItemValidator.new(item_type, attributes, item_id).call
    true
  end

  private

  def item_type
    @item_type ||= site.item_type_by_id(@item_type_id)
  end

  def check_for_valid_item_type!
    item_type or
      raise InvalidRecordError.new(
      "invalid item type \"#{@item_type_id}\"",
      ApiError.new("INVALID_TYPE")
    )
  end
end
