import os

# Determine the export directory relative to this script location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXPORT_DIR = os.path.join(BASE_DIR, 'export')
TEMPLATE_FILE = os.path.join(BASE_DIR, 'export-scripts', 'template-index.html')
OUTPUT_FILE = os.path.join(EXPORT_DIR, 'index.html')
sketches = sorted(os.listdir(EXPORT_DIR))

# Criar a lista de <li> com links
items = []
for folder in sketches:
    if os.path.isdir(os.path.join(EXPORT_DIR, folder)):
        items.append(f'<li><a href="{folder}/index.html">{folder}</a></li>')

# Lê o modelo
with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
    template = f.read()

# Substitui {{SKETCH_LIST}} pelo HTML gerado
html = template.replace('{{SKETCH_LIST}}', '\n'.join(items))

# Grava no ficheiro final
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

print("Ficheiro index.html criado em /export")
