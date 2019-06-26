# Rails Tests

## Setup

```shell
$ export DATABASE_URL="postgresql://postgres@localhost/agave_test"
$ RAILS_ENV=test rails db:create db:migrate
```

```shell
$ rake spec
```

# Integration Tests

## Development Mode

Run the following in separate shells:

```sh
$ RAILS_ENV=test WEB_CONCURRENCY=1 rails server
```

```sh
$ yarn dev
```

```sh
$ yarn cy:dev
```
