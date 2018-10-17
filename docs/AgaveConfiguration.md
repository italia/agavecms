## 1. Prerequisiti

Per poter installare AgaveCMS è necessario installare [docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04) e [docker compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04).

### Installazione Docker (Ubuntu 18.04)

* Effettuare l'update del sistema: `sudo apt update && sudo apt upgrade`
* Installare alcuni prerequisiti per apt: `sudo apt install apt-transport-https ca-certificates curl software-properties-common`
* Aggiungere la chiave GPG per il repository ufficiale di Docker: `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
* Aggiungere il repository docker all'interno delle sorgenti APT: `sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"`
* Aggiornare il database dei pacchetti: `sudo apt update`
* Installare docker: `sudo apt install docker-ce`
* Controllare che l'installazione sia andata a buon fine: 
  ```
  $ sudo systemctl status docker
  ● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     Active: active (running) since Wed 2018-10-17 09:10:10 UTC; 57s ago
       Docs: https://docs.docker.com
   Main PID: 4944 (dockerd)
      Tasks: 18
     CGroup: /system.slice/docker.service
             ├─4944 /usr/bin/dockerd -H fd://
             └─4964 docker-containerd --config /var/run/docker/containerd/containerd.toml
  ```

### Installazione Docker Compose (Ubuntu 18.04)

* Lanciare il comando:
  ```
  sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
  ```
* Dare i permessi di esecuzione: `sudo chmod +x /usr/local/bin/docker-compose`
* Controllare che l'installazione sia stata eseguita correttamente:
  ```
  $ docker-compose --version
    docker-compose version ..., build ....
  ```

## 2. Impostare le variabili di ambiente:

Creare il file `.env`

* `ADMIN_EMAIL`: la mail dell'amministratore dell'area amministrativa
* `ADMIN_PASSWORD`: la password dell'amministratore

* `API_BASE_URL`: l'URL dell'endpoint API di Agave;
* `APP_DOMAIN`: il dominio dell'installazione di Agave;
* `DATABASE_URL`: `postgres://postgres:@db/<nome_database>`;
* `IMAGES_DOMAIN`: il dominio per le immagini e atri asset;
* `IMAGES_ENDPOINT`: l'URL dell'endpoint delle immagini;
* `JWT_SECRET`: una password complessa;
* `RAILS_ENV`: production o development;
* `READ_WRITE_ACCESS_TOKEN`: un codice esadecimale di almeno 20 cifre;
* `READ_ACCESS_TOKEN`: un codice esadecimale di almeno 20 cifre;
* `SECRET_KEY_BASE`: un codice esadecimale di almeno 20 cifre;
* `STATIC_SITE_DOMAIN`: il dominio del sito statico finale;
* `GOOGLE_MAPS_API_KEY`: la chiave di accesso per [Google Maps](
   https://developers.google.com/maps/documentation/javascript/get-api-key)
* `IUBENDA_POLICY_ID`: identificativo di Iubenda

## 3. Impostazioni DNS:

Essendo l'applicazione disponibile sul web

Per poter rendere accessibile l'applicazione via web è necessario
impostare gli indirizzi DNS che puntano: all'area amministrativa
(Agave), al sito statico e all'host che contiene le immagini.

Di norma è è sufficiente impostare il record `CNAME` contenente
l'IP o il nome del dominio che punta all'host. Ad esempio:

```
NAME             TYPE   VALUE
--------------------------------------------------
sotto-dominio-immagini  CNAME  sotto-dominio-immagini.dominio.it.
sotto-dominio-agave     CNAME  sotto-dominio-agave.dominio.it.
dominio-sito            CNAME  dominio.it.
```

Attraverso questo esempio possiamo impostare l'area di amministrazione
e il sito scolastico sullo stesso host. In questo caso, bisogna
impostare le variabili d'ambiente `STATIC_SITE_DOMAIN` e `APP_DOMAIN`
all'interno del file `.env`. Ad esempio:

```
APP_DOMAIN=sotto-dominio-agave.dominio.it
IMAGES_DOMAIN=sotto-dominio-immagini.dominio.it
STATIC_SITE_DOMAIN=dominio.it
```

## 4. Cloud

Per installare Agave è necessario avere un accesso ad un servizio
cloud che supporti i docker container (ad es.
[Microsoft Azure](https://docs.docker.com/machine/drivers/azure/),
[Digital Ocean](https://docs.docker.com/machine/drivers/digital-ocean/),
[Amazon Web Service](https://docs.docker.com/machine/drivers/aws/),
etc.).

Dopo aver creato un'istanza, è necessario:

1. Creare il file `.env`;
2. Copiare il file `docker-compose.yml`;
3. Avviare l'immagine Docker.

**N.B.**
Lo spazio dei volumi da dedicare all'applicazione dipendono dal numero
di file (immagini, documenti, etc.) che si intendono caricare.

## 5. Copia Ssh

Per copiare un file sulla macchina remota è necessario il comando `scp`.
Questo comando permette di inviare un file utilizzando una connessione
cifrata su un server remoto.

Per avviare Docker, dunque è necessario copiare il file `.env` e
`docker-compose.yml` utilizzando

`scp .env user@hostname:/path/remote/directory`
`scp .docker-compose.yml user@hostname:/path/remote/directory`

## 6. Build & Up

Per avviare l'immagine Docker bisogna entrare all'interno del cloud
server e eseguire:

```
docker-compose \
-f docker/docker-compose.yml \
--project-name agave \
up -d
```

Questo comando lancia l'applicazione in base ai parametri forniti dal 
file `.env`. L'opzione `-d` è quella di `detach` avvaindo l'applicazione
in background.

### Come accedere in un container

Visualizzare il nome di un servizio utilizzando il comando `docker ps -a`.
Eseguire `docker exec -ti <NOME_SERVIZIO> bash` per aprire una shell.

## 7. GDPR

Per poter essere in linea con le attuali leggi in materia di privacy
è necessario impostare il servizio [Iubenda](https://www.iubenda.com/it).
Una volta effettuata la registrazione bisogna modificare i seguenti file:

* `.env`: impostando la variabile `IUBENDA_POLICY_ID` con il proprio
  codice;
* `public/index.html`: impostando le variabili `cookiePolicyId` e
  `siteId` con i codici ottenuti in fase di registrazione.

## N.B.

Se la Google Maps Api Key fosse errata si otterrà il seguente messaggio:

![invalid_api_key](images/invalid_api_key.png)
