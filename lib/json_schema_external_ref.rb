require "json"

class JsonSchemaExternalRef
  attr_reader :source_path

  def initialize(source_path)
    @source_path = source_path
  end

  def expanded
    replace_external_refs(source)
  end

  private

  def replace_external_refs(obj)
    if obj.is_a? Hash
      if obj["$externalRef"]
        external_path = resolve_path(obj["$externalRef"])
        JsonSchemaExternalRef.new(external_path).expanded
      elsif obj["$mergeExternalRef"]
        external_path = resolve_path(obj.delete("$mergeExternalRef"))
        obj.merge JsonSchemaExternalRef.new(external_path).expanded
      else
        obj.each_with_object({}) do |(key, value), memo|
          memo[key] = replace_external_refs(value)
        end
      end
    else
      obj
    end
  end

  def source
    JSON.parse(File.read(source_path))
  end

  def resolve_path(path)
    File.expand_path(path, File.dirname(source_path))
  end
end
