Questa documentazione fa riferimento all'area **Amministrativa** di
Agave. Permette di configurare le varie impostazioni necessarie per
il funzionamento del sistema, la creazione dei modelli dei dati, la
gestione degli utenti e dei loro ruoli di accesso al backend.

# Gestione dei modelli dei dati

La sezione **Tipo di Contenuto** permette la possibilita di creare,
configurare e personalizzare i modelli che saranno saranno disponibili
per essere generati e poi fruiti all'interno del sito statico.

# Gestione Menu di navigazione backend

Il menù del pannello di backend può essere configurato per rendere più
intuitiva la navigazione all'interno dell'area amministrativa. E'
possibile riordinare la lista di voci, modificare la label visibili e
nascondere alcuni contenuti.

# Gestione Struttura JSON dei modelli dei dati

Tramite questa sezione è possibile esportare i modelli dei dati
presenti all'interno del sito. Premendo il tasto **Esporta JSON**,
verrà generato un file '.json' che sarà possibile scaricare sul
proprio computer. Viceversa, è possibile importare un file JSON
precompilato e utilizzarlo per ridefinire la struttura dei modelli
dei dati.

**N.B.**
Il sistema di importazione non è incrementale. Caricando un nuovo file
JSON tutti i contenuti pre-esistenti sul database verranno eliminati.

# Impostazioni sito

E' possibile configurare i colori, il titolo e il logo dell'area di
amministrazione. Inoltre, qui si definiscono le lingue supportate per
la generazione dei contenuti ed il fuso orario del Paese di utilizzo.

# Gestione Utenti e Ruoli

Tramite questa sezione è possibile aggiungere, modificare o eliminare
gli utenti che possono accedere alla sezione amministrativa. Ogni
utente deve necessariamente avere un ruolo asseganato. Ogni ruolo
viene creato dall'amministratore che definisce la tipologia di accessi
consentiti all'area di amministrazione per un determinato gruppo di
utenti.

**N.B.**
Il sistema ha di default un ruolo di amministratore. Per il funzionamento
è necessario specificare un utente attraverso le apposite variabili
`ADMIN_EMAIL` e `ADMIN_PASSWORD` definite all'interno del file di
configurazione  `.env`, presente nella cartella principale del progetto.

# Impostazione di deploy

Per far si che la pubblicazione del sito avvenga correttamente è
necessario speficare l'url del repository Git che conterrà i file
sorgenti del template Jekyll
(ad. es. `https://github.com/matteomanzo/agave-example-school`).

Requisiti necessari per il repository:
* Utilizzare uno dei repository supportati:
  [gitlab](https://about.gitlab.com/),
  [github](https://github.com/about) o
  [bitbucket](https://bitbucket.org).
* Repository di tipo `.git`
* Il Repository git deve essere necessariamente pubblico (privo di
  autenticazione e configurazione url standard);

Inoltre, è possibile configurare l'url corrispondente al sito remoto
generato (ad es. `http://lvh.me`)

# Gestione API TOKEN

Per accedere ai contenuti di AgaveCMS è necessario effettuare le
chiamate utilizzando una chiave di accesso (API TOKEN). Questa
sezione permette di generare ulteriori chiavi di accesso specificando
un ruolo, un nome identificativo ed un codice. Esiste una chiave di
default che non è nè modificabile, nè eliminabile.
