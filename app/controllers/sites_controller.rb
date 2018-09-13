class SitesController < BaseController
  before_action(only: %i(diagram import)) do
    authentication.role.can_edit_schema or
      render_invalid_permissions_error!
  end

  before_action(only: %i(update)) do
    (
      authentication.role.can_edit_favicon ||
        authentication.role.can_edit_site
    ) or render_invalid_permissions_error!
  end

  before_action(only: %i(deploy)) do
    (
      authentication.role.can_publish_to_production
    ) or render_invalid_permissions_error!
  end

  before_action :ensure_payload_schema!, only: :update

  skip_before_action :ensure_content_type_header!,
    only: [:import, :export]
  skip_before_action :ensure_accept_header!,
    only: [:deploy_webook, :diagram, :export]

  def show
    render json: current_site, include: params.fetch(:include, "").split(",")
  end

  def export
    json_export = GenerateSiteJson.new(current_site).create
    send_file json_export, filename: "site.json", type: "application/json"
  end

  def diagram
    diagram = GenerateSiteDiagram.new(current_site).create
    send_file diagram, filename: "site.pdf", type: "application/pdf"
  end

  def import
    ImportSite.new(current_site, params, current_role, current_user).call
    render json: current_site, status: 200
  end

  def update
    site = UpdateSite.new(current_site, payload, current_role).call
    render json: site,
      status: 200
  end
end
