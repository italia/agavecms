require "tempfile"
require "cgi"
require "json"

class GenerateSiteJson
  attr_reader :site

  def initialize(site)
    @site = site
  end

  def create
    models = ActiveModelSerializers::SerializableResource.new(
      site.item_types, include: ["fields"], except: ["items"]
    ).as_json
    menu = ActiveModelSerializers::SerializableResource.new(
      site.menu_items.order("parent_id DESC")
    ).as_json
    roles = ActiveModelSerializers::SerializableResource.new(
      site.roles
    ).as_json

    file = Tempfile.new("structure.json")
    file.binmode
    file.write(JSON.pretty_generate({
      item_types: models[:data],
      fields: models[:included],
      menu_items: menu[:data],
      roles: roles[:data]
    }))
    file.rewind()
    file
  end
end
