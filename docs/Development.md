# Setup

* Assicurati di aver installato [docker-compose](https://docs.docker.com/compose/install/#install-compose)
* Clona questo repository sul tuo computer. Cambia directory utilizzando
  il comando `cd agavecms`. Copia le variabili d'ambiente nella directory
  principale del progetto:

  ```shell
  $ ln -s docker/.env.development.docker .env
  ```

# Launch all containers

Lancia i containers tramite:

```shell
docker-compose -f docker/docker-compose-development.yml --project-name agave build
docker-compose -f docker/docker-compose-development.yml --project-name agave up
```

Una volta avviata l'applicazione puoi accedere al back-end all'indirizzo
`agave.lvh.me:3001` o all'indirizzo che hai dichiarato nella variabile
d'ambiente `APP_DOMAIN`. L'utente e la password sono disponibili all'interno
del file `.env` (vedi `ADMIN_EMAIL` e `ADMIN_PASSWORD`).

Dopo aver generato il sito statico, quest'ultimo è disponibile all'indirizzo
`agave.lvh.me:3002` o all'indirizzo che hai dichiarato nella variabile
d'ambiente `APP_DOMAIN` (alla porta `3002`).

# Stop containers

Nel caso in cui ha lanciato docker-compose in modalità _detach_, puoi
fermare l'esecuzione utilizzando il comando:

```shell
$ docker-compose -f docker/docker-compose-development.yml --project-name agave down
```

# Deploy without using images

Prima di lanciare l'applicazione assicurati di aver installato i seguenti
pacchetti:

* [Yarn](https://yarnpkg.com/lang/en/docs/install).
* [Node](https://github.com/creationix/nvm)
* [Ruby](https://github.com/rbenv/rbenv)

Successivamente:

* Eseguire la creazione del database, migrazione e seed con `rake db:create && rake db:migrate`. Le
  variabili d'ambiente necessarie per la creazione del database sono `APP_DOMAIN`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
  Per lanciare la creazione del database devi eseguire il comando: `APP_DOMAIN=<es. agave.lvh.me> ADMIN_EMAIL=<email> ADMIN_PASSWORD=<password> rake db:seed`
* Esegui rails server con `IMAGES_ENDPOINT=<endpoint delle immagini es. http://agave-images.lvh.me:39876/uploads> bundle exec rails server -b 0.0.0.0 -p 3000`
* Eseguire `yarn dev`

L'applicazione sarà disponibile all'indirizzo indicato dalla variabile
`agave.lvh.me:3000`.

# Shell Access

Per eseguire una shell all'interno di un container puoi utilizzare il
comando:

```shell
$ bin/docker_shell {app*|images|db|webserver}
```

## API Calls

Per verificare il corretto funzionamento delle API puoi:

Utilizzare il token di lettura:

```shell
$ curl \
  -H "Accept: application/json" \
  -H "Authorization: Api-Key rtoken" \
  http://agave.lvh.me:3000/api/site
```

O quello di scrittura

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
