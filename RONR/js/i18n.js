const STORAGE_KEY = 'ronr_lang';
const defaultLang = 'ua';
const locales = {
  ua: {
    title: 'RONR — Меню',
    subtitle: 'Прототип ядра',
    continue: 'Продовжити',
    settings: 'Налаштування',
    exit: 'Вийти',
    settings_title: 'Налаштування',
    language_label: 'Мова',
    confirm_exit: 'Ви впевнені, що хочете вийти?'
  },
  en: {
    title: 'RONR — Menu',
    subtitle: 'Core prototype',
    continue: 'Continue',
    settings: 'Settings',
    exit: 'Exit',
    settings_title: 'Settings',
    language_label: 'Language',
    confirm_exit: 'Are you sure you want to exit?'
  }
};

export function getLang(){
  return localStorage.getItem(STORAGE_KEY) || defaultLang;
}
export function setLang(lang){
  if(!locales[lang]) return;
  localStorage.setItem(STORAGE_KEY, lang);
  window.dispatchEvent(new CustomEvent('langchange', {detail:{lang}}));
}
export function t(key){
  const lang = getLang();
  return (locales[lang] && locales[lang][key]) || locales[defaultLang][key] || key;
}
export const available = Object.keys(locales);
