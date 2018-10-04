class ImportSite
  attr_reader :site, :payload, :role, :user

  def initialize(site, payload, role, user)
    @payload = read_payload!(payload)
    @site = site
    @role = role
    @user = user
  end

  def call
    json = JSON.parse(payload, symbolize_names: true)
    output = {
      item_types: {},
      fields: {},
      roles: {},
      menu_items: {}
    }

    ActiveRecord::Base.transaction do
      site.items.each do |item_ex|
        DestroyItem.new(item_ex).call
      end
      site.items.reset
      site.item_types.each do |item_type_ex|
        DestroyItemType.new(item_type_ex).call
      end
      site.item_types.reset
      site.menu_items.each do |item_menu_ex|
        DestroyMenuItem.new(item_menu_ex).call
      end
      site.menu_items.reset

      json[:item_types].each do |item|
        if item[:type] == "item_type"
          new_item_type = ItemType.new
          UpsertItemType.new(site, new_item_type, item, true).call
          output[:item_types].merge!({
            item[:id] => new_item_type.id
          })
        end
      end

      json[:fields].each do |field|
        if field[:type] == "field"
          item_item_type = site.item_types
            .find(output[:item_types][field[:relationships][:item_type][:data][:id]])
          validators_replace_item!(field, output[:item_types], item_item_type.id)
          appeareance_replace_field!(field, output[:fields])
          new_field = Field.new(item_type: item_item_type)
          UpsertField.new(new_field, {data: field}).call
          output[:fields].merge!({
            field[:id] => new_field.id
          })
        end
      end

      add_root_menu!(json[:menu_items], site, output)
      add_child_menu!(json[:menu_items], site, output)

      site.users.where("id != ?", user.id).each do |user_ex|
        DestroyUser.new(site, user_ex, role, user).call
      end
      site.users.reset
      site.roles.where("id != ?", user.role.id).each do |role_ex|
        role_ex.destroy!
      end
      site.roles.reset

      json[:roles].each do |role|
        if role[:type] == "role" && role[:attributes][:name] != "Admin"
          new_role = site.roles.new
          UpsertRole.new(site, new_role, {data: role}).call
          output[:roles].merge!({
            role[:id] => new_role.id
          })
        end
      end
      notify_changes!
    end

    {data: output}
  rescue ActiveRecord::RecordInvalid => error
    raise InvalidRecordError.from_record_invalid(error)
  end

  private

  def read_payload!(payload)
    if !payload[:json_url].blank? && payload[:file] == "undefined"
      open(payload[:json_url]).read
    else
      File.read(payload[:file].tempfile)
    end
  end

  def notify_changes!
    NotifySiteChange.new(site).call
  end

  def validators_replace_item!(hash, items, new_id)
    if hash.key?(:attributes) && hash[:attributes].key?(:validators)
      if hash[:attributes][:validators].key?(:rich_text_blocks)
        res = hash[:attributes][:validators][:rich_text_blocks][:item_types].map do |i|
          items[i.to_s].to_s
        end
        hash[:attributes][:validators][:rich_text_blocks][:item_types] = res
      end
      if hash[:attributes][:validators].key?(:items_item_type)
        res = hash[:attributes][:validators][:items_item_type][:item_types].map do |i|
          items[i.to_s].to_s
        end
        hash[:attributes][:validators][:items_item_type][:item_types] = res
      end
      if hash[:attributes][:validators].key?(:item_item_type)
        res = hash[:attributes][:validators][:item_item_type][:item_types].map do |i|
          items[i.to_s].to_s
        end
        hash[:attributes][:validators][:item_item_type][:item_types] = res
      end
    end
  end

  def appeareance_replace_field!(hash, fields)
    if hash[:attributes].key?(:appeareance)
      if hash[:attributes][:appeareance].key?(:title_field_id)
        new_id = fields[hash[:attributes][:appeareance][:title_field_id]]
        hash[:attributes][:appeareance][:title_field_id] = new_id.to_s
      end
    end
  end

  def add_root_menu!(payload, site, output)
    payload.each do |menu|
      if menu[:type] == "menu_item" && menu.key?(:relationships) &&
          menu[:relationships].key?(:parent) &&
          menu[:relationships][:parent].key?(:data) &&
          menu[:relationships][:parent][:data].blank?
        link_item = related_item_replace!(site, output, menu)
        if link_item
          new_menu = MenuItem.new
          UpsertMenuItem.new(site, new_menu, {data: menu}).call
          output[:menu_items].merge!({
            menu[:id] => new_menu.id
          })
        end
      end
    end
  end

  def add_child_menu!(payload, site, output)
    payload.each do |menu|
      if menu[:type] == "menu_item" && menu.key?(:relationships) &&
          menu[:relationships].key?(:parent) &&
          menu[:relationships][:parent].key?(:data) &&
          !menu[:relationships][:parent][:data].blank?
        link_item = related_item_replace!(site, output, menu)
        parent_menu = parent_menu_replace!(site, output, menu)
        if link_item && parent_menu
          new_menu = MenuItem.new
          UpsertMenuItem.new(site, new_menu, {data: menu}).call
          output[:menu_items].merge!({
            menu[:id] => new_menu.id
          })
        end
      end
    end
  end

  def related_item_replace!(site, output, menu)
    if menu[:relationships].key?(:item_type) &&
        !menu[:relationships][:item_type][:data].blank?
      item = site.item_types
        .find(output[:item_types][menu[:relationships][:item_type][:data][:id]])
      if item
        menu[:relationships][:item_type][:data][:id] = item.id
        return item
      end
    end
  end

  def parent_menu_replace!(site, output, menu)
    if menu[:relationships].key?(:parent) &&
        !menu[:relationships][:parent][:data].blank?
      item = site.menu_items
        .find(output[:menu_items][menu[:relationships][:parent][:data][:id]])
      if item
        menu[:relationships][:parent][:data][:id] = item.id
        return item
      end
    end
  end
end
