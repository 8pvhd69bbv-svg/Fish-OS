/* V1.075: owner references, System navigation and readable research cards. */
(() => {
  'use strict';
  function arrange() {
    const root = document.getElementById('side');
    if (root) {
      const ai = root.querySelector('[data-f53route="fishos-ai"]');
      const account = [...root.querySelectorAll('button.nav')].find(b => b.textContent.trim() === 'Account');
      const owner = root.querySelector('#v63-owner-nav');
      if (ai && account) {
        const previous = ai.parentElement;
        // Keep the SYSTEM label before both controls, including signed-out views.
        if (owner) owner.after(ai);
        else account.before(ai);
        if (previous !== ai.parentElement && !previous.children.length) previous.remove();
      }
    }
    const main = document.getElementById('main');
    if (!main) return;
    const ownerPage = state.page === 'owner-tools' && window.fishosCleanup65?.owner();
    if (!ownerPage) {
      main.querySelector('#invite71')?.remove();
      main.querySelector('#m64-tools')?.remove();
    } else if (!main.querySelector('#m64-tools')) {
      const box = document.createElement('section');
      box.id = 'm64-tools';
      box.className = 'card';
      box.innerHTML = '<h3>YOUR REFERENCE TOOLS</h3><div class="toolbar"><button class="btn" data-layout75-go="research-notes">IMPORTED PRIVATE RESEARCH NOTES</button><button class="btn" data-layout75-go="tickets">FULL TICKET CHECKLIST</button><a class="btn" href="https://github.com/8pvhd69bbv-svg/Fish-OS/blob/main/AGENTS.md" target="_blank" rel="noopener noreferrer">PROJECT INSTRUCTIONS</a></div>';
      box.querySelectorAll('[data-layout75-go]').forEach(b => b.onclick = () => go(b.dataset.layout75Go));
      main.append(box);
    }
    if (state.page === 'research') {
      main.querySelectorAll('a.btn').forEach(link => {
        if (link.textContent.trim() === 'OPEN SOURCE') link.closest('.card')?.classList.add('research-source75');
      });
    }
  }
  window.fishosRender725.register({after: arrange});
  document.addEventListener('DOMContentLoaded', arrange, {once: true});
  window.fishosLayout75 = {arrange};
})();
