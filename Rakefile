# frozen_string_literal: true

require File.expand_path("config/application", __dir__)

Rails.application.load_tasks

unless Rails.env.production?
  require "rubocop/rake_task"
  RuboCop::RakeTask.new do |task|
    task.requires << "rubocop-rspec"
  end
end

task default: [:rubocop]

namespace :assets do
  desc "build JSON schemas (assets:precompile is called by Heroku buildpack)"
  task :precompile do
    `bundle exec bin/generate_docs`
  end
end
