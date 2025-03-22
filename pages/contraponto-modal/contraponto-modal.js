// Music Sheet Editor JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const canvas = document.getElementById('music-staff');
  const ctx = canvas.getContext('2d');
  const clearButton = document.getElementById('clear-notes');
  const playButton = document.getElementById('play-composition');
  const downloadImageButton = document.getElementById('download-image');
  const downloadMP3Button = document.getElementById('download-mp3');
  const durationButtons = document.querySelectorAll('.duration-btn');
  const voiceButtons = document.querySelectorAll('.voice-btn');

  // State
  let notes = [];
  let selectedDuration = 'quarter';
  let selectedVoice = 'first';
  let isPlaying = false;
  let audioContext = null;

  // Constants
  const LINE_SPACING = 10;
  const NOTE_FREQUENCIES = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
  };
  const NOTE_DURATIONS = {
    'whole': 2.0,
    'half': 1.0,
    'quarter': 0.5,
    'eighth': 0.25,
    'sixteenth': 0.125
  };

  // Initialize AudioContext
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Resize canvas to fit container
  function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 20;
    canvas.height = 300;
    drawStaff();
  }

  // Draw the staff and all notes
  function drawStaff() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    // Draw staff lines
    const startY = canvas.height / 2 - LINE_SPACING * 2;

    for (let i = 0; i < 5; i++) {
      const y = startY + i * LINE_SPACING;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
    }

    // Draw treble clef
    ctx.font = '60px serif';
    ctx.fillText('𝄞', 10, startY + 35);

    // Draw notes
    notes.forEach(note => {
      drawNote(note);
    });
  }

  // Draw a single note
  function drawNote(note) {
    const { position, type, voice } = note;
    const { x, y } = position;

    // Use different colors for different voices
    const voiceColor = voice === 'first' ? '#000' : '#0066cc';

    // Staff parameters
    const startY = canvas.height / 2 - LINE_SPACING * 2;
    const staffTop = startY;
    const staffBottom = startY + 4 * LINE_SPACING;

    // Draw ledger lines if needed
    if (y < staffTop || y > staffBottom) {
      ctx.beginPath();
      ctx.strokeStyle = voiceColor;
      ctx.lineWidth = 1;

      // Ledger lines above the staff
      if (y < staffTop) {
        let ledgerY = staffTop - LINE_SPACING;
        while (ledgerY >= y - LINE_SPACING / 2) {
          // Draw ledger line for every line position (not space)
          if (Math.abs((ledgerY - staffTop) % (LINE_SPACING)) < 0.1) {
            ctx.moveTo(x - 12, ledgerY);
            ctx.lineTo(x + 12, ledgerY);
          }
          ledgerY -= LINE_SPACING / 2;
        }
      }

      // Ledger lines below the staff
      if (y > staffBottom) {
        let ledgerY = staffBottom + LINE_SPACING;
        while (ledgerY <= y + LINE_SPACING / 2) {
          // Draw ledger line for every line position (not space)
          if (Math.abs((ledgerY - staffBottom) % (LINE_SPACING)) < 0.1) {
            ctx.moveTo(x - 12, ledgerY);
            ctx.lineTo(x + 12, ledgerY);
          }
          ledgerY += LINE_SPACING / 2;
        }
      }

      ctx.stroke();
    }

    // Draw note head
    ctx.beginPath();
    if (type === 'quarter' || type === 'eighth' || type === 'sixteenth') {
      ctx.fillStyle = voiceColor;
    } else {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = voiceColor;
    }

    ctx.ellipse(x, y, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    if (type === 'whole' || type === 'half') {
      ctx.stroke();
    }

    // Draw stem for notes that have them
    if (type !== 'whole') {
      ctx.beginPath();
      ctx.strokeStyle = voiceColor;
      ctx.moveTo(x + 6, y);
      ctx.lineTo(x + 6, y - 30);
      ctx.stroke();
    }

    // Draw flags for eighth and sixteenth notes
    if (type === 'eighth' || type === 'sixteenth') {
      ctx.beginPath();
      ctx.strokeStyle = voiceColor;
      ctx.moveTo(x + 6, y - 30);
      ctx.quadraticCurveTo(x + 20, y - 25, x + 15, y - 15);
      ctx.stroke();

      if (type === 'sixteenth') {
        ctx.beginPath();
        ctx.moveTo(x + 6, y - 22);
        ctx.quadraticCurveTo(x + 20, y - 17, x + 15, y - 7);
        ctx.stroke();
      }
    }
  }

  // Handle canvas click to add notes
  function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap Y position to nearest line or space
    const startY = canvas.height / 2 - LINE_SPACING * 2;
    const relativeY = y - startY;
    const lineIndex = Math.round(relativeY / (LINE_SPACING / 2)) * (LINE_SPACING / 2);
    const snappedY = startY + lineIndex;

    // Only allow notes to be placed after the treble clef
    if (x > 50 && x < canvas.width - 20) {
      // Map Y position to note value
      const noteValue = yPositionToNote(snappedY, startY, LINE_SPACING);
      addNote({ x, y: snappedY }, noteValue);
    }
  }

  // Convert Y position to note value
  function yPositionToNote(y, staffStartY, lineSpacing) {
    // Calculate how many half-steps from middle C (which is one ledger line below the staff)
    const middleCY = staffStartY + 5 * lineSpacing; // Middle C position
    const halfStepsFromMiddleC = Math.round((middleCY - y) / (lineSpacing / 2));

    // Map half steps to note names
    const noteNames = [
      'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
      'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
      'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'
    ];

    // Middle C is C4, which is at index 7 in our array
    const middleCIndex = 7;
    const noteIndex = middleCIndex + halfStepsFromMiddleC;

    // Ensure we stay within the range of our note names
    if (noteIndex < 0) return noteNames[0];
    if (noteIndex >= noteNames.length) return noteNames[noteNames.length - 1];

    return noteNames[noteIndex];
  }

  // Add a note to the staff
  function addNote(position, noteValue) {
    // Check if there's already a note with the same value at this position and voice
    const existingNoteWithSameValue = notes.find(note =>
      Math.abs(note.position.x - position.x) < 10 &&
      Math.abs(note.position.y - position.y) < 5 &&
      note.value === noteValue &&
      note.voice === selectedVoice
    );

    // If there's already a note with the same value at this position and voice, don't add another
    if (existingNoteWithSameValue) return;

    const newNote = {
      id: Date.now().toString(),
      type: selectedDuration,
      value: noteValue,
      position,
      voice: selectedVoice
    };

    notes.push(newNote);
    drawStaff();
  }

  // Play the composition
  async function playComposition() {
    if (isPlaying || notes.length === 0) return;

    initAudioContext();
    isPlaying = true;
    playButton.textContent = 'Parar';

    // Group notes by their x-position to identify chords
    const notesByPosition = {};
    notes.forEach(note => {
      // Round x position to nearest 5px to group notes that are close together
      const xPos = Math.round(note.position.x / 5) * 5;
      if (!notesByPosition[xPos]) {
        notesByPosition[xPos] = [];
      }
      notesByPosition[xPos].push(note);
    });

    // Sort positions to play notes in order from left to right
    const positions = Object.keys(notesByPosition).map(Number).sort((a, b) => a - b);

    // Play each position (chord or single note) sequentially
    for (const position of positions) {
      if (!isPlaying) break; // Stop if user clicked stop

      const notesAtPosition = notesByPosition[position];
      const oscillators = [];
      const gainNodes = [];

      // Create oscillators for all notes in the chord
      for (const note of notesAtPosition) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = NOTE_FREQUENCIES[note.value] || 440;

        gainNode.gain.value = 0.3; // Lower gain for chords to prevent clipping

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillators.push(oscillator);
        gainNodes.push(gainNode);
      }

      // Get the duration from the first note (assuming all notes in a chord have the same duration)
      const duration = NOTE_DURATIONS[notesAtPosition[0].type];

      // Start all oscillators simultaneously for the chord
      oscillators.forEach((osc, i) => {
        osc.start();

        // Create envelope
        gainNodes[i].gain.setValueAtTime(0, audioContext.currentTime);
        gainNodes[i].gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNodes[i].gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
      });

      // Wait for note duration
      await new Promise(resolve => setTimeout(resolve, duration * 1000));

      // Stop all oscillators
      oscillators.forEach(osc => osc.stop());
    }

    isPlaying = false;
    playButton.textContent = 'Tocar';
  }

  // Stop playback
  function stopPlayback() {
    isPlaying = false;
    playButton.textContent = 'Tocar';
  }

  // Download the staff as an image
  function downloadImage() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    const tempCtx = tempCanvas.getContext('2d');

    // Draw white background
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw staff and notes
    tempCtx.drawImage(canvas, 0, 0);

    // Create download link
    const link = document.createElement('a');
    link.download = 'contraponto-composicao.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  }

  // Função para baixar a composição como MP3
  function downloadMP3() {
    if (notes.length === 0) {
      alert('Adicione algumas notas antes de baixar o MP3.');
      return;
    }

    initAudioContext();

    // Cria um nó de destino para gravação
    const destination = audioContext.createMediaStreamDestination();
    const recorder = new MediaRecorder(destination.stream);
    const chunks = [];

    // Configura o gravador
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      // Converte os chunks em um único blob
      const blob = new Blob(chunks, { type: 'audio/wav' });

      // Cria um link para download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'contraponto-composicao.mp3';
      link.click();

      // Limpa recursos
      URL.revokeObjectURL(url);
    };

    // Inicia a gravação
    recorder.start();

    // Prepara para tocar a composição
    const notesByPosition = {};
    notes.forEach(note => {
      const xPos = Math.round(note.position.x / 5) * 5;
      if (!notesByPosition[xPos]) {
        notesByPosition[xPos] = [];
      }
      notesByPosition[xPos].push(note);
    });

    const positions = Object.keys(notesByPosition).map(Number).sort((a, b) => a - b);

    // Função para tocar as notas sequencialmente durante a gravação
    async function playForRecording() {
      for (const position of positions) {
        const notesAtPosition = notesByPosition[position];
        const oscillators = [];
        const gainNodes = [];

        // Cria osciladores para todas as notas no acorde
        for (const note of notesAtPosition) {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.type = 'sine';
          oscillator.frequency.value = NOTE_FREQUENCIES[note.value] || 440;

          gainNode.gain.value = 0.3;

          oscillator.connect(gainNode);
          // Conecta tanto ao destino de áudio quanto ao gravador
          gainNode.connect(audioContext.destination);
          gainNode.connect(destination);

          oscillators.push(oscillator);
          gainNodes.push(gainNode);
        }

        const duration = NOTE_DURATIONS[notesAtPosition[0].type];

        // Inicia todos os osciladores simultaneamente para o acorde
        oscillators.forEach((osc, i) => {
          osc.start();

          // Cria envelope
          gainNodes[i].gain.setValueAtTime(0, audioContext.currentTime);
          gainNodes[i].gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
          gainNodes[i].gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
        });

        // Espera pela duração da nota
        await new Promise(resolve => setTimeout(resolve, duration * 1000));

        // Para todos os osciladores
        oscillators.forEach(osc => osc.stop());
      }

      // Adiciona um pequeno atraso para capturar o final da última nota
      setTimeout(() => {
        recorder.stop();
      }, 500);
    }

    // Inicia a reprodução para gravação
    playForRecording();

    // Mostra feedback ao usuário
    alert('Gravando a composição... O download começará automaticamente quando terminar.');
  }

  // Set up event listeners
  function setupEventListeners() {
    // Canvas click
    canvas.addEventListener('click', handleCanvasClick);

    // Clear button
    clearButton.addEventListener('click', () => {
      notes = [];
      drawStaff();
    });

    // Play/Stop button
    playButton.addEventListener('click', () => {
      if (isPlaying) {
        stopPlayback();
      } else {
        playComposition();
      }
    });

    // Download image button
    downloadImageButton.addEventListener('click', downloadImage);

    // Download MP3 button
    downloadMP3Button.addEventListener('click', downloadMP3);

    // Duration buttons
    durationButtons.forEach(button => {
      button.addEventListener('click', () => {
        durationButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedDuration = button.id;
      });
    });

    // Voice buttons
    voiceButtons.forEach(button => {
      button.addEventListener('click', () => {
        voiceButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedVoice = button.id === 'first-voice' ? 'first' : 'second';
      });
    });

    // Window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  }

  // Initialize the editor
  function init() {
    resizeCanvas();
    setupEventListeners();
    initAudioContext();
  }

  // Start the editor
  init();
});
