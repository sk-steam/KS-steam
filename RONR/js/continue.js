import { t } from './i18n.js';

export function handleContinue(){
  // Тут може бути перехід у гру/інший екран — поки проста демонстрація
  const message = `${t('continue')}...`;
  // легка візуальна реакція
  const note = document.createElement('div');
  note.style.position = 'fixed';
  note.style.bottom = '20px';
  note.style.right = '20px';
  note.style.background = 'rgba(6,20,30,0.8)';
  note.style.padding = '10px 14px';
  note.style.borderRadius = '8px';
  note.style.border = '1px solid rgba(255,255,255,0.04)';
  note.textContent = message;
  document.body.appendChild(note);
  setTimeout(()=>note.remove(), 1800);
}
