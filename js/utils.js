// Pontos — funzioni condivise tra le pagine
const DATA_URL = 'data.csv';

// Rimuove accenti e uniforma maiuscole/minuscole per un confronto "tollerante"
function normalize(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Evidenzia la parte del testo che corrisponde alla ricerca
function highlight(text, query) {
  if (!query) return escapeHtml(text);
  const norm = normalize(text);
  const q = normalize(query);
  const idx = norm.indexOf(q);
  if (idx === -1) return escapeHtml(text);
  return escapeHtml(text.slice(0, idx)) +
    '<mark>' + escapeHtml(text.slice(idx, idx + q.length)) + '</mark>' +
    escapeHtml(text.slice(idx + q.length));
}

// Parser CSV minimale ma robusto: gestisce campi tra virgolette e virgole al loro interno
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\r') { /* ignora */ }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

// Carica data.csv e lo trasforma in { number, labels: [] }
async function loadEntries() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('impossibile caricare data.csv (' + res.status + ')');
  const text = await res.text();
  let rows = parseCSV(text);
  // se la prima riga sembra un'intestazione (nessuna cifra nella prima cella), la salta
  if (rows.length && !/\d/.test(rows[0][0] || '')) rows = rows.slice(1);
  return rows
    .map(r => ({
      number: (r[0] || '').trim(),
      labels: r.slice(1).map(s => s.trim()).filter(Boolean)
    }))
    .filter(e => e.number && e.labels.length);
}

function telHref(number) {
  return 'tel:' + number.replace(/[^\d+]/g, '');
}

function resultCardHTML(entry, query) {
  const q = query || '';
  const chips = entry.labels.map(l => {
    const isMatch = q && normalize(l).includes(normalize(q));
    return '<span class="chip' + (isMatch ? ' chip-match' : '') + '">' +
      highlight(l, isMatch ? q : '') + '</span>';
  }).join('');
  return '<article class="result-card">' +
    '<div class="chips">' + chips + '</div>' +
    '<div class="number-row">' +
      '<a class="number" href="' + telHref(entry.number) + '">' + escapeHtml(entry.number) + '</a>' +
      '<button class="copy-btn" data-number="' + escapeHtml(entry.number) + '" title="Copia numero" aria-label="Copia numero">⧉</button>' +
    '</div>' +
  '</article>';
}

function bindCopyButtons(container) {
  container.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.copy-btn');
    if (!btn) return;
    const num = btn.getAttribute('data-number');
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(num).then(() => {
      const original = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = original; }, 1200);
    }).catch(() => {});
  });
}
