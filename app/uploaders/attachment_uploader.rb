class AttachmentUploader < Shrine
  plugin :upload_endpoint

  def generate_location(io, context)
    parts = io.original_filename.split(".")
    name = parts[0..-2].join(".").delete(' ')
    ext = parts[-1]
    nano_timestamp = Time.now.to_f.to_s.tr(".", "")
    name + "-" + nano_timestamp + "." + ext
  end
end
