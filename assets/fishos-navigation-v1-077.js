/* Keep Research with the reference library, retaining the existing button/handler. */
(() => {
  'use strict';
  function arrange() {
    const root = document.getElementById('side');
    if (!root) return;
    const buttons = [...root.querySelectorAll('button.nav')];
    const research = buttons.find(button => button.textContent.trim() === 'Research');
    const resources = buttons.find(button => button.textContent.trim() === 'Resources');
    if (research && resources && resources.nextElementSibling !== research) resources.after(research);
  }
  window.fishosRender725.register({after: arrange});
  document.addEventListener('DOMContentLoaded', arrange, {once: true});
})();
