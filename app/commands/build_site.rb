class BuildSite
  attr_reader :deploy_event_id

  def initialize(deploy_event_id)
    @deploy_event_id = deploy_event_id
  end

  def perform
    case environment.deploy_adapter
    when "local_server"
      Deploy::OnLocalServer.new(deploy_event_id).perform
    when "secure_ftp_with_password"
      Deploy::OnSecureFtpWithPassword.new(deploy_event_id).perform
    else
      raise "Invalid deploy adapter"
    end
  end

  private

  def environment
    @environment ||= Environment.find_by_id(deploy_event.environment_id)
  end

  def deploy_event
    @deploy_event ||= DeployEvent.find_by_id(deploy_event_id)
  end
end
