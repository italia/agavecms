class DumpsController < BaseController
  before_action(only: %i(diagram)) do
    authentication.role.can_edit_schema or
      render_invalid_permissions_error!
  end

  skip_before_action :ensure_accept_header!,
    only: [:full_dump]

  def full_dump
    dump_success = dump.perform

    if dump_success
      send_file dump.location,
        filename: dump.file_name,
        type: "text/plain"
    else
      render_error ApiError.new("NOT_FOUND"), status: 404
    end
  end

  private

  def dump
    @dump ||= GenerateDump.new
  end
end
