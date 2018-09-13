Per effettuare il backup è sufficiente entrare nell'area amministativa
e premere il buttone '__Scarica il backup__'.

Dopo alcuni istanti sarà possibile scaricare il file compresso
direttamente sul proprio computer. Il tempo di esecuzione della
generazione del backup dipende esclusivamente dal numero di immagini
presenti sul sito e dalla grandezza del database.

Il backup generato ha la seguente estensione: `*.tar.gz`. Per poter
decomprimere il file con un sistema operativo Windows è sufficiente
installare un qualsiasi programma di decompressione (ad es.
[7-Zip](https://www.7-zip.org/)). Per i sistemi Linux è sufficiente
lanciare il comando `tar -zxvf <nome_archivio>`.

Il file di backup conterrà le seguenti directory:

* `db`: contenente il file `.dump` ( una copia in SQL del database);
* `public/uploads`: contenente i file e le immagini che sono state
   caricate sul sito.
