# Come compilare il sito statico (Build)

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

E' possibile avviare il processo di compilazione del sito e successiva
pubblicazione tramite interfaccia di Agave utilizzando
il tasto **Pubblica modifiche**.

Per far questo è prima necessario impostare l'url del repository Git da Agave (sezione **Amministrazione >
Impostazione di Deploy > Deployment**) di un template Jekyll opportunamente
configurato per Agave.

Esistono dei siti statici di esempio già preconfigurati [agave-example-school](https://github.com/matteomanzo/agave-example-school).

Una volta compilato il sito sarà disponibile all'indirizzo dichiarato all'interno della
variabile di ambiente `STATIC_SITE_DOMAIN`.

**N.B.**
Essendo i contenuti statici, se sono stati modificati i dati, è
necessario ripetere il processo di build.
