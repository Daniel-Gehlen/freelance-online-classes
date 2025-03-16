const notasContainer = document.querySelector(".notas-container");
const notasSelecionadasDiv = document.getElementById("notas-selecionadas");
const gerarCifraBtn = document.getElementById("gerar-cifra");
const campoHarmonicoDiv = document.getElementById("campo-harmonico");
const tocarNotasBtn = document.getElementById("tocar-notas");
const baixarTextoBtn = document.getElementById("baixar-texto");
const baixarMp3Btn = document.getElementById("baixar-mp3");
const resetarBtn = document.getElementById("resetar");
const tituloCampo = document.getElementById("titulo-campo");

// Novo elemento para o seletor de campo harmônico
const seletorCampoContainer = document.createElement("div");
seletorCampoContainer.className = "seletor-campo-container";
const campoHarmonicoSelect = document.createElement("select");
campoHarmonicoSelect.id = "campo-harmonico-select";
campoHarmonicoSelect.className = "campo-harmonico-select";
const gerarCampoCompletoBtn = document.createElement("button");
gerarCampoCompletoBtn.id = "gerar-campo-completo";
gerarCampoCompletoBtn.className = "btn-neon";
gerarCampoCompletoBtn.textContent = "Gerar Campo Harmônico Completo";

// Inserir o seletor e o botão após o título do campo harmônico
tituloCampo.parentNode.insertBefore(seletorCampoContainer, tituloCampo.nextSibling);
seletorCampoContainer.appendChild(campoHarmonicoSelect);
seletorCampoContainer.appendChild(gerarCampoCompletoBtn);



// Array para armazenar as notas selecionadas
let notasSelecionadas = [];
let campoHarmonico = [];

// Inicializar Tone.js
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
Tone.Transport.bpm.value = 60; // Definir o tempo para 60 BPM

// Mapeamento de notas para cifras com enarmonia
const notasParaCifra = {
  "C4": "C",
  "C#4": "C#/Db",
  "Db4": "Db/C#",
  "C𝄪4": "C𝄪/D", // Dobrado sustenido
  "D𝄫4": "D𝄫/C", // Dobrado bemol
  "D4": "D",
  "D#4": "D#/Eb",
  "Eb4": "Eb/D#",
  "E𝄫4": "E𝄫/D", // Dobrado bemol
  "E4": "E",
  "F4": "F",
  "F#4": "F#/Gb",
  "Gb4": "Gb/F#",
  "F𝄪4": "F𝄪/G", // Dobrado sustenido
  "G𝄫4": "G𝄫/F", // Dobrado bemol
  "G4": "G",
  "G#4": "G#/Ab",
  "Ab4": "Ab/G#",
  "A𝄫4": "A𝄫/G", // Dobrado bemol
  "A4": "A",
  "A#4": "A#/Bb",
  "Bb4": "Bb/A#",
  "B𝄫4": "B𝄫/A", // Dobrado bemol
  "B4": "B",
  "B#4": "B#/C", // Sustenido
  "Cb4": "Cb/B", // Bemol
  "C𝄫4": "C𝄫/Bb" // Dobrado bemol
};

// Mapeamento de notas para nomes em português
const notasParaPortugues = {
  "C4": "Dó",
  "C#4": "Dó#",
  "Db4": "Réb", // Bemol
  "C𝄪4": "Dó𝄪", // Dobrado sustenido
  "D𝄫4": "Rébb", // Dobrado bemol
  "D4": "Ré",
  "D#4": "Ré#",
  "Eb4": "Mib", // Bemol
  "E𝄫4": "Mibb", // Dobrado bemol
  "E4": "Mi",
  "F4": "Fá",
  "F#4": "Fá#",
  "Gb4": "Solb", // Bemol
  "F𝄪4": "Fá𝄪", // Dobrado sustenido
  "G𝄫4": "Solbb", // Dobrado bemol
  "G4": "Sol",
  "G#4": "Sol#",
  "Ab4": "Láb", // Bemol
  "A𝄫4": "Lább", // Dobrado bemol
  "A4": "Lá",
  "A#4": "Lá#",
  "Bb4": "Sib", // Bemol
  "B𝄫4": "Sibb", // Dobrado bemol
  "B4": "Si",
  "B#4": "Si#", // Sustenido
  "Cb4": "Dób", // Bemol
  "C𝄫4": "Dóbb" // Dobrado bemol
};

// Definição das estruturas de campo harmônico para as escalas mais comuns
const camposHarmonicos = {
  // Campos harmônicos maiores
  "C": ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  "G": ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  "D": ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  "A": ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  "E": ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  "B": ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
  "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
  "C#": ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"],
  "F": ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
  "Bb": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
  "Eb": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
  "Ab": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
  "Db": ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
  "Gb": ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"],
  "Cb": ["Cb", "Dbm", "Ebm", "Fb", "Gb", "Abm", "Bbdim"],

  // Campos harmônicos menores naturais
  "Am": ["Am", "Bdim", "C", "Dm", "Em", "F", "G"],
  "Em": ["Em", "F#dim", "G", "Am", "Bm", "C", "D"],
  "Bm": ["Bm", "C#dim", "D", "Em", "F#m", "G", "A"],
  "F#m": ["F#m", "G#dim", "A", "Bm", "C#m", "D", "E"],
  "C#m": ["C#m", "D#dim", "E", "F#m", "G#m", "A", "B"],
  "G#m": ["G#m", "A#dim", "B", "C#m", "D#m", "E", "F#"],
  "D#m": ["D#m", "E#dim", "F#", "G#m", "A#m", "B", "C#"],
  "A#m": ["A#m", "B#dim", "C#", "D#m", "E#m", "F#", "G#"],
  "Dm": ["Dm", "Edim", "F", "Gm", "Am", "Bb", "C"],
  "Gm": ["Gm", "Adim", "Bb", "Cm", "Dm", "Eb", "F"],
  "Cm": ["Cm", "Ddim", "Eb", "Fm", "Gm", "Ab", "Bb"],
  "Fm": ["Fm", "Gdim", "Ab", "Bbm", "Cm", "Db", "Eb"],
  "Bbm": ["Bbm", "Cdim", "Db", "Ebm", "Fm", "Gb", "Ab"],
  "Ebm": ["Ebm", "Fdim", "Gb", "Abm", "Bbm", "Cb", "Db"],
  "Abm": ["Abm", "Bbdim", "Cb", "Dbm", "Ebm", "Fb", "Gb"],
  "Dbm": ["Dbm", "Edim", "Fb", "Gbm", "Abm", "Bbb", "Cbm"],


    // Campos harmônicos menores harmônicos
    "Ahm": ["Am", "Bdim", "C+", "Dm", "E", "F", "G#dim"],
    "Ehm": ["Em", "F#dim", "G+", "Am", "B", "C", "D#dim"],
    "Bhm": ["Bm", "C#dim", "D+", "Em", "F#", "G", "A#dim"],
    "F#hm": ["F#m", "G#dim", "A+", "Bm", "C#", "D", "E#dim"],
    "C#hm": ["C#m", "D#dim", "E+", "F#m", "G#", "A", "B#dim"],
    "G#hm": ["G#m", "A#dim", "B+", "C#m", "D#", "E", "F#dim"],
    "D#hm": ["D#m", "E#dim", "F#+", "G#m", "A#", "B", "C#dim"],
    "A#hm": ["A#m", "B#dim", "C#+", "D#m", "E#", "F#", "G#dim"],
    "Dhm": ["Dm", "Edim", "F+", "Gm", "A", "Bb", "Cdim"],
    "Ghm": ["Gm", "Adim", "Bb+", "Cm", "D", "Eb", "Fdim"],
    "Chm": ["Cm", "Ddim", "Eb+", "Fm", "G", "Ab", "Bbdim"],
    "Fhm": ["Fm", "Gdim", "Ab+", "Bbm", "C", "Db", "Edim"],
    "Bbhm": ["Bbm", "Cdim", "Db+", "Ebm", "F", "Gb", "Adim"],
    "Ebhm": ["Ebm", "Fdim", "Gb+", "Abm", "Bb", "Cb", "Dbdim"],
    "Abhm": ["Abm", "Bbdim", "Cb+", "Dbm", "Eb", "Fb", "Gbdim"],
    "Dbm": ["Dbm", "Ebdim", "Fb", "Gbm", "Abm", "Bbb", "Cb"],
    "Gbm": ["Gbm", "Abdim", "Bbb", "Cbm", "Dbm", "Ebb", "Fb"],
    "Cbm": ["Cbm", "Ddim", "Ebb", "Fbm", "Gbm", "Abb", "Bbb"],
    "Fbm": ["Fbm", "Gdim", "Abb", "Bbm", "Cbm", "Dbb", "Ebb"],

  
    // Campos harmônicos menores melódicos
    "Amel": ["Am", "Bm", "C+", "Dm", "E", "F", "G#dim"],
    "Emel": ["Em", "F#m", "G+", "Am", "B", "C", "D#dim"],
    "Bmel": ["Bm", "C#m", "D+", "Em", "F#", "G", "A#dim"],
    "F#mel": ["F#m", "G#m", "A+", "Bm", "C#", "D", "E#dim"],
    "C#mel": ["C#m", "D#m", "E+", "F#m", "G#", "A", "B#dim"],
    "G#mel": ["G#m", "A#m", "B+", "C#m", "D#", "E", "F#dim"],
    "D#mel": ["D#m", "E#m", "F#+", "G#m", "A#", "B", "C#dim"],
    "A#mel": ["A#m", "B#m", "C#+", "D#m", "E#", "F#", "G#dim"],
    "Dmel": ["Dm", "Em", "F+", "Gm", "A", "Bb", "Cdim"],
    "Gmel": ["Gm", "Am", "Bb+", "Cm", "D", "Eb", "Fdim"],
    "Cmel": ["Cm", "Dm", "Eb+", "Fm", "G", "Ab", "Bbdim"],
    "Fmel": ["Fm", "Gm", "Ab+", "Bbm", "C", "Db", "Edim"],
    "Bbmel": ["Bbm", "Cm", "Db+", "Ebm", "F", "Gb", "Adim"],
    "Ebmel": ["Ebm", "Fm", "Gb+", "Abm", "Bb", "Cb", "Dbdim"],
    "Abmel": ["Abm", "Bbm", "Cb+", "Dbm", "Eb", "Fb", "Gbdim"],
    "Dbmel": ["Dbm", "Ebm", "Fb+", "Gbm", "Ab", "Bbb", "Cdim"],
    "Gbmel": ["Gbm", "Abm", "Bbb+", "Cbm", "Db", "Ebb", "Fdim"],
    "Cbmel": ["Cbm", "Dbm", "Ebb+", "Fbm", "Gb", "Abb", "Bbdim"],
    "Fbmel": ["Fbm", "Gbm", "Abb+", "Bbm", "Cb", "Dbb", "Ebbdim"],

};

// Mapeamento de acordes para suas notas correspondentes
const acordesParaNotas = {
  // Acordes Maiores
  "C": ["Do", "Mi", "Sol"],
  "G": ["Sol", "Si", "Ré"],
  "D": ["Ré", "Fá#", "Lá"],
  "A": ["Lá", "Do#", "Mi"],
  "E": ["Mi", "Sol#", "Si"],
  "B": ["Si", "Ré#", "Fá#"],
  "F#": ["Fá#", "Lá#", "Do#"],
  "C#": ["Do#", "Mi#", "Sol#"],
  "F": ["Fá", "Lá", "Do"],
  "Bb": ["Sib", "Ré", "Fá"],
  "Eb": ["Mib", "Sol", "Sib"],
  "Ab": ["Láb", "Dó", "Mib"],
  "Db": ["Réb", "Fá", "Láb"],
  "Gb": ["Solb", "Sib", "Réb"],
  "Cb": ["Dób", "Mib", "Solb"],
  "Fb": ["Lább", "Dób", "Mibb"],
  "Bbb": ["Sibb", "Rébb", "Fább"],
  "Ebb": ["Mibb", "Solb", "Sibb"],
  "Abb": ["Lább", "Dób", "Mibb"],
  "Dbb": ["Rébb", "Fább", "Lább"],
  "Gbb": ["Solb", "Sibb", "Rébb"],



  // Acordes Menores
  "Am": ["Lá", "Do", "Mi"],
  "Em": ["Mi", "Sol", "Si"],
  "Bm": ["Si", "Ré", "Fá#"],
  "F#m": ["Fá#", "Lá", "Do#"],
  "C#m": ["Do#", "Mi", "Sol#"],
  "G#m": ["Sol#", "Si", "Ré#"],
  "D#m": ["Ré#", "Fá#", "Lá#"],
  "A#m": ["Lá#", "Do#", "Mi#"],
  "Dm": ["Ré", "Fá", "Lá"],
  "Gm": ["Sol", "Sib", "Ré"],
  "Cm": ["Dó", "Mib", "Sol"],
  "Fm": ["Fá", "Láb", "Dó"],
  "Bbm": ["Sib", "Réb", "Fá"],
  "Ebm": ["Mib", "Solb", "Sib"],
  "Abm": ["Láb", "Dób", "Mib"],
  "Dbm": ["Réb", "Fáb", "Láb"],
  "Gbm": ["Solb", "Sibb", "Réb"],
  "Cbm": ["Dób", "Mibb", "Solb"],
  "Fbm": ["Fáb", "Lább", "Dób"],



  // Acordes Diminutos
  "Bdim": ["Si", "Ré", "Fá"],
  "F#dim": ["Fá#", "Lá", "Do"],
  "C#dim": ["Do#", "Mi", "Sol"],
  "G#dim": ["Sol#", "Si", "Ré"],
  "D#dim": ["Ré#", "Fá#", "Lá"],
  "A#dim": ["Lá#", "Do#", "Mi"],
  "E#dim": ["Mi#", "Sol#", "Si"],
  "B#dim": ["Si#", "Ré#", "Fá#"],
  "Edim": ["Mi", "Sol", "Sib"],
  "Adim": ["Lá", "Dó", "Mib"],
  "Ddim": ["Ré", "Fá", "Láb"],
  "Gdim": ["Sol", "Sib", "Réb"],
  "Cdim": ["Dó", "Mib", "Solb"],
  "Fdim": ["Fá", "Láb", "Réb"],
  "Bbdim": ["Sib", "Réb", "Mi"],
  "Ebdim": ["Mib", "Solb", "Sib"],
};

// Preencher o select com as opções de campo harmônico
for (const campo in camposHarmonicos) {
  const option = document.createElement("option");
  option.value = campo;

  let labelCampo;
  if (campo.endsWith('m') && !campo.endsWith("hm") && !campo.endsWith("mel")) {
    labelCampo = `${campo} (Menor Natural)`;
  } else if (campo.endsWith('hm')) {
    labelCampo = `${campo} (Menor Harmônica)`;
  } else if (campo.endsWith('mel')) {
    labelCampo = `${campo} (Menor Melódico)`;
  } else {
    labelCampo = `${campo} (Maior)`;
  }

  option.textContent = labelCampo;
  campoHarmonicoSelect.appendChild(option);
}

// Adicionar ou remover notas ao clicar nos quadrados
notasContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("nota-quadrado")) {
    const nota = e.target.dataset.nota;
    const index = notasSelecionadas.indexOf(nota);

    if (index === -1) {
      notasSelecionadas.push(nota);
      e.target.classList.add("selecionada");
    } else {
      notasSelecionadas.splice(index, 1);
      e.target.classList.remove("selecionada");
    }

    atualizarNotasSelecionadas();
  }
});

// Atualizar o display das notas selecionadas
function atualizarNotasSelecionadas() {
  notasSelecionadasDiv.innerHTML = notasSelecionadas
    .map((nota) => `<div class="nota-selecionada">${notasParaPortugues[nota]}</div>`)
    .join("");
}

// Gerar cifra a partir das notas selecionadas
gerarCifraBtn.addEventListener("click", () => {
  if (notasSelecionadas.length === 0) return;

  // Gerar cifra correta
  const cifra = gerarCifraCorreta(notasSelecionadas);
  const linha = `${notasSelecionadas.map((nota) => notasParaPortugues[nota]).join(" ")} = ${cifra}`;

  // Adicionar linha ao campo harmônico
  campoHarmonico.push(linha);
  atualizarCampoHarmonico();

  // Limpar notas selecionadas
  notasSelecionadas = [];
  notasSelecionadasDiv.innerHTML = "";
  document.querySelectorAll(".nota-quadrado").forEach((quadrado) => {
    quadrado.classList.remove("selecionada");
  });

  // Atualizar título
  atualizarTituloCampo();
});

// Função para gerar a cifra correta
function gerarCifraCorreta(notas) {
  if (notas.length < 3) return ""; // Pelo menos 3 notas para formar um acorde

  // Extrair os valores MIDI das notas para facilitar comparações
  const notasMidi = notas.map(nota => Tone.Frequency(nota).toMidi());

  // Funções para identificar os intervalos do acorde
  function temIntervalo(notaBase, intervalo, notasMidi) {
    const notaBaseMidi = Tone.Frequency(notaBase).toMidi();
    const alvoMidi = (notaBaseMidi + intervalo) % 12;
    return notasMidi.some(midi => midi % 12 === alvoMidi);
  }

  // Verificar cada nota como possível tônica
  for (const tonica of notas) {
    const tonicaMidi = Tone.Frequency(tonica).toMidi();

    // Verificar acorde maior (intervalos: 4 e 7 semitons)
    if (temIntervalo(tonica, 4, notasMidi) && temIntervalo(tonica, 7, notasMidi)) {
      return notasParaCifra[tonica]; // Acorde maior
    }

    // Verificar acorde menor (intervalos: 3 e 7 semitons)
    if (temIntervalo(tonica, 3, notasMidi) && temIntervalo(tonica, 7, notasMidi)) {
      return `${notasParaCifra[tonica]}m`; // Acorde menor
    }

    // Verificar acorde diminuto (intervalos: 3 e 6 semitons)
    if (temIntervalo(tonica, 3, notasMidi) && temIntervalo(tonica, 6, notasMidi)) {
      return `${notasParaCifra[tonica]}dim`; // Acorde diminuto
    }

    // Verificar acorde aumentado (intervalos: 4 e 8 semitons)
    if (temIntervalo(tonica, 4, notasMidi) && temIntervalo(tonica, 8, notasMidi)) {
      return `${notasParaCifra[tonica]}aug`; // Acorde aumentado
    }

    // Verificar acorde suspenso 4 (intervalos: 5 e 7 semitons)
    if (temIntervalo(tonica, 5, notasMidi) && temIntervalo(tonica, 7, notasMidi)) {
      return `${notasParaCifra[tonica]}sus4`; // Acorde sus4
    }

    // Verificar acorde suspenso 2 (intervalos: 2 e 7 semitons)
    if (temIntervalo(tonica, 2, notasMidi) && temIntervalo(tonica, 7, notasMidi)) {
      return `${notasParaCifra[tonica]}sus2`; // Acorde sus2
    }

    // Verificar sétima maior (intervalos: 4, 7 e 11 semitons)
    if (temIntervalo(tonica, 4, notasMidi) && temIntervalo(tonica, 7, notasMidi) && temIntervalo(tonica, 11, notasMidi)) {
      return `${notasParaCifra[tonica]}maj7`; // Acorde maior com sétima maior
    }

    // Verificar sétima (intervalos: 4, 7 e 10 semitons)
    if (temIntervalo(tonica, 4, notasMidi) && temIntervalo(tonica, 7, notasMidi) && temIntervalo(tonica, 10, notasMidi)) {
      return `${notasParaCifra[tonica]}7`; // Acorde maior com sétima
    }

    // Verificar menor com sétima (intervalos: 3, 7 e 10 semitons)
    if (temIntervalo(tonica, 3, notasMidi) && temIntervalo(tonica, 7, notasMidi) && temIntervalo(tonica, 10, notasMidi)) {
      return `${notasParaCifra[tonica]}m7`; // Acorde menor com sétima
    }

    // Verificar menor com sétima maior (intervalos: 3, 7 e 11 semitons)
    if (temIntervalo(tonica, 3, notasMidi) && temIntervalo(tonica, 7, notasMidi) && temIntervalo(tonica, 11, notasMidi)) {
      return `${notasParaCifra[tonica]}m(maj7)`; // Acorde menor com sétima maior
    }
  }

  // Se não for possível identificar um acorde comum, retorna como acorde inválido
  return "Acorde inválido";
}

// Função para normalizar as cifras (remover enarmonia e simplificar)
function normalizarCifra(cifra) {
  // Remover informações de sétima e outras extensões, manter apenas maior/menor/dim
  let cifraNormalizada = cifra.replace(/7|maj7|\(maj7\)|sus[24]|aug/, '');

  // Padronizar enarmonia para facilitar comparação
  cifraNormalizada = cifraNormalizada.replace('C#/Db', 'C#').replace('D#/Eb', 'D#')
                                     .replace('F#/Gb', 'F#').replace('G#/Ab', 'G#')
                                     .replace('A#/Bb', 'A#');

  return cifraNormalizada;
}

// Função para detectar o campo harmônico com base nos acordes
function detectarCampoHarmonico() {
  if (campoHarmonico.length < 3) {
    return "Campo Harmônico"; // Se poucos acordes, mantém nome genérico
  }

  // Extrair e normalizar as cifras dos acordes
  const cifras = campoHarmonico.map(linha => {
    const [notasStr, cifra] = linha.split(" = ");
    return normalizarCifra(cifra);
  });

  // Contar quantos acordes coincidem com cada campo harmônico
  const pontuacoes = {};

  for (const [tonalidade, acordes] of Object.entries(camposHarmonicos)) {
    let pontos = 0;

    cifras.forEach(cifra => {
      if (acordes.includes(cifra)) {
        pontos++;
      }
    });

    // Bônus se a tônica está presente
    if (acordes.includes(tonalidade)) {
      pontos += 2; // Adiciona um bônus se a tônica estiver presente
    }

    pontuacoes[tonalidade] = pontos;
  }

  // Determinar a tonalidade com a maior pontuação
  let melhorTonalidade = "Campo Harmônico";
  let maiorPontuacao = 0;

  for (const [tonalidade, pontos] of Object.entries(pontuacoes)) {
    if (pontos > maiorPontuacao) {
      maiorPontuacao = pontos;
      melhorTonalidade = tonalidade;
    }
  }

  return melhorTonalidade;
}

// Atualizar o campo harmônico na tela
function atualizarCampoHarmonico() {
  campoHarmonicoDiv.innerHTML = campoHarmonico
    .map(
      (linha, index) => `
        <div class="acorde-item" data-index="${index}" draggable="true">
          <button class="btn-neon acorde-btn" onclick="editarAcorde(${index})">${linha}</button>
          <button class="btn-neon deletar-btn" onclick="deletarAcorde(${index})">X</button>
        </div>
      `
    )
    .join("");

  // Adicionar eventos de arrastar e soltar
  const acordeItens = document.querySelectorAll(".acorde-item");
  acordeItens.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.dataset.index);
    });
  });

  campoHarmonicoDiv.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  campoHarmonicoDiv.addEventListener("drop", (e) => {
    e.preventDefault();
    const origemIndex = e.dataTransfer.getData("text/plain");
    const destinoIndex = Array.from(campoHarmonicoDiv.children).indexOf(e.target);

    if (origemIndex !== destinoIndex) {
      const acordeMovido = campoHarmonico.splice(origemIndex, 1)[0];
      campoHarmonico.splice(destinoIndex, 0, acordeMovido);
      atualizarCampoHarmonico();
    }
  });
}

// Editar um acorde
window.editarAcorde = function (index) {
  const linha = campoHarmonico[index];
  const [notasStr, cifra] = linha.split(" = ");
  const notas = notasStr.split(" ");

  // Atualizar notas selecionadas
  notasSelecionadas = notas.map((nota) => {
    const notaIngles = Object.keys(notasParaPortugues).find(
      (key) => notasParaPortugues[key] === nota
    );
    return notaIngles;
  });

  // Remover o acorde da lista
  campoHarmonico.splice(index, 1);
  atualizarCampoHarmonico();
  atualizarNotasSelecionadas();
};

// Deletar um acorde
window.deletarAcorde = function (index) {
  campoHarmonico.splice(index, 1);
  atualizarCampoHarmonico();
  atualizarTituloCampo();
};

// Atualizar o título do campo harmônico
function atualizarTituloCampo() {
  // Usar a função detectarCampoHarmonico para obter a tonalidade do campo harmônico
  const campoHarmonicoDetectado = detectarCampoHarmonico();

  // Verificar se é um campo maior ou menor com base no nome detectado
  if (campoHarmonicoDetectado.endsWith('m')) {
    tituloCampo.textContent = `Campo Harmônico de ${campoHarmonicoDetectado} (Menor)`;
  } else if (campoHarmonicoDetectado !== "Campo Harmônico") {
    tituloCampo.textContent = `Campo Harmônico de ${campoHarmonicoDetectado} (Maior)`;
  } else {
    // Fallback para o método original como salvaguarda
    const maiorCount = campoHarmonico.filter((linha) => !linha.includes("m") || linha.includes("maj7")).length;
    const menorCount = campoHarmonico.filter((linha) => linha.includes("m") && !linha.includes("maj7")).length;

    if (maiorCount > menorCount) {
      tituloCampo.textContent = "Campo Harmônico Maior";
    } else if (menorCount > maiorCount) {
      tituloCampo.textContent = "Campo Harmônico Menor";
    } else {
      tituloCampo.textContent = "Campo Harmônico";
    }
  }
}

// Mapeamento de graus para algarismos romanos em campos maiores
const grausRomanosMaiores = ["I", "ii", "iii", "IV", "V", "Vi", "Viiº", "I"];

// Mapeamento de graus para algarismos romanos em campos menores naturais
const grausRomanosMenoresNaturais = ["i", "iiº", "iii", "iv", "v", "vi", "vii", "i"];

// Mapeamento de graus para algarismos romanos em campos menores harmônicos
const grausRomanosMenoresHarmonicos = ["i", "iiº", "iii+", "iv", "v", "vi", "viiº", "i"];

// Mapeamento de graus para algarismos romanos em campos menores melódicos
const grausRomanosMenoresMelodicos = ["i", "ii", "iii+", "iv", "v", "vi", "vii", "i"];

// Evento para gerar o campo harmônico
gerarCampoCompletoBtn.addEventListener("click", () => {
  const campoSelecionado = campoHarmonicoSelect.value;
  let grausRomanos;
  
  if (campoSelecionado.endsWith('m')) {
    grausRomanos = grausRomanosMenoresNaturais;
  } else if (campoSelecionado.endsWith('hm')) {
    grausRomanos = grausRomanosMenoresHarmonicos;
  } else if (campoSelecionado.endsWith('mel')) {
    grausRomanos = grausRomanosMenoresMelodicos;
  } else {
    grausRomanos = grausRomanosMaiores;
  }

  // Limpar o campo harmônico atual
  campoHarmonico = [];
  campoHarmonicoDiv.innerHTML = "";
  
  // Gerar os acordes
  const acordesCampo = camposHarmonicos[campoSelecionado];
  acordesCampo.forEach((acorde, index) => {
    const notas = acordesParaNotas[acorde] || [];
    const grauRomano = grausRomanos[index] || "?";
    const linha = `${grauRomano} - ${notas.join(" ")} = ${acorde}`;
    campoHarmonico.push(linha);
  });
  
  // Adicionar o oitavo acorde (repetição do primeiro)
  if (acordesCampo.length > 0) {
    const primeiroAcorde = acordesCampo[0];
    const notasPrimeiroAcorde = acordesParaNotas[primeiroAcorde] || [];
    const linhaPrimeiroAcorde = `${grausRomanos[7] || "?"} - ${notasPrimeiroAcorde.join(" ")} = ${primeiroAcorde}`;
    campoHarmonico.push(linhaPrimeiroAcorde);
  }

  console.log("Campo harmônico atualizado:", campoHarmonico);
  atualizarCampoHarmonico();
  atualizarTituloCampo();
});

// Função para salvar o campo harmônico como arquivo de texto
function salvarCampoHarmonicoComoTexto() {
  if (campoHarmonico.length === 0) return;

  const campoHarmonicoDetectado = detectarCampoHarmonico();
  let tituloArquivo = "Campo Harmônico";

  if (campoHarmonicoDetectado !== "Campo Harmônico") {
    tituloArquivo = campoHarmonicoDetectado.endsWith('m') ?
      `Campo Harmônico de ${campoHarmonicoDetectado} (Menor)` :
      `Campo Harmônico de ${campoHarmonicoDetectado} (Maior)`;
  }

  const textoCampo = `${tituloArquivo}\n\n${campoHarmonico.join("\n")}`;
  const blob = new Blob([textoCampo], { type: "text/plain" });
  saveAs(blob, `campo_harmonico_${campoHarmonicoDetectado.replace(/[^\w]/g, '')}.txt`);
}

// Função para salvar o campo harmônico como arquivo MP3
async function salvarCampoHarmonicoComoMP3() {
  if (campoHarmonico.length === 0) return;

  await Tone.start(); // Iniciar o contexto de áudio
  const recorder = new Tone.Recorder();
  synth.connect(recorder);
  recorder.start();

  // Tocar cada acorde em sequência com pausa
  campoHarmonico.forEach((linha, index) => {
    const [notasStr, cifra] = linha.split(" = ");
    const notas = notasStr.split(" ").map((nota) => {
      const notaIngles = Object.keys(notasParaPortugues).find(
        (key) => notasParaPortugues[key] === nota
      );
      return notaIngles;
    });

    // Agendar o acorde no Transport
    Tone.Transport.schedule((time) => {
      synth.triggerAttackRelease(notas, "2n", time);
    }, index * 2); // Intervalo de 2 segundos (1 segundo de som + 1 segundo de pausa)
  });

  // Iniciar o Transport
  Tone.Transport.start();

  // Parar a gravação após o tempo total
  setTimeout(async () => {
    Tone.Transport.stop();
    const recording = await recorder.stop();
    const blob = await recording;
    saveAs(blob, "campo_harmonico.mp3");
  }, campoHarmonico.length * 2000); // Tempo total da gravação
}

// Adicionar eventos de clique para os botões de download
baixarTextoBtn.addEventListener("click", salvarCampoHarmonicoComoTexto);
baixarMp3Btn.addEventListener("click", salvarCampoHarmonicoComoMP3);

// Tocar a sequência de acordes
tocarNotasBtn.addEventListener("click", async () => {
  if (campoHarmonico.length === 0) return;

  await Tone.start(); // Iniciar o contexto de áudio

  // Parar e limpar eventos anteriores
  Tone.Transport.stop();
  Tone.Transport.cancel();

  // Tocar cada acorde em sequência com pausa
  campoHarmonico.forEach((linha, index) => {
    const [notasStr, cifra] = linha.split(" = ");
    const notas = notasStr.split(" ").map((nota) => {
      const notaIngles = Object.keys(notasParaPortugues).find(
        (key) => notasParaPortugues[key] === nota
      );
      return notaIngles;
    });

    // Agendar o acorde no Transport
    Tone.Transport.schedule((time) => {
      synth.triggerAttackRelease(notas, "2n", time);
    }, index * 2); // Intervalo de 2 segundos (1 segundo de som + 1 segundo de pausa)
  });

  // Iniciar o Transport
  Tone.Transport.start();
});

// Selecionar o botão Stop
const stopBtn = document.getElementById("stop");

// Adicionar evento de clique para parar a reprodução
stopBtn.addEventListener("click", () => {
  Tone.Transport.stop(); // Para a reprodução
  Tone.Transport.cancel(); // Cancela todos os eventos agendados
});

// Resetar tudo
resetarBtn.addEventListener("click", () => {
  notasSelecionadas = [];
  campoHarmonico = [];
  notasSelecionadasDiv.innerHTML = "";
  campoHarmonicoDiv.innerHTML = "";
  tituloCampo.textContent = "";
  document.querySelectorAll(".nota-quadrado").forEach((quadrado) => {
    quadrado.classList.remove("selecionada");
  });
  Tone.Transport.cancel(); // Parar o Transport
});
