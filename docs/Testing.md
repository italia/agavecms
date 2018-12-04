# Setup

```shell
$ export DATABASE_URL="postgresql://postgres@localhost/agave_test"
$ RAILS_ENV=test rails db:create db:migrate
```

# Run Tests

```shell
$ rake spec
```
