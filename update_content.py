import os
import requests
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator

# Configurar tópicos e URLs de referência
topics = {
    "Análise Musical": "https://en.wikipedia.org/wiki/Musical_analysis",
    "História da Música": "https://en.wikipedia.org/wiki/History_of_music",
    # Adicione mais tópicos e URLs relevantes aqui
}

# Nome do arquivo HTML que será atualizado
file_path = "teoria-musical-wikipedia.html"

# Criar um arquivo HTML inicial, caso não exista
if not os.path.exists(file_path):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write("""
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Teoria Musical - Wikipedia</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 20px;
                    max-width: 800px;
                }
                h1, h2 {
                    color: #333;
                }
                a {
                    color: #1a73e8;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                .card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .card-title {
                    font-size: 1.5em;
                    color: #333;
                }
                .neon-card {
                    background-color: #f4f4f9;
                }
                .neon-text {
                    color: #28a745;
                }
            </style>
        </head>
        <body>
            <h1>Teoria Musical - Conteúdos</h1>
        </body>
        </html>
        """)

# Ler o conteúdo existente do arquivo HTML
with open(file_path, "r", encoding="utf-8") as file:
    existing_content = file.read()

# Inicializar novo conteúdo agregado
new_content = ""

# Buscar novos conteúdos para cada tópico
for topic, url in topics.items():
    try:
        # Obter o conteúdo da página
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        paragraphs = soup.find_all("p")[:2]  # Buscar os dois primeiros parágrafos

        # Traduzir e formatar os parágrafos como HTML
        translated_paragraphs = []
        for p in paragraphs:
            # Traduzir o texto de cada parágrafo
            translated_text = GoogleTranslator(source='en', target='pt').translate(p.get_text())
            translated_paragraphs.append(f"<p>{translated_text}</p>")

        # Adicionar a estrutura do card com título, conteúdo e fonte
        topic_content = (
            f'<section class="card neon-card mb-5">\n'
            f'  <div class="card-body">\n'
            f'    <h2 class="card-title neon-text">{topic}</h2>\n'
            + "\n".join(translated_paragraphs)
            + f'\n    <p><a href="{url}" target="_blank">Fonte: {url}</a></p>\n'
            f'  </div>\n'
            f'</section>\n'
        )
        new_content += topic_content + "\n"

    except Exception as e:
        print(f"Erro ao buscar conteúdo para {topic}: {e}")

# Inserir o novo conteúdo antes do fechamento do <body>
updated_content = existing_content.replace(
    "</body>", f"{new_content}\n</body>"
)

# Salvar o conteúdo atualizado no arquivo
with open(file_path, "w", encoding="utf-8") as file:
    file.write(updated_content)

print("Atualização concluída com sucesso!")
