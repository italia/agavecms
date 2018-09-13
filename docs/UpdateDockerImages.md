Login:

```
export DOCKER_ID_USER="agavecms"
docker login
```

agave_images:

```
docker build . --tag agave_images --file docker/images/Dockerfile
docker tag agave_images:latest agavecms/agave_images
docker push agavecms/agave_images
```

agave_app:

```
docker build \
  . \
  --tag agave_app \
  --file docker/app/Dockerfile \
  --build-arg NODE_ENV=production \
  --build-arg RAILS_ENV=production
docker tag agave_app:latest agavecms/agave_app
docker push agavecms/agave_app
```

agave_webserver:

```
docker build docker/webserver --tag agave_webserver
docker tag agave_webserver:latest agavecms/agave_webserver
docker push agavecms/agave_webserver
```
