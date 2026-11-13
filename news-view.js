(() => {
  const list = document.getElementById('news-list');
  if (!list) return;
  const posts = Array.isArray(window.TAIHO_NEWS) ? window.TAIHO_NEWS : [];
  const valid = posts.filter(post => {
    if (!post || typeof post.title !== 'string' || !post.title.trim() || typeof post.body !== 'string') return false;
    if (typeof post.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) return false;
    const date = new Date(post.date + 'T00:00:00Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === post.date;
  }).sort((a, b) => b.date.localeCompare(a.date));
  if (!valid.length) return;
  const cards = valid.map(post => {
    const card = document.createElement('article');
    card.className = 'news-item';
    const date = document.createElement('time');
    date.dateTime = post.date;
    date.textContent = post.date.replaceAll('-', '.');
    const title = document.createElement('h3');
    title.textContent = post.title;
    title.dataset.newsJa = post.title;
    if (post.title_en) title.dataset.newsEn = post.title_en;
    if (post.title_zh) title.dataset.newsZh = post.title_zh;
    const body = document.createElement('p');
    body.textContent = post.body;
    body.dataset.newsJa = post.body;
    if (post.body_en) body.dataset.newsEn = post.body_en;
    if (post.body_zh) body.dataset.newsZh = post.body_zh;
    card.append(date, title, body);
    return card;
  });
  list.replaceChildren(...cards);
})();
