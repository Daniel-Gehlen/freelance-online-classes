// Seletores de elementos
const notasContainer = document.querySelector(".notas-container");
const notasSelecionadasDiv = document.getElementById("notas-selecionadas");
const tocarNotasBtn = document.getElementById("tocar-notas");
const tocarHarmonicamenteBtn = document.getElementById("tocar-harmonicamente");
const stopBtn = document.getElementById("stop");
const baixarTextoBtn = document.getElementById("baixar-texto");
const baixarMp3Btn = document.getElementById("baixar-mp3");
const resetarBtn = document.getElementById("resetar");
const gerarIntervalosBtn = document.getElementById("gerar-cifra");
const cifraContainer = document.getElementById("cifra-container");

// Array para armazenar as notas selecionadas
let notasSelecionadas = [];

// Inicializar o sintetizador do Tone.js
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
Tone.Transport.bpm.value = 60; // Definir o tempo para 60 BPM

// Função para atualizar as notas selecionadas na tela
function atualizarNotasSelecionadas() {
    notasSelecionadasDiv.innerHTML = notasSelecionadas
        .map((nota) => `<div class="nota-selecionada">${nota}</div>`)
        .join("");
}

// Evento para selecionar/deselecionar notas
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

// Função para tocar as notas melodicamente (em sequência)
tocarNotasBtn.addEventListener("click", async () => {
    if (notasSelecionadas.length === 0) return;

    await Tone.start(); // Iniciar o contexto de áudio

    // Parar e limpar eventos anteriores
    Tone.Transport.stop();
    Tone.Transport.cancel();

    // Tocar cada nota em sequência com pausa
    notasSelecionadas.forEach((nota, index) => {
        Tone.Transport.schedule((time) => {
            synth.triggerAttackRelease(nota, "2n", time);
        }, index * 2); // Intervalo de 2 segundos (1 segundo de som + 1 segundo de pausa)
    });

    // Iniciar o Transport
    Tone.Transport.start();
});

// Função para tocar as notas harmonicamente (todas ao mesmo tempo)
tocarHarmonicamenteBtn.addEventListener("click", async () => {
    if (notasSelecionadas.length === 0) return;

    await Tone.start(); // Iniciar o contexto de áudio

    // Parar e limpar eventos anteriores
    Tone.Transport.stop();
    Tone.Transport.cancel();

    // Tocar todas as notas ao mesmo tempo
    Tone.Transport.schedule((time) => {
        synth.triggerAttackRelease(notasSelecionadas, "2n", time);
    }, 0); // Tocar imediatamente

    // Iniciar o Transport
    Tone.Transport.start();
});

// Função para parar a reprodução
stopBtn.addEventListener("click", () => {
    Tone.Transport.stop(); // Parar a reprodução
    Tone.Transport.cancel(); // Cancelar todos os eventos agendados
});

// Função para resetar tudo
resetarBtn.addEventListener("click", () => {
    notasSelecionadas = []; // Limpar as notas selecionadas
    notasSelecionadasDiv.innerHTML = ""; // Limpar a exibição das notas selecionadas
    document.querySelectorAll(".nota-quadrado").forEach((quadrado) => {
        quadrado.classList.remove("selecionada"); // Remover a classe "selecionada" dos quadrados
    });
    cifraContainer.innerHTML = ""; // Limpar o container de intervalos
    Tone.Transport.stop(); // Parar a reprodução
    Tone.Transport.cancel(); // Cancelar todos os eventos agendados
});

// Função para salvar as notas selecionadas como arquivo de texto
function salvarNotasComoTexto() {
    if (notasSelecionadas.length === 0) return;

    const textoNotas = notasSelecionadas.join("\n");
    const blob = new Blob([textoNotas], { type: "text/plain" });
    saveAs(blob, "notas_selecionadas.txt");
}

// Função para salvar as notas selecionadas como arquivo MP3
async function salvarNotasComoMP3() {
    if (notasSelecionadas.length === 0) return;

    await Tone.start(); // Iniciar o contexto de áudio
    const recorder = new Tone.Recorder();
    synth.connect(recorder);
    recorder.start();

    // Tocar todas as notas ao mesmo tempo
    Tone.Transport.schedule((time) => {
        synth.triggerAttackRelease(notasSelecionadas, "2n", time);
    }, 0); // Tocar imediatamente

    // Iniciar o Transport
    Tone.Transport.start();

    // Parar a gravação após 2 segundos
    setTimeout(async () => {
        Tone.Transport.stop();
        const recording = await recorder.stop();
        const blob = await recording;
        saveAs(blob, "notas_selecionadas.mp3");
    }, 2000); // Tempo total da gravação
}

// Adicionar eventos de clique para os botões de download
baixarTextoBtn.addEventListener("click", salvarNotasComoTexto);
baixarMp3Btn.addEventListener("click", salvarNotasComoMP3);

// Função para gerar intervalos musicais com base na nota selecionada
gerarIntervalosBtn.addEventListener("click", () => {
    if (notasSelecionadas.length === 0) {
        alert("Selecione pelo menos uma nota para gerar os intervalos.");
        return;
    }

    cifraContainer.innerHTML = ""; // Limpar o container de intervalos

    // Nota base para gerar os intervalos (a primeira nota selecionada)
    const notaBase = notasSelecionadas[0];

    // Intervalos musicais pré-definidos (em semitons)
    const intervalos = {
        "Segunda Menor": 1,
        "Segunda Maior": 2,
        "Terça Menor": 3,
        "Terça Maior": 4,
        "Quarta Justa": 5,
        "Quarta Aumentada": 6,
        "Quinta Justa": 7,
        "Sexta Menor": 8,
        "Sexta Maior": 9,
        "Sétima Menor": 10,
        "Sétima Maior": 11,
        "Oitava Justa": 12
    };

    // Gerar e exibir todos os intervalos a partir da nota base
    for (const [nomeIntervalo, semitons] of Object.entries(intervalos)) {
        const notaAlvo = Tone.Frequency(notaBase).transpose(semitons).toNote();
        const intervaloDiv = document.createElement("div");
        intervaloDiv.className = "intervalo-item";
        intervaloDiv.innerHTML = `
            <strong>${nomeIntervalo}</strong>: ${notaBase} → ${notaAlvo}
            <button class="btn-neon" onclick="tocarIntervalo(['${notaBase}', '${notaAlvo}'], 'asc')">Tocar Asc.</button>
            <button class="btn-neon" onclick="tocarIntervalo(['${notaAlvo}', '${notaBase}'], 'desc')">Tocar Desc.</button>
        `;
        cifraContainer.appendChild(intervaloDiv);
    }
});

// Função para tocar um intervalo específico (ascendente ou descendente)
window.tocarIntervalo = function (notas, direcao) {
    notasSelecionadas = notas;
    atualizarNotasSelecionadas();

    if (direcao === 'asc') {
        tocarNotasBtn.click(); // Tocar melodicamente (ascendente)
    } else if (direcao === 'desc') {
        tocarNotasBtn.click(); // Tocar melodicamente (descendente)
    }
};