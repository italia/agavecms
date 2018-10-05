class BuildSite
  attr_reader :deploy_event_id
  attr_reader :initial_path

  def initialize(deploy_event_id)
    @deploy_event_id = deploy_event_id
  end

  def perform
    @initial_path = Dir.pwd
    if !valid?
      failed!("Undefined params")
      return false
    end

    update_deploy_status("pending")

    Dir.chdir(tmp_path) do
      if !remote_matches?
        `rm -rf site`
      end

      if !cloned?
        success = clone_repo

        if !success
          failed!("Failed clone repo")
          return false
        end
      end

      Dir.chdir(repo_path) do
        success = pull_repo
        if !success
          failed!("Failed pull repo")
          return false
        end

        success = bundle
        if !success
          failed!("Failed bundle")
          return false
        end

        success = yarn_install
        if !success
          failed!("Failed yarn install")
          return false
        end

        success = agave_dump
        if !success
          failed!("Failed agave dump")
          return false
        end

        success = jekyll_build
        if !success
          failed!("Failed jekyll build")
          return false
        end

        success = webpack
        if !success
          failed!("Failed webpack")
          return false
        end

        `cp -r build ../build/#{repo_name}`
      end
    end

    success!
    true
  end

  def valid?
    return false if !deploy_event
    return false if !git_repo_url

    true
  end

  private

  def success!
    update_event("OK", "success")
    update_deploy_status("success")
  end

  def failed!(message)
    update_event(message, "error")
    update_deploy_status("fail")
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

  def deploy_event
    @deploy_event ||= DeployEvent.find_by_id(deploy_event_id)
  end

  def site
    @site ||= Site.find_by_id(deploy_event.site_id)
  end

  def environment
    @environment ||= Environment.find_by_id(deploy_event.environment_id)
  end

  def update_event(message, status)
    deploy_event.update_attributes!(
      data: {message: message, status: status}
    )
  end

  def update_deploy_status(status)
    environment.update_attribute(:deploy_status, status)
  end

  def git_repo_url
    environment.git_repo_url
  end

  def cloned?
    File.directory?(repo_name)
  end

  def remote_matches?
    local_repo_name == git_repo_url
  end

  def local_repo_name
    return nil if !File.directory?(repo_path)

    Dir.chdir(repo_path) do
      `git remote get-url origin`
    end
  end

  def clone_repo
    puts `git clone #{git_repo_url} #{repo_name}`
    $?.success?
  end

  def pull_repo
    puts `git pull origin master`
    $?.success?
  end

  def bundle
    Bundler.with_clean_env do
      puts `bundle install`
    end
    $?.success?
  end

  def yarn_install
    puts `yarn install`
    $?.success?
  end

  def agave_dump
    Bundler.with_clean_env do
      puts `AGAVECMS_BASE_URL=#{agavecms_base_url} AGAVE_API_TOKEN=#{token} bundle exec agave dump`
    end
    $?.success?
  end

  def jekyll_build
    Bundler.with_clean_env do
      puts `JEKYLL_ENV=production bundle exec jekyll build --destination build/`
    end
    $?.success?
  end

  def webpack
    puts `yarn build:assets`
    $?.success?
  end

  def token
    AccessToken.first.token
  end

  def agavecms_base_url
    "http://app:3000"
  end
end
