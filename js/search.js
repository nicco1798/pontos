(async function () {
  const input = document.getElementById('search');
  const resultsEl = document.getElementById('results');
  const emptyState = document.getElementById('empty-state');
  const noResults = document.getElementById('no-results');
  const noResultsQuery = document.getElementById('no-results-query');

  let entries = [];
  let loadError = null;

  try {
    entries = await loadEntries();
  } catch (err) {
    loadError = err;
  }

  bindCopyButtons(resultsEl);

  function render(rawQuery) {
    const query = rawQuery.trim();

    if (loadError) {
      resultsEl.innerHTML = '<p class="error">Dati non disponibili: ' +
        escapeHtml(loadError.message) +
        '. Controlla che il file data.csv sia presente nella stessa cartella (e che la pagina sia servita via http/https, non aperta da file locale).</p>';
      emptyState.hidden = true;
      noResults.hidden = true;
      return;
    }

    if (!query) {
      resultsEl.innerHTML = '';
      emptyState.hidden = false;
      noResults.hidden = true;
      return;
    }
    emptyState.hidden = true;

    const nq = normalize(query);
    const matches = entries.filter(e => e.labels.some(l => normalize(l).includes(nq)));

    if (!matches.length) {
      resultsEl.innerHTML = '';
      noResults.hidden = false;
      noResultsQuery.textContent = query;
      return;
    }
    noResults.hidden = true;

    resultsEl.innerHTML = matches.map(e => resultCardHTML(e, query)).join('');
  }

  input.addEventListener('input', () => render(input.value));
  render(input.value || '');
})();
