Per sito statico, intendiamo un'applicazione i cui contenuti non
vengono generati dinamicamente (al contrario del funzionamento di Php).

La fase di **compilazione** consiste nella generazione di un
*sito statico*.

Questo processo compila il template popolandolo con i dati inseriti
tramite l'interfaccia di amministrazione di Agave (vedi sezione **Contenuti**).
Il risultato è la generazione di una serie di file `*.html` (da ciò
deriva il termine statico).
Questa fase è completamente trasparente all'utente finale e viene
effettuata da [Jekyll](https://jekyllrb.com/).

# Configurazione deploy sul server locale

Per poter pubblicare il sito statico sulla macchina dove è ospitato
agave devi eseguire i seguenti passi:

* Modificare il proprio DNS creando il sottodomionio su cui si vuole
  pubblicare il sito statico (es. `"informazioni.ilmiosito.it"`)
* Impostare la variabile di ambiente `STATIC_DOMAINS` nel modo seguente :
  ```
   [{"name":"<nome_ambiente>", "domain": "sottodominio.miodominio.com"},...]

   es.
   [{"name":"production", "domain":"informazioni.ilmiosito.it"}]
  ```
  In questo modo puoi impostare uno o più ambienti di deploy.
  __Attenzione__, la variabile deve necessariamente essere scritta su
  una singola riga.
* Eliminare i container e i volumi di docker utilizzando il comando 
  `docker system prune --all` e `docker system prune --volumes`.
  Rilanciare la 
  [build](https://github.com/italia/agavecms/blob/master/docs/AgaveConfiguration.md#6-build--up) dell'immagine docker.  
  Questa operazione è necessaria per ricreare i file di configurazione 
  di ngnix e i certificati del nuovo domini.
* Impostare gli ambienti configurati su _Impostazioni di deploy_,
  creando gli ambienti precedentemente dichiarati su STATIC_DOMAINS.
  Impostare l'URL del repository Git e il nome del dominio.
* Premere su _Status_ e cliccare su _Update_

# Configurazione deploy con l'utilizzo del protocollo FTP

* Indicare il nome del _dominio_ del server remoto, la _directory_ di
  destinazione della compilazione, il nome utente (_users_) e _password_

# Configurazione deploy con l'utilizzo del protocollo SFTP con password

* Indicare il nome del _dominio_ del server remoto, la _directory_ di
  destinazione della compilazione, il nome utente (_users_) e _password_

# Configurazione deploy con l'utilizzo del protocollo SFTP con chiave privata

* Indicare il nome del _dominio_ del server remoto, la _directory_ di
  destinazione della compilazione, il nome utente (_users_) e la
  _chiave privata_.

  Per poter funzionare correttamente, la chiave non deve essere crittografata
  con la password. Ad esempio, utilizzando il software `ssh-keygen`:

  ```
  $ ssh-keygen
    Generating public/private rsa key pair.
    Enter file in which to save the key (/home/user/.ssh/id_rsa): /tmp/tmp_key
    Enter passphrase (empty for no passphrase): <Premere invio per non crittografare la chiave>
  ```

# Link esterni

Esistono dei siti statici di esempio già preconfigurati [agave-example-school](https://github.com/italia/agave-template-school).

# N.B.
Essendo i contenuti statici, se sono stati modificati i dati, è
necessario ripetere il processo di build.
