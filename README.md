
# Introduzione

Agave è un software open-source composto da una serie di strumenti interconnessi che
cooperano tra loro per la generazione di un sito statico.

Lo scopo è fornire una soluzione avanzata che permetta di realizzare e mantenere un sito statico, mettendo a disposizione gli automatismi per publicare contenuti ed estendere le sezioni del sito tramite un'interfaccia usabile e immediata.

Agave è composto dai seguenti blocchi logici:
* Un'**area amministrativa** (CMS);
* Un **sito web statico** (Jekyll) contenente un **template** Jekyll ;
* Un'**ambiente di produzione** per la generazione e la pubblicazione
  del sito e della parte di amministrazione (ambiente Docker).

# Ambiente di produzione
L'ambiente di produzione, è una configurazione Docker-Compose di una macchina virtuale.
Questo ambiente permette di ospitare l'area amministrativa (CMS), e di generare e pubblicare il sito statico.

# Area amministrativa (CMS)
L'area amministrativa è di fatto un CMS (content management system) realizzato tramite un'applicazione web e studiato per permettere la creazione e generazione di modelli di dati e rispettivi contenuti che verranno poi utilizzati dallo staticizzatore per compilare il sito statico.

L'area amministrativa è una applicazione realizzata tramite un Frontend in React ed un Backend Rails, e utilizza Postgres come database relazionale.

# Sito statico
Il sito statico è un template Jekyll contenuto in un repository
publico git.
L'ambiente di produzione contine gli strumenti e gli script necessari alla
generazione del sito statico a partire dai file del template contenuti nel repository
git e dai dati fruiti dal CMS.

Un template Jekyll di esempio è disponibile su questo [repository](https://github.com/cantierecreativo/agave-template-school).

# Utilizzo

Una volta configurato il sistema saranno presenti due url una relativa all'interfaccia di amministrazione e una relativa al sito statico.

Dall'area amministrativa sarà possibile creare modelli di dati, caricare media e popolare i contenuti
Inoltre permetterà di pubblicare i contenuti e avviare il processo di build del sito statico.

L'area amministrativa di default ha un utente admin per dare la possibilità di creare utenze e configurare le impostazioni generali del sito.
Prevede diversi profili utente per la gestione delle varie sezioni.
Vedi la guida [area amministrativa](/docs/AgaveAdministrativeDocumentation.md) per tutte le info riguardante l'accesso per l'utente amministratore.
Per la gestione dei contenuti invece consultare la guida relativa al [CMS](/docs/AgaveGeneralDocumentation.md)

Il sito statico è un template Jekyll popolato al momento del build con i contenuti creati sull'area amministrativa.
Esiste un template di esempio su questo [repository](https://github.com/cantierecreativo/agave-template-school) .


# Documentazione e Configurazione

* Cos'è [Agave](/docs/AgaveGeneralDocumentation.md)?
* Com'è [composta](/docs/DockerStructure.md) la macchina virtuale?
* Come posso [aggiornare](/docs/UpdateDockerImages.md) l'immagine Docker?
* Cosa devo [configurare](/docs/AgaveConfiguration.md) per poter utilizzare Agave?
* Come uso l'[area amministrativa](/docs/AgaveAdministrativeDocumentation.md)?
* Come [pubblico](/docs/Build.md) il mio sito?
* Come posso provare Agave in [locale](/docs/Development.md)?
* Come posso [esportare](docs/GenerateBackup.md) i dati?

# Bug noti

* I modelli contenuti in un campo modulare devono essere impostati
  senza lingua. Impostare come multilingua solo il contenuto modulare.

# Credits

Progetto sviluppato e mantenuto da [Cantiere Creativo <img src="https://www.cantierecreativo.net/images/illustrations/logo-07f378ea.svg"/>](https://www.cantierecreativo.net) per conto di [Developers Italia](https://developers.italia.it/)

## License

The gem is available as open source under the terms of the [GNU Affero General Public License version 3](https://opensource.org/licenses/AGPL-3.0).
