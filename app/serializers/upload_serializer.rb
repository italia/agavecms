class UploadSerializer < ApplicationSerializer
  attributes :size, :width, :height, :path, :format,
    :alt, :title, :is_image, :created_at
end
