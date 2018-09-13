Rails.application.configure do
  config.cache_classes = false
  config.eager_load = false
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = false
  config.action_mailer.raise_delivery_errors = false
  config.active_support.deprecation = :log
  config.active_record.migration_error = :page_load
  config.action_view.raise_on_missing_translations = true
  config.action_mailer.delivery_method = :letter_opener
  config.active_record.dump_schema_after_migration = true

  config.after_initialize do
    Bullet.enable = true
    Bullet.console = true
    Bullet.bullet_logger = true
  end
end
