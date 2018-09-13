class LinkValidator
  def self.schema(file)
    @schemas ||= {}
    @schemas[file] ||= begin
                         path = Rails.root.join("schemas", "#{file}.json")
                         data = JsonSchemaExternalRef.new(path).expanded
                         schema = JsonSchema.parse!(data)
                         schema.expand_references!
                         schema
                       end
  end

  def self.find(file, property, rel)
    link = schema(file).
           properties.
           detect { |p, _schema| p.to_sym == property.to_sym }.
           last.
           links.
           detect { |l| l.rel.to_sym == rel.to_sym }

    link or raise "Cannot find definition for #{file}, #{property}, #{rel}"

    new(link)
  end

  def self.find_for_action(file, controller_name, action)
    find(
      file,
      controller_name.singularize,
      ACTION_TO_REL[action.to_sym] || action.to_sym
    )
  end

  ACTION_TO_REL = {
    index: :instances,
    show: :self,
    create: :create,
    update: :update
  }.freeze

  attr_reader :link

  def initialize(link)
    @link = link
  end

  def validate_schema(data)
    valid, errors = link.schema.validate(data)

    if !valid
      JsonSchema::SchemaError.aggregate(errors)
    else
      []
    end
  end

  def validate_target_schema(data)
    valid, errors = link.target_schema.validate(data)

    if !valid
      JsonSchema::SchemaError.aggregate(errors)
    else
      []
    end
  end
end
