# Pontos — Rubrica telefonica ospedaliera

Pontos è un sito statico (solo HTML/CSS/JS, nessun server necessario) che permette di
cercare rapidamente i numeri di telefono interni digitando anche solo una parte del
ruolo o del reparto cercato (es. "anes" trova "Anestesista").

## Struttura del progetto

```
index.html        pagina di ricerca (pagina principale)
rubrica.html       elenco alfabetico completo
data.csv            i numeri di telefono — È QUESTO IL FILE DA AGGIORNARE
css/style.css       grafica
js/utils.js         funzioni condivise (caricamento e ricerca dei dati)
js/search.js        logica della pagina di ricerca
js/rubrica.js        logica della pagina rubrica
assets/logo.svg      logo Pontos
```

## Come aggiornare i numeri

1. Apri `data.csv` — puoi modificarlo anche direttamente da Excel.
2. **Colonna A** = numero di telefono. **Colonne successive** (B, C, D, …) = tutte le
   etichette/ruoli associati a quel numero (quante ne servono, anche una sola).
3. Non serve una riga di intestazione: ogni riga è già un numero. Se per errore la
   lasci, il sito la ignora automaticamente.
4. Se lavori da Excel, salva con **"Salva con nome" → "CSV UTF-8 (delimitato da
   virgola) (*.csv)"**, sovrascrivendo `data.csv`.
5. Se un'etichetta contiene una virgola, lasciala pure così: Excel la racchiuderà tra
   virgolette automaticamente durante l'esportazione CSV.
6. Fai commit/push del file aggiornato: il sito online si aggiorna da solo in pochi
   minuti, senza toccare nient'altro.

**Perché CSV e non il file Excel direttamente:** ho scelto questo formato perché è il
più semplice da mantenere (si esporta da Excel con un clic), pesa pochissimo e il sito
lo legge in modo affidabile senza bisogno di librerie aggiuntive per interpretare il
formato `.xlsx`.

⚠️ **Nota sulla privacy:** questa repository sarà pubblica, quindi anche `data.csv`
sarà visibile a chiunque su GitHub, non solo al personale dell'ospedale. Se preferisci
che i numeri non siano pubblicamente consultabili, valuta una di queste alternative
prima di caricare i dati reali:
- rendere la repository **privata** (GitHub Pages è disponibile anche sui repository
  privati con un piano GitHub a pagamento);
- aggiungere una protezione ad accesso (es. una password lato client, oppure hosting
  su una rete/intranet interna dell'ospedale anziché su GitHub Pages pubblico).

## Come pubblicare online (GitHub Pages)

1. Crea una repository pubblica su GitHub e carica tutti questi file mantenendo la
   struttura delle cartelle (compresa `css/`, `js/` e `assets/`).
2. Vai su **Settings → Pages**.
3. In "Source" seleziona il branch (es. `main`) e la cartella `/root`, poi salva.
4. Dopo qualche minuto il sito sarà online all'indirizzo mostrato in quella pagina
   (del tipo `https://tuoutente.github.io/nome-repo/`).
5. Da quel momento, ogni volta che aggiorni `data.csv` e fai push, il sito si
   aggiorna automaticamente in pochi minuti — non serve ripubblicare nulla a mano.

## Anteprima in locale (facoltativo)

Aprendo `index.html` con un doppio click il caricamento dei dati potrebbe non
funzionare: i browser bloccano per sicurezza il caricamento di file locali (`file://`)
tramite `fetch`. Per testare in locale prima di pubblicare:

- Se hai Python installato, apri il terminale nella cartella del progetto e digita
  `python -m http.server`, poi apri `http://localhost:8000` nel browser.
- In alternativa usa un'estensione come "Live Server" di Visual Studio Code.

Una volta pubblicato su GitHub Pages (servito via https), questo problema non si
presenta più.
