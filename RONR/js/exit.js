import { t } from './i18n.js';

export function handleExit(){
  if(confirm(t('confirm_exit'))){
    // Для веб-прототипу — перенаправлення на порожню сторінку
    window.location.href = 'about:blank';
  }
}
