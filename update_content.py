import os
import requests
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator
import random

# Configurar tópicos e URLs de referência
topics = {
    "Análise Musical": "https://en.wikipedia.org/wiki/Musical_analysis",
    "História da Música": "https://en.wikipedia.org/wiki/History_of_music",
    "Educação de Jovens e Adultos no Brasil: História e Política": "https://en.wikipedia.org/wiki/Education_in_Brazil#Education_of_young_people_and_adults_in_Brazil",
    "Educação Musical na Infância": "https://en.wikipedia.org/wiki/Childhood_music_education",
    "Fundamentos da Música": "https://en.wikipedia.org/wiki/Music_theory",
    "História da Música Brasileira": "https://en.wikipedia.org/wiki/History_of_Brazilian_music",
    "Harmonia": "https://en.wikipedia.org/wiki/Harmony_(music)",
    "Instrumento - Canto": "https://en.wikipedia.org/wiki/Vocal_music",
    "Instrumento - Violão": "https://en.wikipedia.org/wiki/Guitar",
    "Materiais Didáticos": "https://en.wikipedia.org/wiki/Teaching_material",
    "Prática Musical em Conjunto": "https://en.wikipedia.org/wiki/Musical_ensemble",
    "Práticas de Composição para Educação Musical": "https://en.wikipedia.org/wiki/Composition_(music)",
    "Práticas Vocais para a Educação Musical": "https://en.wikipedia.org/wiki/Vocal_music_education",
    "Projetos Sociais e Culturais e Educação Musical": "https://en.wikipedia.org/wiki/Music_education",
    "Sociologia e Educação Musical": "https://en.wikipedia.org/wiki/Sociology_of_music",
    "Tecnologias para Educação Musical": "https://en.wikipedia.org/wiki/Music_technology"
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

# Extrair tópicos existentes do arquivo HTML
soup = BeautifulSoup(existing_content, "html.parser")
existing_topics = {section.find("h2").get_text() for section in soup.find_all("section", class_="card")}

# Filtrar tópicos já existentes
available_topics = {key: value for key, value in topics.items() if key not in existing_topics}

# Inicializar novo conteúdo agregado
new_content = ""

# Inicializar o tradutor
translator = GoogleTranslator(source='en', target='pt')

# Seleção randômica de tópicos
random_topics = random.sample(list(available_topics.items()), min(len(available_topics), 5))

# Buscar e processar os tópicos selecionados
for topic_name, url in random_topics:
    try:
        # Obter o conteúdo da página
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")

        # Buscar os parágrafos, priorizando o conteúdo relevante
        paragraphs = soup.find_all("p")

        # Filtrar parágrafos que contêm texto útil (evitar links ou trechos irrelevantes)
        paragraphs = [p for p in paragraphs if p.get_text().strip() and not p.find("a")]

        # Garantir que encontramos pelo menos dois parágrafos relevantes
        if len(paragraphs) < 2:
            continue  # Pula este tópico se não encontrar conteúdo suficiente

        # Traduzir os parágrafos
        translated_paragraphs = []
        for p in paragraphs[:2]:  # Pegue apenas os dois primeiros parágrafos
            translated_text = translator.translate(p.get_text())
            translated_paragraphs.append(f"<p>{translated_text}</p>")

        # Adicionar a estrutura do card com título, conteúdo e fonte
        topic_content = (
            f'<section class="card neon-card mb-5">\n'
            f'  <div class="card-body">\n'
            f'    <h2 class="card-title neon-text">{topic_name}</h2>\n'
            + "\n".join(translated_paragraphs)
            + f'\n    <p><a href="{url}" target="_blank">Fonte: {url}</a></p>\n'
            f'  </div>\n'
            f'</section>\n'
        )
        new_content += topic_content + "\n"

    except Exception as e:
        print(f"Erro ao buscar conteúdo para {topic_name}: {e}")

# Inserir o novo conteúdo antes do fechamento do <body>
updated_content = existing_content.replace(
    "</body>", f"{new_content}\n</body>"
)

# Salvar o conteúdo atualizado no arquivo
with open(file_path, "w", encoding="utf-8") as file:
    file.write(updated_content)

print("Atualização concluída com sucesso!")
