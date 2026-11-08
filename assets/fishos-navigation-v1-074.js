/* Supplied fishing artwork: sidebar-only decoration; navigation stays with existing buttons. */
(() => {
  'use strict';
  // Pixel viewports in the original 1408 x 768 artwork. No raster derivatives.
  const crops = {
    brown: [65, 132, 154, 146], rainbow: [252, 132, 154, 146],
    brook: [436, 132, 178, 146], salmon: [804, 132, 174, 146],
    dry: [57, 333, 160, 146], mayfly: [415, 333, 180, 146],
    streamer: [622, 333, 170, 146], nymph: [820, 333, 160, 146],
    popper: [1183, 333, 163, 146], reel: [68, 536, 151, 151],
    rod: [243, 534, 157, 151], waders: [451, 533, 87, 156],
    net: [539, 535, 130, 148], box: [678, 538, 141, 144],
    casting: [827, 533, 167, 156], vest: [1010, 538, 151, 145],
    hat: [1187, 537, 154, 152]
  };
  // Second value preserves the existing browser-local custom icon category.
  const entries = {
    'Dashboard': ['brown', 'home'], 'Trips': ['waders', 'trip'],
    'Journal': ['rainbow', 'fish'], 'Locations': ['brook', 'map'],
    'Map': ['salmon', 'map'], 'Maps': ['salmon', 'map'],
    'Calendar': ['reel', 'map'], 'Tracking': ['net', 'gear'],
    'Gear Health': ['vest', 'gear'], 'Fish Tracker': ['brown', 'fish'],
    'Species tracker': ['brown', 'fish'], 'Species Tracker': ['brown', 'fish'], 'Fish List': ['brown', 'fish'], 'Fly Tying': ['mayfly', 'fly'],
    'Fly Pattern Index': ['dry', 'fly'], 'Fly Patterns': ['dry', 'fly'],
    'Gear': ['rod', 'gear'], 'Inventory': ['box', 'box'],
    'Research': ['nymph', 'book'], 'Destinations': ['salmon', 'globe'],
    'Resources': ['streamer', 'book'], 'Knots': ['reel', 'fly'],
    'Casting': ['casting', 'trip'], 'Packing': ['vest', 'box'],
    'Stillwater Game': ['rainbow'], 'FishOS AI': ['hat'],
    'Water Profile': ['brook'], 'Season Recap': ['net'], 'Year Recap': ['net'],
    'Pre-trip Check': ['waders'], 'Owner Tools': ['rod'],
    'Account': ['hat', 'gear'], 'Upload': ['box', 'box'],
    'Custom Icons': ['popper', 'gear'], 'Upload Guide': ['box', 'book']
  };
  let observedRoot;
  const observer = new MutationObserver(paint);
  function paint() {
    const root = document.getElementById('side');
    if (!root) return;
    // Ignore our own child changes, and watch only the sidebar (never the page).
    observer.disconnect();
    root.querySelectorAll('button.nav').forEach(button => {
      const entry = entries[button.textContent.trim()];
      if (!entry) return;
      const [art, key] = entry;
      const custom = key && typeof state !== 'undefined' && state.customIcons?.[key];
      let slot = button.querySelector('.ico');
      if (!slot) {
        slot = document.createElement('span');
        slot.className = 'ico';
        button.prepend(slot);
      }
      slot.classList.add('nav-art74');
      const desktop = {home:'compass',trip:'backpack',fish:'fish',map:'map',gear:'rod',fly:'fly',box:'backpack',book:'compass',globe:'map'};
      const label = button.textContent.trim();
      const icon = label === 'Calendar' ? 'calendar' : /Tracking|Recap/.test(label) ? 'trophy' : desktop[key] || 'compass';
      slot.classList.toggle('nav-vector79', !custom);
      slot.style.setProperty('--nav-vector79', 'url("../icons/' + icon + '.svg")');
      slot.setAttribute('aria-hidden', 'true');
      if (custom) {
        if (slot.children.length !== 1 || slot.firstElementChild?.getAttribute('src') !== custom) {
          const img = document.createElement('img');
          img.src = custom;
          img.alt = '';
          slot.replaceChildren(img);
        }
        return;
      }
      if (slot.children.length === 1 && slot.firstElementChild?.dataset.fishosArt74 === art) return;
      const [x, y, width, height] = crops[art];
      const scale = 30 / Math.max(width, height);
      const sprite = document.createElement('span');
      sprite.className = 'nav-sprite74';
      sprite.dataset.fishosArt74 = art;
      sprite.style.width = `${width * scale}px`;
      sprite.style.height = `${height * scale}px`;
      sprite.style.backgroundSize = `${1408 * scale}px ${768 * scale}px`;
      sprite.style.backgroundPosition = `${-x * scale}px ${-y * scale}px`;
      slot.replaceChildren(sprite);
    });
    observedRoot = root;
    observer.observe(observedRoot, {childList: true, subtree: true});
  }
  window.fishosRender725.register({after: paint});
  document.addEventListener('DOMContentLoaded', paint, {once: true});
  paint();
})();
