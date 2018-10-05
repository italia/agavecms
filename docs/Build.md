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

# Configurazione deploy su file system

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

# Come compilare il sito statico (Build)

* Impostare gli ambienti configurati su _Impostazioni di deploy_,
  creando gli ambienti precedentemente dichiarati su STATIC_DOMAINS.
  Impostare l'URL del repository Git e il nome del dominio.
* Premere su _Status_ e cliccare su _Update_

# Link esterni

Esistono dei siti statici di esempio già preconfigurati [agave-example-school](https://github.com/matteomanzo/agave-example-school).

# N.B.
Essendo i contenuti statici, se sono stati modificati i dati, è
necessario ripetere il processo di build.
