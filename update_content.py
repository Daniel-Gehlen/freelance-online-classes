import os
import requests
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator
import random
from datetime import datetime

# Lista de termos musicais para busca
music_terms = [
    "recording studio", "mixing", "mastering", "live sound", "stage", "backline", "roadie", "sound technician",
    "stage technician", "lighting technician", "road manager", "music producer", "sound engineer", "recording technician",
    "mixing technician", "mastering technician", "audio technician", "video technician"
]

# Nome do arquivo HTML que será atualizado
file_path = "teoria-musical-wikipedia.html"

# Criar o arquivo HTML inicial, caso não exista
if not os.path.exists(file_path):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write("""
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Teoria Musical - Temas Relacionados</title>
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
            <h1>Teoria Musical - Conteúdos Relacionados</h1>
        </body>
        </html>
        """)

# Função para buscar conteúdo na Wikipedia
def get_wikipedia_page(term):
    query = term.replace(" ", "_")
    search_url = f"https://en.wikipedia.org/wiki/{query}"
    response = requests.get(search_url)
    if response.status_code == 200:
        return search_url, response.content
    return None, None

# Inicializar o tradutor
translator = GoogleTranslator(source='en', target='pt')

# Ler o conteúdo existente do arquivo HTML
with open(file_path, "r", encoding="utf-8") as file:
    existing_content = file.read()

# Processar os termos musicais
new_content = ""
for term in random.sample(music_terms, min(len(music_terms), 5)):  # Seleciona até 5 termos aleatórios
    if term in existing_content:  # Ignora termos já processados
        continue
    try:
        # Buscar conteúdo na Wikipedia
        url, page_content = get_wikipedia_page(term)
        if not page_content:
            print(f"Não foi possível acessar a página para o termo: {term}")
            continue

        # Processar o conteúdo
        soup = BeautifulSoup(page_content, "html.parser")
        paragraphs = soup.find_all("p")
        paragraphs = [p.get_text().strip() for p in paragraphs if p.get_text().strip()]

        # Garantir que há conteúdo suficiente
        if len(paragraphs) < 2:
            print(f"Conteúdo insuficiente para o termo: {term}")
            continue

        # Traduzir e formatar o conteúdo
        translated_paragraphs = [
            f"<p>{translator.translate(paragraph)}</p>" for paragraph in paragraphs[:2]
        ]

        # Criar a estrutura de HTML
        term_content = (
            f'<section class="card neon-card mb-5">\n'
            f'  <div class="card-body">\n'
            f'    <h2 class="card-title neon-text">{term.capitalize()}</h2>\n'
            + "\n".join(translated_paragraphs)
            + f'\n    <p class="post-date">{datetime.now().strftime("%d/%m/%Y")}</p>\n'
            + f'\n    <p><a href="{url}" target="_blank">Fonte: {url}</a></p>\n'
            f'  </div>\n'
            f'</section>\n'
        )
        new_content += term_content
    except Exception as e:
        print(f"Erro ao processar o termo {term}: {e}")
        continue

# Adicionar novo conteúdo ao arquivo HTML
if new_content:
    with open(file_path, "a", encoding="utf-8") as file:
        file.write(new_content)
    print("Conteúdo atualizado com sucesso!")
else:
    print("Nenhum conteúdo novo foi adicionado.")
