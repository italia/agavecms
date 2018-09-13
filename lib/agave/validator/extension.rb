module Agave
  module Validator
    class Extension < Base
      attribute :extensions, Array[String]
      validates :extensions, length: { minimum: 1 }

      def call(value, _locale, _item_id)
        return true if extensions.nil?
        return true if value.nil?

        extensions.any? do |extension|
          value["path"].downcase.ends_with?(".#{extension.downcase}")
        end
      end
    end
  end
end
