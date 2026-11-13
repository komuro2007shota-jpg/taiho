(() => {
  const dictionaries = {en: window.TAIHO_TRANSLATIONS || {}, "zh-CN": window.TAIHO_TRANSLATIONS_ZH || {}};
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
  function translate(text, language) {
    const dictionary = dictionaries[language] || {};
    const key = text.trim();
    let value = dictionary[key];
    if (value === undefined && /^(各)?[\d,]+円(?:（税込）)?$/.test(key)) {
      value = (key.startsWith('各') ? '¥' + key.slice(1).replace('円', '') + ' each' : '¥' + key.replace('円', '')).replace('（税込）', ' (tax included)');
    }
    if (language === 'zh-CN' && /^(各)?[\d,]+円(?:（税込）)?$/.test(key)) value = key.replace(/^各/, '每份').replace('円', '日元').replace('（税込）', '（含税）');
    return value === undefined ? text : text.replace(key, () => value);
  }
  function setLanguage(language) {
    if (!['ja', 'en', 'zh-CN'].includes(language)) language = 'ja';
    const english = language === 'en';
    const chinese = language === 'zh-CN';
    document.documentElement.lang = language;
    originals.forEach((text, node) => { node.textContent = language !== 'ja' ? translate(text, language) : text; });
    document.querySelectorAll('[data-news-ja]').forEach(element => {
      const translated = english ? element.dataset.newsEn : chinese ? element.dataset.newsZh : null;
      element.textContent = translated || element.dataset.newsJa;
      element.lang = translated ? language : 'ja';
    });
    document.title = dictionaries[language]?.[title] || title;
    attributes.forEach(({element, ja, en}) => element.setAttribute('aria-label', chinese ? ({'メインナビゲーション':'主导航','公式Instagram（新しいタブで開く）':'官方Instagram（在新标签页打开）','公式X（新しいタブで開く）':'官方X（在新标签页打开）'}[ja] || ja) : english ? en : ja));
    if (meta) meta.content = chinese ? '位于日本福岛县郡山市大町的昭和风烤肉店大丰。营业时间18:00–24:00，每周二休息。' : english ? 'Taiho, a Showa-style Japanese BBQ restaurant in Omachi, Koriyama. Open 18:00–24:00. Closed Tuesdays.' : metaJa;
    document.getElementById('language-select').value = language;
    try { localStorage.setItem('taiho-language', language); } catch (_) {}
  }
  document.getElementById('language-select').addEventListener('change', event => setLanguage(event.target.value));
  let language = 'ja';
  try { const saved = localStorage.getItem('taiho-language'); if (['en', 'zh-CN'].includes(saved)) language = saved; } catch (_) {}
  setLanguage(language);
})();
