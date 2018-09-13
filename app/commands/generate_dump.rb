class GenerateDump
  def perform
    pg_dump_cmd = pg_dump
    dump_cmd = dump

    if !pg_dump_cmd && !dump_cmd
      failed!("Fail on dump!")

      return false
    end

    clean!

    true
  end

  def location
    "./tmp/agave_dump"
  end

  def file_name
    dump_name
  end

  private

  def pg_dump
    `pg_dump \
       -h db \
       -U postgres \
       --no-acl \
       --no-owner \
       #{db_name} \
     > ./tmp/#{dump_db_file_name}`

    $?.success?
  end

  def dump
    `tar -czf tmp/agave_dump \
       --exclude=public/uploads/cache \
       --exclude=public/uploads/imageflow_log \
       --transform=s/tmp/db/ \
       public/uploads \
       tmp/#{dump_db_file_name}`

    $?.success?
  end

  def clean!
    `rm -rf tmp/#{dump_db_file_name}`
  end

  def dump_name
    "dump_#{print_time}.tar.gz"
  end

  def dump_db_file_name
    "#{db_name}_#{print_time}_.dump"
  end

  def db_name
    "agave_api_#{Rails.env}"
  end

  def print_time
    @print_time ||= Time.zone.now.strftime('%Y_%m_%d_h_%H_%M_%S')
  end

  def failed!(message)
    puts message
  end
end
