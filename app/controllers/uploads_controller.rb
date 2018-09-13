class UploadsController < BaseController
  before_action do
    role = authentication.role

    allowed = (
      role.can_perform_action_on_some_type?(current_site, "update") ||
        role.can_perform_action_on_some_type?(current_site, "create") ||
        role.can_edit_favicon
    )

    allowed or render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!,
    only: %i(create update)

  def index
    uploads, total_count = UploadQuery.new(
      current_site,
      params.to_unsafe_hash
    ).scope

    if total_count > 0
      render(
        json: uploads,
        meta: {
          total_count: total_count,
          uploaded_bytes: current_site.uploaded_bytes
        }
      )
    else
      render(
        json: {
          data: [],
          meta: {
            total_count: 0,
            uploaded_bytes: current_site.uploaded_bytes
          }
        }
      )
    end
  end

  def show
    render json: upload
  end

  def create
    upload = Upload.create(
      payload[:data][:attributes].merge(site: current_site)
    )

    render json: upload, status: 201
  end

  def update
    if upload.is_image
      upload.update_attributes!(payload[:data][:attributes])
    end

    render json: upload
  end

  def destroy
    upload.item_uploads.none? or
      raise InvalidRecordError.new(
      "Upload is currently in use!",
      ApiError.new("UPLOAD_IS_CURRENTLY_IN_USE")
    )

    upload.destroy!

    render json: upload
  end

  private

  def upload
    @upload ||= current_site.uploads.find(params[:id])
  end
end
