import os
import requests
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator
import random
import hashlib
import time

# Configuração dos tópicos e URLs
TOPICS = {
    "Teoria Musical Básica": {
        "url": "https://en.wikipedia.org/wiki/Music_theory",
        "sections": ["Fundamentals", "Elements", "Basic_concepts"]
    },
    "História da Música": {
        "url": "https://en.wikipedia.org/wiki/History_of_music",
        "sections": ["Origins", "Ancient_music", "Medieval_music"]
    },
    "Notação Musical": {
        "url": "https://en.wikipedia.org/wiki/Musical_notation",
        "sections": ["Modern_staff_notation", "Elements", "Basic_elements"]
    },
    "Harmonia": {
        "url": "https://en.wikipedia.org/wiki/Harmony",
        "sections": ["Definition_and_scope", "Historical_development", "Types_of_harmony"]
    },
    "Ritmo": {
        "url": "https://en.wikipedia.org/wiki/Rhythm",
        "sections": ["Terminology", "Metric_structure", "Rhythmic_gesture"]
    },
    "Melodia": {
        "url": "https://en.wikipedia.org/wiki/Melody",
        "sections": ["Definition", "Types_of_melody", "Cultural_impact"]
    },
    "Violão": {
        "url": "https://en.wikipedia.org/wiki/Classical_guitar",
        "sections": ["Construction", "Technique", "History"]
    },
    "Guitarra": {
        "url": "https://en.wikipedia.org/wiki/Electric_guitar",
        "sections": ["Construction", "Playing_techniques", "Sound_and_effects"]
    },
    "Ukulele": {
        "url": "https://en.wikipedia.org/wiki/Ukulele",
        "sections": ["History", "Types", "Tuning"]
    },
    "Técnica Vocal": {
        "url": "https://en.wikipedia.org/wiki/Singing",
        "sections": ["Technique", "Voice_types", "Training"]
    }
}

def generate_content_hash(content):
    """Gera um hash único para o conteúdo, ignorando espaços em branco e formatação"""
    normalized_content = ' '.join(content.lower().split())
    return hashlib.md5(normalized_content.encode('utf-8')).hexdigest()

def get_existing_content_hashes(html_content):
    """Extrai e retorna hashes de todo o conteúdo existente"""
    soup = BeautifulSoup(html_content, 'html.parser')
    content_hashes = set()

    for section in soup.find_all('section', class_='card'):
        content = section.get_text().strip()
        content_hashes.add(generate_content_hash(content))

    return content_hashes

def is_content_duplicate(content, existing_hashes):
    """Verifica se o conteúdo já existe baseado em seu hash"""
    return generate_content_hash(content) in existing_hashes

def create_initial_html():
    """Cria o arquivo HTML inicial com a estrutura básica e estilos"""
    return """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teoria Musical - Conteúdo Didático</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .dark-theme {
            background-color: #121212;
            color: #ffffff;
        }
        .neon-card {
            background-color: #1e1e1e;
            border: 1px solid #333;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
            margin-bottom: 20px;
        }
        .neon-text {
            color: #00ffff;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        }
        .card-body {
            padding: 20px;
        }
        a {
            color: #00ffff;
            text-decoration: none;
        }
        a:hover {
            color: #ffffff;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.8);
        }
    </style>
</head>
<body class="dark-theme">
    <header class="container text-center py-5">
        <h1 class="neon-text">Teoria Musical - Conteúdo Didático</h1>
        <p>Uma compilação de conhecimentos musicais para seu aprendizado</p>
    </header>
    <main class="container my-5">
        <!-- O conteúdo será inserido aqui -->
    </main>
    <footer class="container text-center py-3">
        <p class="neon-text">&copy; 2025 Conteúdo Educacional de Música</p>
    </footer>
</body>
</html>"""

def get_wikipedia_content(url, sections):
    """Obtém conteúdo específico da Wikipedia baseado nas seções definidas"""
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        content = []

        for section in sections:
            section_element = soup.find(id=section)
            if section_element:
                # Pega os parágrafos após o cabeçalho da seção
                next_elements = section_element.find_next_siblings()
                for element in next_elements:
                    if element.name == 'p' and element.text.strip():
                        content.append(element.text.strip())
                    if len(content) >= 2:  # Limita a 2 parágrafos por seção
                        break

        return content[:2]  # Retorna no máximo 2 parágrafos
    except Exception as e:
        print(f"Erro ao acessar {url}: {e}")
        return []

def update_content():
    file_path = "teoria-musical-wikipedia.html"

    # Criar arquivo inicial se não existir
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(create_initial_html())

    # Ler conteúdo existente
    with open(file_path, "r", encoding="utf-8") as file:
        existing_content = file.read()

    # Obter hashes do conteúdo existente
    existing_hashes = get_existing_content_hashes(existing_content)

    # Processar tópicos e gerar novo conteúdo
    new_content = []
    translator = GoogleTranslator(source='en', target='pt')

    # Sortear tópicos aleatoriamente
    random_topics = random.sample(list(TOPICS.items()), len(TOPICS))

    for topic_name, topic_info in random_topics:
        try:
            paragraphs = get_wikipedia_content(topic_info["url"], topic_info["sections"])

            if not paragraphs:
                continue

            translated_paragraphs = []
            for p in paragraphs:
                try:
                    translated_text = translator.translate(p)
                    translated_paragraphs.append(f"<p>{translated_text}</p>")
                    time.sleep(1)  # Evita sobrecarga na API de tradução
                except Exception as e:
                    print(f"Erro na tradução para {topic_name}: {e}")
                    continue

            if not translated_paragraphs:
                continue

            topic_content = f"""
            <section class="card neon-card mb-5">
                <div class="card-body">
                    <h2 class="card-title neon-text">{topic_name}</h2>
                    {''.join(translated_paragraphs)}
                    <p><a href="{topic_info['url']}" target="_blank">Fonte: {topic_info['url']}</a></p>
                </div>
            </section>"""

            if not is_content_duplicate(topic_content, existing_hashes):
                new_content.append(topic_content)
                existing_hashes.add(generate_content_hash(topic_content))

        except Exception as e:
            print(f"Erro ao processar {topic_name}: {e}")

        time.sleep(2)  # Pausa entre requisições para evitar sobrecarga

    if new_content:
        # Inserir novo conteúdo antes do </main>
        soup = BeautifulSoup(existing_content, 'html.parser')
        main_tag = soup.find('main')

        for content in new_content:
            content_soup = BeautifulSoup(content, 'html.parser')
            main_tag.append(content_soup)

        # Salvar arquivo atualizado
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(str(soup.prettify()))

        print(f"Adicionados {len(new_content)} novos tópicos.")
    else:
        print("Nenhum novo conteúdo para adicionar.")

if __name__ == "__main__":
    update_content()
