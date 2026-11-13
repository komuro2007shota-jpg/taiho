(() => {
  const dictionary = window.TAIHO_TRANSLATIONS || {};
  const originals = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style, .language-switch')) continue;
    originals.set(node, node.textContent);
  }
  const title = document.title;
  const attributes = [];
  document.querySelectorAll('[aria-label]').forEach(element => {
    const ja = element.getAttribute('aria-label');
    const en = {'メインナビゲーション':'Main navigation','公式Instagram（新しいタブで開く）':'Official Instagram (opens in a new tab)','公式X（新しいタブで開く）':'Official X (opens in a new tab)'}[ja];
    if (en) attributes.push({element, ja, en});
  });
  const meta = document.querySelector('meta[name="description"]');
  const metaJa = meta?.content;
  function translate(text) {
    const key = text.trim();
    let value = dictionary[key];
    if (value === undefined && /^(各)?[\d,]+円(?:（税込）)?$/.test(key)) {
      value = (key.startsWith('各') ? '¥' + key.slice(1).replace('円', '') + ' each' : '¥' + key.replace('円', '')).replace('（税込）', ' (tax included)');
    }
    return value === undefined ? text : text.replace(key, () => value);
  }
  function setLanguage(language) {
    const english = language === 'en';
    document.documentElement.lang = english ? 'en' : 'ja';
    originals.forEach((text, node) => { node.textContent = english ? translate(text) : text; });
    document.querySelectorAll('[data-news-ja]').forEach(element => {
      element.textContent = english ? (element.dataset.newsEn || element.dataset.newsJa) : element.dataset.newsJa;
      element.lang = english && element.dataset.newsEn ? 'en' : 'ja';
    });
    document.title = english ? dictionary[title] : title;
    attributes.forEach(({element, ja, en}) => element.setAttribute('aria-label', english ? en : ja));
    if (meta) meta.content = english ? 'Taiho, a Showa-style Japanese BBQ restaurant in Omachi, Koriyama. Open 18:00–24:00. Closed Tuesdays.' : metaJa;
    document.getElementById('language-select').value = language;
    try { localStorage.setItem('taiho-language', language); } catch (_) {}
  }
  document.getElementById('language-select').addEventListener('change', event => setLanguage(event.target.value));
  let language = 'ja';
  try { if (localStorage.getItem('taiho-language') === 'en') language = 'en'; } catch (_) {}
  setLanguage(language);
})();
