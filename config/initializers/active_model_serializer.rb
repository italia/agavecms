module ActiveModel
  # class Serializer
  #   class Adapter
  #     class JsonApi < Adapter
  #       def object_details(object, options)
  #         options[:required_fields] = [:id, :type]
  #         attributes = object.attributes(options)
  #         result = {
  #           id: attributes.delete(:id).to_s,
  #           type: attributes.delete(:type)
  #         }
  #         if attributes.any?
  #           result[:attributes] = attributes
  #         end
  #         result
  #       end

  #       def attributes_for_serializer(serializer, options)
  #         if serializer.respond_to?(:each)
  #           result = []
  #           serializer.each do |object|
  #             options[:fields] = @fieldset && @fieldset.fields_for(serializer)
  #             result << cache_check(object) do
  #               result << object_details(object, options)
  #             end
  #           end
  #         else
  #           options[:fields] = @fieldset && @fieldset.fields_for(serializer)
  #           options[:required_fields] = [:id, :type]
  #           result = cache_check(serializer) do
  #             object_details(serializer, options)
  #           end
  #         end
  #         result
  #       end
  #     end
  #   end
  # end

  Serializer.config.adapter = ::ActiveModelSerializers::Adapter::JsonApi
  Serializer.config.jsonapi_resource_type = :singular
  Serializer.config.key_transform = :underscore
end
