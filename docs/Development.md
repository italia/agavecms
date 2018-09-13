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

```shell
$ curl \
  -H "Accept: application/json" \
  -H "Authorization: Api-Key rwtoken" \
  http://agave.lvh.me:3000/site
```
