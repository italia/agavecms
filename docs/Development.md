# Setup

```shell
$ ln -s docker/.env.development.docker .env
```

# Launch all containers

```shell
docker-compose -f docker/docker-compose-development.yml --project-name agave build
docker-compose -f docker/docker-compose-development.yml --project-name agave up
```

# Stop containers

```shell
$ docker-compose -f docker/docker-compose-development.yml --project-name agave down
```

# Deploy without using images

```
git clone {{repo}}
cd agave
docker-compose -f docker/docker-compose-checkout.yml --project-name agave build
docker-compose -f docker/docker-compose-checkout.yml --project-name agave up
```

# Shell Access

Run a shell inside the running container:

```shell
$ bin/docker_shell {app*|images|db|webserver}
```

## API Calls

Lettura:

```shell
$ curl \
  -H "Accept: application/json" \
  -H "Authorization: Api-Key rtoken" \
  http://agave.lvh.me:3000/api/site
```

Scrittura

```shell
$ curl \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -H "Authorization: Api-Key rwtoken" \
  -d '
  {
    "data": {
      "type": "item_type",
      "attributes": {
        "name": "Blog post",
        "api_key": "post",
        "singleton": false,
        "sortable": false,
        "tree": true,
        "ordering_direction": null
      },
      "relationships": {
        "ordering_field": {
          "data": null
        }
      }
    }
  }' \
  http://agave.lvh.me:3000/api/item-types
```
