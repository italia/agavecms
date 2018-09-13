class UploadQuery
  class InvalidPermissions < StandardError
  end

  attr_reader :site, :params, :site_uploads

  def initialize(site, params)
    @site = site
    @params = params
    @site_uploads = site.uploads
  end

  def scope
    scope = starting_scope
    scope = order(scope)
    [scope.limit(page_limit).offset(page_offset), scope.count]
  end

  private

  def order(scope)
    if sort_direction == "asc"
      scope.order("created_at ASC")
    else
      scope.order("created_at DESC")
    end
  end

  def starting_scope
    scope = site_uploads

    if query
      scope = filter_by_query(scope)
    end

    if type
      scope = filter_by_type(scope)
    end

    scope
  end

  def filter_by_query(scope)
    scope.where(
      "title ILIKE :query OR alt ILIKE :query OR path ILIKE :query",
      query: "%#{query}%"
    )
  end

  def filter_by_type(scope)
    case type
    when "file"
      scope.where("upper(format) IN (?)", Upload::TEXT_FORMATS)
    when "image"
      scope.where("upper(format) IN (?)", Upload::IMAGE_FORMATS)
    when "video"
      scope.where("upper(format) IN (?)", Upload::VIDEO_FORMATS)
    when "not_used"
      scope.where("(SELECT COUNT(*) FROM item_uploads WHERE item_uploads.upload_path = uploads.path) = 0")
    when "other"
      all_others = (
        Upload::VIDEO_FORMATS +
        Upload::IMAGE_FORMATS +
        Upload::TEXT_FORMATS
      )

      scope.where.not("upper(format) IN (?)", all_others)
    else
      scope
    end
  end

  def sort
    params.fetch(:sort, {}).symbolize_keys
  end

  def sort_criteria
    :updated_at
  end

  def sort_direction
    sort.fetch(:direction, "desc")
  end

  def filters
    params.fetch(:filter, {}).symbolize_keys
  end

  def page
    params.fetch(:page, {}).symbolize_keys
  end

  def page_limit
    [page.fetch(:limit, 30).to_i, 500].min
  end

  def page_offset
    page.fetch(:offset, 0).to_i
  end

  def query
    filters[:query].presence
  end

  def type
    filters[:type].presence
  end
end
