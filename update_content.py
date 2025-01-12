import os
import requests
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator
import random

# Configurar tópicos e URLs de referência
topics = {
    "Análise Musical": "Musical_analysis",
    "História da Música": "History_of_music",
    "Educação de Jovens e Adultos no Brasil: História e Política": "Education_in_Brazil",
    "Educação Musical na Infância": "Childhood_music_education",
    "Fundamentos da Música": "Music_theory",
    "História da Música Brasileira": "History_of_Brazilian_music",
    "Harmonia": "Harmony_(music)",
    "Instrumento - Canto": "Vocal_music",
    "Instrumento - Violão": "Guitar",
    "Materiais Didáticos": "Teaching_material",
    "Prática Musical em Conjunto": "Musical_ensemble",
    "Práticas de Composição para Educação Musical": "Composition_(music)",
    "Práticas Vocais para a Educação Musical": "Vocal_music_education",
    "Projetos Sociais e Culturais e Educação Musical": "Music_education",
    "Sociologia e Educação Musical": "Sociology_of_music",
    "Tecnologias para Educação Musical": "Music_technology"
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

# Verificar se há tópicos disponíveis
if not available_topics:
    print("Não há novos tópicos disponíveis para adicionar.")
    exit()

# Inicializar novo conteúdo agregado
new_content = ""

# Inicializar o tradutor
translator = GoogleTranslator(source='en', target='pt')

# Função para obter uma página aleatória da Wikipedia relacionada a um tópico
def get_random_wikipedia_page(topic):
    url = f"https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&rntitle={topic}"
    response = requests.get(url)
    data = response.json()
    page_id = data['query']['random'][0]['id']
    page_url = f"https://en.wikipedia.org/?curid={page_id}"
    return page_url

# Seleção randômica de tópicos
random_topics = random.sample(list(available_topics.items()), min(len(available_topics), 5))

# Buscar e processar os tópicos selecionados
for topic_name, topic_keyword in random_topics:
    try:
        # Obter a URL de uma página aleatória relacionada ao tópico
        url = get_random_wikipedia_page(topic_keyword)

        # Obter o conteúdo da página
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")

        # Buscar os parágrafos, priorizando o conteúdo relevante
        paragraphs = soup.find_all("p")

        # Filtrar parágrafos que contêm texto útil (evitar links ou trechos irrelevantes)
        paragraphs = [p for p in paragraphs if p.get_text().strip() and not p.find("a")]

        # Garantir que encontramos pelo menos dois parágrafos relevantes
        if len(paragraphs) < 2:
            print(f"Não há conteúdo suficiente para o tópico: {topic_name}")
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

# Verificar se há novo conteúdo para adicionar
if new_content:
    # Inserir o novo conteúdo antes do fechamento do <body>
    updated_content = existing_content.replace(
        "</body>", f"{new_content}\n</body>"
    )

    # Salvar o conteúdo atualizado no arquivo
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(updated_content)

    print("Atualização concluída com sucesso!")
else:
    print("Nenhum novo conteúdo foi adicionado.")
