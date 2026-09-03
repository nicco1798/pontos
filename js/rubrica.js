(async function () {
  const listEl = document.getElementById('rubrica-list');
  const navEl = document.getElementById('az-nav');

  let entries = [];
  try {
    entries = await loadEntries();
  } catch (err) {
    listEl.innerHTML = '<p class="error">Dati non disponibili: ' +
      escapeHtml(err.message) +
      '. Controlla che il file data.csv sia presente nella stessa cartella (e che la pagina sia servita via http/https, non aperta da file locale).</p>';
    return;
  }

  if (!entries.length) {
    listEl.innerHTML = '<p class="empty-state">Nessun numero presente in data.csv.</p>';
    return;
  }

  // Ordina ogni voce per la prima etichetta, così la rubrica è alfabetica per ruolo
  entries.sort((a, b) => normalize(a.labels[0]).localeCompare(normalize(b.labels[0]), 'it'));

  const groups = {};
  entries.forEach(e => {
    const first = normalize(e.labels[0]);
    const letter = first ? first[0].toUpperCase() : '#';
    (groups[letter] = groups[letter] || []).push(e);
  });

  const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'it'));

  navEl.innerHTML = letters.map(l => '<a href="#letter-' + l + '">' + l + '</a>').join('');

  listEl.innerHTML = letters.map(letter => {
    const items = groups[letter].map(e => resultCardHTML(e, '')).join('');
    return '<section class="letter-group" id="letter-' + letter + '">' +
      '<h2>' + letter + '</h2>' +
      '<div class="results">' + items + '</div>' +
    '</section>';
  }).join('');

  bindCopyButtons(listEl);
})();
