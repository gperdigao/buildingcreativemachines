import os
import re
import pandas as pd

# 1) Carrega o CSV
df = pd.read_csv('sketches.csv')

# 2) Função para criar slugs a partir dos títulos
def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[\s_-]+', '-', text)

# 3) Lê o template HTML
with open('template.html', 'r', encoding='utf-8') as f:
    template_html = f.read()

# 4) Gera as pastas e ficheiros
export_root = '../export'
os.makedirs(export_root, exist_ok=True)

for _, row in df.iterrows():
    sid = str(row['sketch ID'])
    title = row['title']
    code = str(row['code']) if pd.notna(row['code']) else "// Código não disponível"
    slug = f"sketch-{sid}-{slugify(title)}"
    sketch_dir = os.path.join(export_root, slug)
    os.makedirs(sketch_dir, exist_ok=True)

    # 4a) index.html
    html = template_html.replace('{{TITLE}}', title)
    with open(os.path.join(sketch_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)

    # 4b) sketch.js
    with open(os.path.join(sketch_dir, 'sketches.js'), 'w', encoding='utf-8') as f:
        f.write(code)

print("Exportação concluída em:", export_root)
