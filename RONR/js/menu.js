import { t, getLang } from './i18n.js';
import { showSettings } from './settings.js';
import { handleContinue } from './continue.js';
import { handleExit } from './exit.js';

const app = document.getElementById('app');

function render(){
  app.innerHTML = `
    <div class="menu-card" role="main" aria-labelledby="menu-title">
      <div class="menu-header">
        <div class="logo">
          <div class="icon">R</div>
          <div>
            <div id="menu-title" class="title">${t('title')}</div>
            <div class="subtitle" id="menu-sub">${t('subtitle')}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <div class="lang-flag" id="lang-flag">${getLang() === 'ua' ? '🇺🇦' : '🇬🇧'}</div>
        </div>
      </div>

      <div class="menu-actions">
        <button class="btn primary" id="btn-continue">${t('continue')}</button>
        <button class="btn ghost" id="btn-settings">${t('settings')}</button>
        <button class="btn" id="btn-exit">${t('exit')}</button>
      </div>

      <div class="footer">v0.1 — Prototype</div>
    </div>
  `;

  // hookup
  document.getElementById('btn-continue').addEventListener('click', () => handleContinue());
  document.getElementById('btn-settings').addEventListener('click', () => showSettings());
  document.getElementById('btn-exit').addEventListener('click', () => handleExit());
}

// пересвідчитись, що UI відповідає мові
window.addEventListener('langchange', () => {
  render(); // простий підхід — перевідмалювати весь блок
});

// перший рендер
render();
