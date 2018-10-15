module Deploy
  class Deploy::OnSecureFtpWithIdentityFile
    attr_reader :deploy_event_id
    attr_reader :initial_path

    def initialize(deploy_event_id)
      @deploy_event_id = deploy_event_id
    end

    def perform
      @initial_path = Dir.pwd

      build_success = Build::StaticSite.new(deploy_event_id).perform

      if build_success
        Dir.chdir(tmp_path) do
          Dir.chdir(repo_path) do
            success = publish
            if !success
              failed!("Failed publish")
              return false
            end
          end
        end

        success!
      else
        return false
      end

      true
    end

    private

    def deploy_event
      @deploy_event ||= DeployEvent.find_by_id(deploy_event_id)
    end

    def environment
      @environment ||= Environment.find_by_id(deploy_event.environment_id)
    end

    def tmp_path
      File.join(initial_path, "tmp")
    end

    def repo_path
      File.join(tmp_path, repo_name)
    end

    def repo_name
      environment.frontend_url
    end

    def publish
      deploy_settings = environment.deploy_settings

      remote_directory = deploy_settings["remote_directory"]
      domain = deploy_settings["domain"]
      user = deploy_settings["user"]
      identity = deploy_settings["identity"]
      identity_file_name = "/tmp/identity_tmp"

      `printf %s "#{identity}" > #{identity_file_name}`
      `chmod 600 #{identity_file_name}`
      puts `rsync \
              --rsh=" \
                ssh \
                  -o StrictHostKeyChecking=no \
                  -i #{identity_file_name}" \
              -av build #{user}@#{domain}:#{remote_directory}`
      $?.success?
    end

    def repo_name
      environment.frontend_url
    end

    def success!
      update_event("OK", "success")
      update_deploy_status("success")
    end

    def failed!(message)
      update_event(message, "error")
      update_deploy_status("fail")
    end

    def update_event(message, status)
      deploy_event.update_attributes!(
        data: {message: message, status: status}
      )
    end

    def update_deploy_status(status)
      environment.update_attribute(:deploy_status, status)
    end
  end
end
