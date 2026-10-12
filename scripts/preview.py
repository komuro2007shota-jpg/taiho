"""Generate a standalone preview and downloadable backups from current source."""
from pathlib import Path
import base64
import re
import zipfile
root = Path(__file__).resolve().parents[1]
html = (root / 'index.html').read_text()
css = re.sub(r'@import url\([^;]+;\s*', '', (root / 'style.css').read_text(), count=1)
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>')
for name in ['news.js', 'news-view.js']:
    code = (root / name).read_text().replace('</script', '<\\/script')
    html = html.replace(f'<script src="{name}" defer></script>', '<script>\n' + code + '\n</script>')
html = html.replace('assets/taiho-logo.jpg', 'data:image/jpeg;base64,' + base64.b64encode((root / 'assets/taiho-logo.jpg').read_bytes()).decode())
for name in ['taiho-preview.html', 'taiho-showa-preview.html']:
    (root.parent / name).write_text(html)
files = ['README.md', 'index.html', 'style.css', 'news.js', 'news-view.js', 'scripts/preview.py', 'assets/taiho-logo.jpg']
for archive, prefix in [('taiho-preview.zip', 'taiho-preview'), ('taiho-saved.zip', 'taiho')]:
    with zipfile.ZipFile(root.parent / archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for name in files:
            z.write(root / name, prefix + '/' + name)
        if archive == 'taiho-saved.zip':
            z.writestr(prefix + '/サイト確認用.html', html)
