Login:

```
export DOCKER_ID_USER="{{il tuo utente su docker hub}}"
docker login
```

agave_images:

```
docker build ./docker/images/ --tag agavecms_images
docker tag agavecms_images:latest italia/agavecms_images
docker push italia/agavecms_images
```

agave_app:

```
docker build \
  . \
  --tag agavecms_app \
  --file docker/app/Dockerfile \
  --build-arg NODE_ENV=production \
  --build-arg RAILS_ENV=production
docker tag agavecms_app:latest italia/agavecms_app
docker push italia/agavecms_app
```

agave_webserver:

```
docker build ./docker/webserver --tag agavecms_webserver
docker tag agavecms_webserver:latest italia/agavecms_webserver
docker push italia/agavecms_webserver
```

## N.B.

Per poter aggiornare le immagini bisogna farsi aggiungere come
collaboratore all'organizzazione di
[docker hub Italia](https://hub.docker.com/u/italia/).
