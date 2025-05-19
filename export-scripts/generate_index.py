import os

EXPORT_DIR = '../export'
TEMPLATE_FILE = 'template-index.html'
OUTPUT_FILE = os.path.join(EXPORT_DIR, 'index.html')

# Lê o template
with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
    template = f.read()

# Gera lista de pastas de sketches
folders = sorted([
    d for d in os.listdir(EXPORT_DIR)
    if os.path.isdir(os.path.join(EXPORT_DIR, d))
])

# Cria os links
items = []
for folder in folders:
    items.append(f'<li><a href="{folder}/index.html">{folder}</a></li>')

# Substitui o placeholder
html = template.replace('{{SKETCH_LIST}}', '\n'.join(items))

# Escreve o ficheiro final
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Galeria criada: export/index.html")
