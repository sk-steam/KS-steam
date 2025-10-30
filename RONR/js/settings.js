import { available, getLang, setLang, t } from './i18n.js';

export function showSettings() {
  const root = document.createElement('div');
  root.className = 'modal-backdrop';
  root.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-weight:700">${t('settings_title')}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.6)">${t('subtitle') || ''}</div>
        </div>
        <button class="close" title="Close">×</button>
      </div>
      <div class="row">
        <div style="font-size:14px">${t('language_label')}</div>
        <select id="lang-select"></select>
      </div>
      <div style="display:flex;justify-content:flex-end">
        <button class="close" id="close-ok">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const select = root.querySelector('#lang-select');
  available.forEach(lang => {
    const opt = document.createElement('option');
    opt.value = lang;
    opt.textContent = lang === 'ua' ? 'Українська' : 'English';
    select.appendChild(opt);
  });
  select.value = getLang();

  function close() { root.remove(); }

  select.addEventListener('change', e => {
    setLang(e.target.value);
  });
  root.querySelectorAll('.close').forEach(b => b.addEventListener('click', close));
  // close on backdrop click
  root.addEventListener('click', e => { if (e.target === root) close(); });
}
