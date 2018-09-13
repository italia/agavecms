class ItemsAssociated
  attr_reader :items, :item_type

  def initialize(items, item_type)
    @items = Array(items)
    @item_type = item_type
  end

  def call
    if linked_to_item?
      item_type.items.where(condition)
    else
      []
    end
  end

  def condition
    (
      one_conditions +
      many_conditions(Agave::FieldType::Links) +
      many_conditions(Agave::FieldType::RichText)
    ).inject(:or)
  end

  def linked_to_item?
    (
      one_conditions +
      many_conditions(Agave::FieldType::Links) +
      many_conditions(Agave::FieldType::RichText)
    ).any?
  end

  def one_conditions
    field_paths_for_types(Agave::FieldType::Link).map do |path|
      left = extract_path(path, text: true)
      right = items.map do |item|
        Arel.sql(Item.connection.quote(item.to_param))
      end

      Arel::Nodes::In.new(left, right)
    end
  end

  def many_conditions(type_klass)
    field_paths_for_types(type_klass).map do |path|
      left = extract_path(path, text: false)
      item_ids = items.map { |item| Item.connection.quote(item.to_param) }
      right = Arel.sql("array[" + item_ids.join(", ") + "]")

      Arel::Nodes::InfixOperation.new("?|", left, right)
    end
  end

  def extract_path(path, text: false)
    path = path.map do |key|
      Arel.sql(Item.connection.quote(key))
    end

    Arel::Nodes::NamedFunction.new(
      text ? "jsonb_extract_path_text" : "jsonb_extract_path",
      [Item.arel_table[:data]] + path
    )
  end

  def field_paths_for_types(field_klass)
    result = []

    item_type.fields.each do |field|
      if field.field_type == field_klass.code
        result += paths_for_field(field)
      end
    end

    result
  end

  def paths_for_field(field)
    if field.localized?
      locales.map { |locale| [field.id.to_s, locale] }
    else
      [[field.id.to_s]]
    end
  end

  def item_types
    @item_types ||= item.site.item_types.includes(:fields)
  end

  def locales
    @locales ||= item_type.site.locales
  end
end
