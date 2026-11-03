/* V1.077: selectable search results and guarded trip-location lookups. */
(() => {
  'use strict';
  const A = value => Array.isArray(value) ? value : [];
  const detailKinds = new Set(['locations', 'flies', 'journal', 'rods', 'fish']);
  const detailPrefixes = {locations:'location-detail-', flies:'fly-pattern-', rods:'rod-'};
  const routes = {trips:'trips', journal:'journal', locations:'locations', rivers:'locations', flies:'fly-patterns', destinations:'destinations', rods:'rod-list', packing:'packing', buy:'purchases', knots:'knots', species:'fish-tracker', fish:'fish-tracker', trip_sessions:'tracking'};
  const labels = {trips:'Trip', journal:'Journal', locations:'Water', rivers:'Water', flies:'Fly', destinations:'Destination', rods:'Rod', packing:'Packing', buy:'Purchase', knots:'Knot', species:'Species', fish:'Fish', trip_sessions:'Session'};
  const excluded = kind => /^(links?|resources?|resource_links|research_links)$/i.test(kind);

  // Preserve the focused search index while carrying the actual source row to its control.
  // A title or excerpt cannot identify a record: either can match several rows.
  function searchHits(data, query) {
    const needle = query.toLowerCase(), hits = [], seen = new Set();
    function add(kind, title, content, destination) {
      const text = String(content).replace(/\s+/g, ' ').trim();
      const at = text.toLowerCase().indexOf(needle);
      if (at < 0) return;
      const type = labels[kind] || 'Fish OS';
      const key = JSON.stringify([type, title, destination.page, destination.kind, destination.index]);
      if (seen.has(key)) return;
      seen.add(key);
      const from = Math.max(0, at - 65);
      let excerpt = text.slice(from, from + 250);
      if (from) excerpt = '…' + excerpt.slice(0, 249);
      if (from + 250 < text.length) excerpt = excerpt.slice(0, 249) + '…';
      hits.push({type, title:String(title).slice(0, 100), excerpt, destination});
    }
    function scan(value, kind, depth) {
      if (excluded(kind) || value == null || depth > 6 || hits.length >= 30) return;
      const page = routes[kind] || 'research';
      if (Array.isArray(value)) {
        for (const [index, row] of value.entries()) {
          if (hits.length >= 30) break;
          if (row == null || (typeof row !== 'string' && typeof row !== 'object')) continue;
          const destination = value === data[kind] && detailKinds.has(kind) ? {page, kind, row, index} : {page};
          if (typeof row === 'string') { add(kind, row, row, destination); continue; }
          const title = String(row.id || row.name || row.title || row.place || row.location || 'Record ' + (index + 1));
          if (kind === 'trips') destination.page = 'trip-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const fields = Object.entries(row);
          const content = fields.filter(([key, val]) => !excluded(key) && (typeof val === 'string' || typeof val === 'number')).map(([, val]) => val).join(' • ');
          add(kind, title, title + ' • ' + content, destination);
          fields.forEach(([key, val]) => { if (val && typeof val === 'object') scan(val, key, depth + 1); });
        }
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([key, val]) => scan(val, key, depth + 1));
      } else if (typeof value === 'string') {
        add(kind, value, value, {page});
      }
    }
    scan(data, 'DATA', 0);
    return hits;
  }
  window.search = function(query) {
    const box = document.getElementById('searchResults');
    if (!box) return;
    box.replaceChildren();
    const q = String(query ?? '').trim();
    if (!q) { box.classList.remove('show'); return; }
    // Keep a row reference only for the lifetime of its result control.
    const hits = searchHits(DATA, q);
    const uid = state.profile?.userId || '';
    hits.forEach(hit => {
      const destination = hit.destination;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'result';
      button.style.cssText = 'display:block;width:100%;text-align:left;font:inherit;color:inherit;border:0;border-bottom:1px solid var(--line)';
      const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = hit.type;
      const heading = document.createElement('b'); heading.textContent = hit.title;
      const excerpt = document.createElement('div'); excerpt.className = 'muted small'; excerpt.textContent = hit.excerpt;
      button.append(tag, heading, excerpt);
      button.addEventListener('click', () => {
        if ((state.profile?.userId || '') !== uid || !box.contains(button)) return;
        let page = destination.page;
        if (destination.kind) {
          const rows = A(DATA[destination.kind]);
          const index = rows[destination.index] === destination.row ? destination.index : rows.indexOf(destination.row);
          if (index < 0) { window.search(q); return; }
          const prefix = detailPrefixes[destination.kind];
          if (prefix) page = prefix + index;
          if (destination.kind === 'journal' && window.fishosEditors68?.editJournal) {
            box.classList.remove('show'); window.fishosEditors68.editJournal(index); return;
          }
          if (destination.kind === 'fish' && window.fishos41FishEdit) {
            box.classList.remove('show'); window.fishos41FishEdit(index); return;
          }
        }
        box.classList.remove('show');
        window.go(page);
      });
      box.append(button);
    });
    if (!hits.length) {
      const empty = document.createElement('div'); empty.className = 'result muted'; empty.textContent = 'No indexed result.'; box.append(empty);
    }
    box.classList.add('show');
  };

  let request = 0;
  const node = id => document.getElementById(id);
  function message(box, text) {
    const line = document.createElement('div'); line.className = 'location-result'; line.textContent = text; box.replaceChildren(line);
  }
  document.addEventListener('input', event => {
    if (event.target.id !== 'nfPlace') return;
    request++;
    for (const id of ['nfLat','nfLon']) if (node(id)) node(id).value = '';
    node('tripLocResults')?.replaceChildren();
  });
  window.tripLocationSearch = async function() {
    const serial = ++request, input = node('nfPlace'), box = node('tripLocResults');
    if (!input || !box) return;
    const q = input.value.trim(), uid = state.profile?.userId || '';
    const current = () => serial === request && node('nfPlace') === input && node('tripLocResults') === box && input.value.trim() === q && (state.profile?.userId || '') === uid;
    if (q.length < 3) { message(box, 'Enter at least 3 characters.'); return; }
    message(box, 'Searching…');
    try {
      const response = await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=' + encodeURIComponent(q));
      if (!response.ok) throw Error('Location search unavailable');
      const rows = await response.json();
      if (!current()) return;
      box.replaceChildren();
      const matches = A(rows).filter(row => row && typeof row.display_name === 'string' && row.lat != null && row.lon != null && String(row.lat).trim() !== '' && String(row.lon).trim() !== '' && Number.isFinite(Number(row.lat)) && Number.isFinite(Number(row.lon)) && Math.abs(Number(row.lat)) <= 90 && Math.abs(Number(row.lon)) <= 180);
      matches.forEach(row => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'location-result';
        button.style.cssText = 'display:block;width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer';
        const heading = document.createElement('b'); heading.textContent = row.display_name.split(',').slice(0,2).join(', ');
        const description = document.createElement('span'); description.className = 'muted'; description.textContent = row.display_name;
        button.append(heading, document.createElement('br'), description);
        button.addEventListener('click', () => {
          if (!current() || !box.contains(button) || !node('nfLat') || !node('nfLon')) return;
          input.value = row.display_name;
          node('nfLat').value = String(row.lat); node('nfLon').value = String(row.lon);
          request++;
          message(box, 'Location selected.');
        });
        box.append(button);
      });
      if (!matches.length) message(box, 'No matches.');
    } catch {
      if (current()) message(box, 'Location search unavailable; enter the location manually.');
    }
  };
})();
