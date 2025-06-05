import os

EXPORT_DIR = 'export'
sketches = sorted(os.listdir(EXPORT_DIR))

# Criar a lista de <li> com links
items = []
for folder in sketches:
    if os.path.isdir(os.path.join(EXPORT_DIR, folder)):
        items.append(f'<li><a href="{folder}/index.html">{folder}</a></li>')

# Lê o modelo
with open(os.path.join('export-scripts', 'template-index.html'), 'r', encoding='utf-8') as f:
    template = f.read()

# Substitui {{SKETCH_LIST}} pelo HTML gerado
html = template.replace('{{SKETCH_LIST}}', '\n'.join(items))

# Grava no ficheiro final
with open(os.path.join(EXPORT_DIR, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html)

print("Ficheiro index.html criado em /export")
