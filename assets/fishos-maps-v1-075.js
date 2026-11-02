/* Shared basemaps for all Fish OS Leaflet views. Pins remain separate layers. */
(() => {
  'use strict';
  window.fishosBaseMaps75 = function(map) {
    if (map._fishosBaseMaps75) return map._fishosBaseMaps75;
    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19, attribution: 'Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community'
    });
    streets.addTo(map);
    const control = L.control.layers({Streets: streets, Satellite: satellite}, {}, {collapsed: false}).addTo(map);
    map._fishosBaseMaps75 = {streets, satellite, control};
    return map._fishosBaseMaps75;
  };
})();
