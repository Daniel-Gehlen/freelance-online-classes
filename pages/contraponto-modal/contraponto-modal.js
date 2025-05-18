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
  let selectedNoteId = null; // Track currently selected note
  let cursorPosition = { x: 100, y: canvas.height / 2 }; // Default cursor position
  let currentNoteValue = 'C4'; // Default note value for keyboard input

  // Constants
  const LINE_SPACING = 10;

  // Complete note mapping including enharmonic equivalents
  const ALL_NOTES = [
    // Octave 2
    'C2', 'C#2', 'Db2', 'D2', 'D#2', 'Eb2', 'E2', 'F2', 'F#2', 'Gb2', 'G2', 'G#2', 'Ab2', 'A2', 'A#2', 'Bb2', 'B2',
    // Octave 3
    'C3', 'C#3', 'Db3', 'D3', 'D#3', 'Eb3', 'E3', 'F3', 'F#3', 'Gb3', 'G3', 'G#3', 'Ab3', 'A3', 'A#3', 'Bb3', 'B3',
    // Octave 4
    'C4', 'C#4', 'Db4', 'D4', 'D#4', 'Eb4', 'E4', 'F4', 'F#4', 'Gb4', 'G4', 'G#4', 'Ab4', 'A4', 'A#4', 'Bb4', 'B4',
    // Octave 5
    'C5', 'C#5', 'Db5', 'D5', 'D#5', 'Eb5', 'E5', 'F5', 'F#5', 'Gb5', 'G5', 'G#5', 'Ab5', 'A5', 'A#5', 'Bb5', 'B5',
    // Octave 6
    'C6', 'C#6', 'Db6', 'D6', 'D#6', 'Eb6', 'E6', 'F6', 'F#6', 'Gb6', 'G6', 'G#6', 'Ab6', 'A6', 'A#6', 'Bb6', 'B6',
    // Octave 7
    'C7'
  ];

  // Chromatic scale with sharps (for moving up)
  const CHROMATIC_SCALE_SHARPS = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ];

  // Chromatic scale with flats (for moving down)
  const CHROMATIC_SCALE_FLATS = [
    'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
  ];

  // Enharmonic equivalents mapping
  const ENHARMONIC_EQUIVALENTS = {
    'C#2': 'Db2', 'Db2': 'C#2', 'D#2': 'Eb2', 'Eb2': 'D#2', 'F#2': 'Gb2', 'Gb2': 'F#2',
    'G#2': 'Ab2', 'Ab2': 'G#2', 'A#2': 'Bb2', 'Bb2': 'A#2',
    'C#3': 'Db3', 'Db3': 'C#3', 'D#3': 'Eb3', 'Eb3': 'D#3', 'F#3': 'Gb3', 'Gb3': 'F#3',
    'G#3': 'Ab3', 'Ab3': 'G#3', 'A#3': 'Bb3', 'Bb3': 'A#3',
    'C#4': 'Db4', 'Db4': 'C#4', 'D#4': 'Eb4', 'Eb4': 'D#4', 'F#4': 'Gb4', 'Gb4': 'F#4',
    'G#4': 'Ab4', 'Ab4': 'G#4', 'A#4': 'Bb4', 'Bb4': 'A#4',
    'C#5': 'Db5', 'Db5': 'C#5', 'D#5': 'Eb5', 'Eb5': 'D#5', 'F#5': 'Gb5', 'Gb5': 'F#5',
    'G#5': 'Ab5', 'Ab5': 'G#5', 'A#5': 'Bb5', 'Bb5': 'A#5',
    'C#6': 'Db6', 'Db6': 'C#6', 'D#6': 'Eb6', 'Eb6': 'D#6', 'F#6': 'Gb6', 'Gb6': 'F#6',
    'G#6': 'Ab6', 'Ab6': 'G#6', 'A#6': 'Bb6', 'Bb6': 'A#6'
  };

  // Note frequencies (including both sharp and flat versions)
  const NOTE_FREQUENCIES = {
    'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78,
    'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83,
    'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47,

    'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56,
    'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65,
    'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,

    'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
    'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
    'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,

    'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25,
    'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61,
    'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,

    'C6': 1046.50, 'C#6': 1108.73, 'Db6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'Eb6': 1244.51,
    'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22,
    'Ab6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'Bb6': 1864.66, 'B6': 1975.53,

    'C7': 2093.00
  };

  // Diatonic notes (without accidentals) for staff positioning
  const DIATONIC_NOTES = [
    'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2',
    'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
    'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
    'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
    'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6',
    'C7'
  ];

  // Staff note mapping - defines which notes correspond to each line/space
  // In treble clef:
  // - Lines from bottom to top: E4, G4, B4, D5, F5
  // - Spaces from bottom to top: F4, A4, C5, E5
  const STAFF_NOTES = [
    'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'
  ];

  const NOTE_DURATIONS = {
    'whole': 2.0,
    'half': 1.0,
    'quarter': 0.5,
    'eighth': 0.25,
    'sixteenth': 0.125
  };

  // Spacing multipliers for different note durations
  const SPACING_MULTIPLIERS = {
    'whole': 4.0,
    'half': 2.0,
    'quarter': 1.0,
    'eighth': 0.5,
    'sixteenth': 0.25
  };

  // Base spacing between notes (for quarter notes)
  const BASE_NOTE_SPACING = 30;

  // Keyboard to note mapping (QWERTY keyboard layout)
  const KEY_TO_NOTE = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
    'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
    'u': 'A#4', 'j': 'B4', 'k': 'C5', 'o': 'C#5', 'l': 'D5',
    'p': 'D#5', ';': 'E5', "'": 'F5',
    'z': 'C3', 'x': 'D3', 'c': 'E3', 'v': 'F3', 'b': 'G3', 'n': 'A3', 'm': 'B3',
    ',': 'C#3', '.': 'D#3', '/': 'F#3', '[': 'F#5', ']': 'G5', '\\': 'G#5'
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
    cursorPosition.y = canvas.height / 2; // Reset cursor Y position on resize
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

    // Draw preview note at cursor position
    if (!selectedNoteId) {
      drawPreviewNote();
    }
  }

  // Draw ledger lines for a given position
  function drawLedgerLines(x, y, color) {
    const startY = canvas.height / 2 - LINE_SPACING * 2;
    const staffTop = startY;
    const staffBottom = startY + 4 * LINE_SPACING;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Ledger lines above the staff
    if (y < staffTop) {
      let ledgerY = staffTop - LINE_SPACING;
      while (ledgerY >= y - LINE_SPACING / 2) {
        if (Math.abs((ledgerY - staffTop) % (LINE_SPACING)) < 0.1) {
          ctx.moveTo(x - 12, ledgerY);
          ctx.lineTo(x + 12, ledgerY);
        }
        ledgerY -= LINE_SPACING;
      }
    }

    // Ledger lines below the staff
    if (y > staffBottom) {
      let ledgerY = staffBottom + LINE_SPACING;
      while (ledgerY <= y + LINE_SPACING / 2) {
        if (Math.abs((ledgerY - staffBottom) % (LINE_SPACING)) < 0.1) {
          ctx.moveTo(x - 12, ledgerY);
          ctx.lineTo(x + 12, ledgerY);
        }
        ledgerY += LINE_SPACING;
      }
    }

    ctx.stroke();
  }

  // Draw accidental symbol next to a note
  function drawAccidental(x, y, noteValue, color) {
    ctx.font = '16px serif';
    ctx.fillStyle = color;

    // Check if note has an accidental
    if (noteValue.includes('#')) {
      // Draw sharp symbol
      ctx.fillText('♯', x - 15, y + 5);
    } else if (noteValue.includes('b')) {
      // Draw flat symbol
      ctx.fillText('♭', x - 15, y + 5);
    }
  }

  // Draw a preview note at cursor position
  function drawPreviewNote() {
    const yPos = noteValueToYPosition(currentNoteValue);

    // Draw ledger lines first (behind the note)
    const startY = canvas.height / 2 - LINE_SPACING * 2;
    const staffTop = startY;
    const staffBottom = startY + 4 * LINE_SPACING;

    if (yPos < staffTop || yPos > staffBottom) {
      drawLedgerLines(cursorPosition.x, yPos, selectedVoice === 'first' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 102, 204, 0.5)');
    }

    // Draw a semi-transparent note
    ctx.globalAlpha = 0.5;

    // Draw accidental if needed
    if (currentNoteValue.includes('#') || currentNoteValue.includes('b')) {
      drawAccidental(cursorPosition.x, yPos, currentNoteValue, selectedVoice === 'first' ? '#000' : '#0066cc');
    }

    // Draw note head
    ctx.beginPath();
    if (selectedDuration === 'quarter' || selectedDuration === 'eighth' || selectedDuration === 'sixteenth') {
      ctx.fillStyle = selectedVoice === 'first' ? '#000' : '#0066cc';
    } else {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = selectedVoice === 'first' ? '#000' : '#0066cc';
    }

    ctx.ellipse(cursorPosition.x, yPos, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    if (selectedDuration === 'whole' || selectedDuration === 'half') {
      ctx.stroke();
    }

    // Draw stem for notes that have them
    if (selectedDuration !== 'whole') {
      ctx.beginPath();
      ctx.strokeStyle = selectedVoice === 'first' ? '#000' : '#0066cc';
      ctx.moveTo(cursorPosition.x + 6, yPos);
      ctx.lineTo(cursorPosition.x + 6, yPos - 30);
      ctx.stroke();
    }

    // Draw flags for eighth and sixteenth notes
    if (selectedDuration === 'eighth' || selectedDuration === 'sixteenth') {
      ctx.beginPath();
      ctx.strokeStyle = selectedVoice === 'first' ? '#000' : '#0066cc';
      ctx.moveTo(cursorPosition.x + 6, yPos - 30);
      ctx.quadraticCurveTo(cursorPosition.x + 20, yPos - 25, cursorPosition.x + 15, yPos - 15);
      ctx.stroke();

      if (selectedDuration === 'sixteenth') {
        ctx.beginPath();
        ctx.moveTo(cursorPosition.x + 6, yPos - 22);
        ctx.quadraticCurveTo(cursorPosition.x + 20, yPos - 17, cursorPosition.x + 15, yPos - 7);
        ctx.stroke();
      }
    }

    // Draw note name
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#FF0000';
    ctx.fillText(currentNoteValue, cursorPosition.x - 10, yPos - 35);

    // Reset alpha
    ctx.globalAlpha = 1.0;
  }

  // Draw a single note
  function drawNote(note) {
    const { position, type, voice, id } = note;
    const { x, y } = position;

    // Use different colors for different voices and selection
    const voiceColor = voice === 'first' ? (id === selectedNoteId ? '#FF0000' : '#000') :
      (id === selectedNoteId ? '#FF0000' : '#0066cc');

    // Staff parameters
    const startY = canvas.height / 2 - LINE_SPACING * 2;
    const staffTop = startY;
    const staffBottom = startY + 4 * LINE_SPACING;

    // Draw ledger lines if needed
    if (y < staffTop || y > staffBottom) {
      drawLedgerLines(x, y, voiceColor);
    }

    // Draw accidental if needed
    if (note.value.includes('#') || note.value.includes('b')) {
      drawAccidental(x, y, note.value, voiceColor);
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

    // Draw note name for selected note
    if (id === selectedNoteId) {
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#FF0000';
      ctx.fillText(note.value, x - 10, y - 35);
    }
  }

  // Handle canvas click to select notes or position cursor
  function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on an existing note
    const clickedNote = findNoteAtPosition(x, y);

    if (clickedNote) {
      selectedNoteId = clickedNote.id;
      // Play the note when selected
      playSingleNote(clickedNote.value);
    } else {
      selectedNoteId = null;
      // Move cursor to clicked position
      if (x > 50 && x < canvas.width - 20) {
        cursorPosition.x = x;

        // Update current note value based on Y position
        const startY = canvas.height / 2 - LINE_SPACING * 2;
        const relativeY = y - startY;
        const lineIndex = Math.round(relativeY / (LINE_SPACING / 2));
        const snappedY = startY + lineIndex * (LINE_SPACING / 2);
        currentNoteValue = yPositionToNoteValue(snappedY);
      }
    }

    drawStaff();
  }

  // Find note at position (for selection)
  function findNoteAtPosition(x, y) {
    for (const note of notes) {
      const noteX = note.position.x;
      const noteY = note.position.y;

      // Check if click is within note bounds
      if (Math.abs(x - noteX) < 15 && Math.abs(y - noteY) < 15) {
        return note;
      }
    }
    return null;
  }

  // Play a single note (for preview)
  function playSingleNote(noteValue) {
    initAudioContext();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = NOTE_FREQUENCIES[noteValue] || 440;

    gainNode.gain.value = 0.3;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  // Add a note at cursor position
  function addNoteAtCursor(noteValue) {
    if (noteValue) {
      currentNoteValue = noteValue;
    }

    // If a note is selected, update it instead of adding a new one
    if (selectedNoteId) {
      const note = notes.find(n => n.id === selectedNoteId);
      if (note) {
        note.value = currentNoteValue;
        note.position.y = noteValueToYPosition(currentNoteValue);
        note.type = selectedDuration;
        playSingleNote(currentNoteValue);
        drawStaff();
      }
      return;
    }

    // Calculate Y position based on note value
    const yPos = noteValueToYPosition(currentNoteValue);

    // Check if there's already a note at this position and voice
    const existingNote = notes.find(note =>
      Math.abs(note.position.x - cursorPosition.x) < 10 &&
      note.voice === selectedVoice
    );

    if (existingNote) {
      // Update existing note
      existingNote.value = currentNoteValue;
      existingNote.position.y = yPos;
      existingNote.type = selectedDuration;
    } else {
      // Add new note
      const newNote = {
        id: Date.now().toString(),
        type: selectedDuration,
        value: currentNoteValue,
        position: {
          x: cursorPosition.x,
          y: yPos
        },
        voice: selectedVoice,
        // Add start time property for playback timing
        startTime: 0 // Will be calculated during playback
      };

      notes.push(newNote);
    }

    // Play the note
    playSingleNote(currentNoteValue);

    // Move cursor to next position with spacing based on note duration
    const spacing = BASE_NOTE_SPACING * SPACING_MULTIPLIERS[selectedDuration];
    cursorPosition.x += spacing;

    if (cursorPosition.x > canvas.width - 50) {
      cursorPosition.x = 100;
    }

    drawStaff();
  }

  // Convert note value to Y position
  function noteValueToYPosition(noteValue) {
    const startY = canvas.height / 2 - LINE_SPACING * 2; // Top line of staff

    // Get the base note (without accidentals)
    const baseNote = noteValue.replace(/#|b/, '');

    // Find the index of the base note in our STAFF_NOTES array
    const noteIndex = STAFF_NOTES.indexOf(baseNote);

    if (noteIndex !== -1) {
      // Each note is spaced by half a line (LINE_SPACING / 2)
      return startY + (noteIndex * LINE_SPACING / 2);
    }

    // If the note is not in our standard staff mapping, calculate position based on octave and note name
    const noteName = baseNote.charAt(0);
    const octave = parseInt(baseNote.charAt(1));

    // Calculate position based on note name and octave
    // Each octave has 7 diatonic notes (C through B)
    // Each note is spaced by LINE_SPACING / 2

    // Start with a reference note (e.g., C4 which is middle C)
    const referenceNoteY = startY + (STAFF_NOTES.indexOf('C4') * LINE_SPACING / 2);

    // Calculate the number of diatonic steps from C4
    const noteOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const referenceOctave = 4;
    const referenceNoteIndex = noteOrder.indexOf('C');
    const targetNoteIndex = noteOrder.indexOf(noteName);

    if (targetNoteIndex === -1) return referenceNoteY; // Default if note name is invalid

    // Calculate steps: 7 notes per octave
    const octaveSteps = (octave - referenceOctave) * 7;
    const noteSteps = targetNoteIndex - referenceNoteIndex;
    const totalSteps = octaveSteps + noteSteps;

    // Each diatonic step is LINE_SPACING / 2 * 2 (a whole step)
    // But some steps are half steps (E-F, B-C), so we need to adjust
    // For simplicity, we'll use an average step size
    return referenceNoteY - (totalSteps * LINE_SPACING / 2);
  }

  // Convert Y position to note value
  function yPositionToNoteValue(y) {
    const startY = canvas.height / 2 - LINE_SPACING * 2; // Top line of staff

    // Calculate the index in the STAFF_NOTES array
    const noteIndex = Math.round((y - startY) / (LINE_SPACING / 2));

    // Ensure index is within bounds of our standard staff notes
    if (noteIndex >= 0 && noteIndex < STAFF_NOTES.length) {
      return STAFF_NOTES[noteIndex];
    }

    // If we're outside the standard staff range, calculate the note based on position
    // Each LINE_SPACING/2 is one diatonic step
    const stepsFromTopLine = Math.round((y - startY) / (LINE_SPACING / 2));

    // Reference note (F5 is the top line of the treble clef)
    const referenceNote = 'F';
    const referenceOctave = 5;
    const referenceIndex = 0; // Index in STAFF_NOTES

    // Calculate how many diatonic steps we are from the reference note
    const noteOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const referenceNoteOrderIndex = noteOrder.indexOf(referenceNote);

    // Calculate the new note and octave
    let totalSteps = stepsFromTopLine;
    let newOctave = referenceOctave;
    let newNoteIndex = referenceNoteOrderIndex;

    // Adjust for steps up or down
    while (totalSteps > 0) {
      newNoteIndex--;
      if (newNoteIndex < 0) {
        newNoteIndex = 6; // Wrap around to B
        newOctave--;
      }
      totalSteps--;
    }

    while (totalSteps < 0) {
      newNoteIndex++;
      if (newNoteIndex > 6) {
        newNoteIndex = 0; // Wrap around to C
        newOctave++;
      }
      totalSteps++;
    }

    // Ensure octave is within reasonable bounds (2-7)
    newOctave = Math.max(2, Math.min(7, newOctave));

    return noteOrder[newNoteIndex] + newOctave;
  }

  // Get the next note when moving up
  function getNextNoteUp(currentNote) {
    // Parse the current note
    const match = currentNote.match(/([A-G])(#|b)?(\d)/);
    if (!match) return currentNote;

    const [_, noteName, accidental, octave] = match;

    // First, convert to a standard form (using sharps for accidentals)
    let standardNote = noteName;
    if (accidental === 'b') {
      // Convert flat to its sharp equivalent
      const noteIndex = CHROMATIC_SCALE_FLATS.indexOf(noteName + accidental);
      if (noteIndex !== -1) {
        // Get the equivalent note with sharp from the sharps scale
        standardNote = CHROMATIC_SCALE_SHARPS[(noteIndex - 1 + 12) % 12];
      }
    } else {
      standardNote = noteName + (accidental || '');
    }

    // Find the index in the chromatic scale
    const noteIndex = CHROMATIC_SCALE_SHARPS.indexOf(standardNote);
    if (noteIndex === -1) return currentNote;

    // Calculate the next note up (always using sharps when moving up)
    let nextIndex = (noteIndex + 1) % 12;
    let nextOctave = parseInt(octave);

    // If we wrapped around to C, increment the octave
    if (nextIndex === 0) {
      nextOctave++;
    }

    // Ensure octave is within bounds
    nextOctave = Math.min(7, nextOctave);

    // Return the next note
    return CHROMATIC_SCALE_SHARPS[nextIndex] + nextOctave;
  }

  // Get the next note when moving down
  function getNextNoteDown(currentNote) {
    // Parse the current note
    const match = currentNote.match(/([A-G])(#|b)?(\d)/);
    if (!match) return currentNote;

    const [_, noteName, accidental, octave] = match;

    // First, convert to a standard form (using flats for accidentals when moving down)
    let standardNote = noteName;
    if (accidental === '#') {
      // Convert sharp to its flat equivalent
      const noteIndex = CHROMATIC_SCALE_SHARPS.indexOf(noteName + accidental);
      if (noteIndex !== -1) {
        // Get the equivalent note with flat from the flats scale
        standardNote = CHROMATIC_SCALE_FLATS[(noteIndex + 1) % 12];
      }
    } else {
      standardNote = noteName + (accidental || '');
    }

    // Find the index in the chromatic scale
    const noteIndex = CHROMATIC_SCALE_FLATS.indexOf(standardNote);
    if (noteIndex === -1) return currentNote;

    // Calculate the next note down (always using flats when moving down)
    let nextIndex = (noteIndex - 1 + 12) % 12;
    let nextOctave = parseInt(octave);

    // If we wrapped around from C to B, decrement the octave
    if (noteIndex === 0 && nextIndex === 11) {
      nextOctave--;
    }

    // Ensure octave is within bounds
    nextOctave = Math.max(2, nextOctave);

    // Return the next note
    return CHROMATIC_SCALE_FLATS[nextIndex] + nextOctave;
  }

  // Move selected note up or down
  function moveSelectedNote(direction, octave = false) {
    // Get the note to move (either selected note or cursor note)
    let noteToMove = null;
    let isSelectedNote = false;

    if (selectedNoteId) {
      // Move selected note
      noteToMove = notes.find(n => n.id === selectedNoteId);
      isSelectedNote = true;
      if (!noteToMove) return;
    }

    if (octave) {
      // Move by octave (12 half steps)
      const octaveChange = direction === 'up' ? 1 : -1;

      if (isSelectedNote) {
        const currentOctave = parseInt(noteToMove.value.match(/\d/)[0]);
        const newOctave = Math.max(2, Math.min(7, currentOctave + octaveChange));

        if (newOctave !== currentOctave) {
          const noteName = noteToMove.value.replace(/\d/, '');
          noteToMove.value = noteName + newOctave;
          noteToMove.position.y = noteValueToYPosition(noteToMove.value);
          playSingleNote(noteToMove.value);
        }
      } else {
        const currentOctave = parseInt(currentNoteValue.match(/\d/)[0]);
        const newOctave = Math.max(2, Math.min(7, currentOctave + octaveChange));

        if (newOctave !== currentOctave) {
          const noteName = currentNoteValue.replace(/\d/, '');
          currentNoteValue = noteName + newOctave;
          playSingleNote(currentNoteValue);
        }
      }
    } else {
      // Move by single step with proper accidental handling
      if (isSelectedNote) {
        if (direction === 'up') {
          noteToMove.value = getNextNoteUp(noteToMove.value);
        } else {
          noteToMove.value = getNextNoteDown(noteToMove.value);
        }

        // Update position
        noteToMove.position.y = noteValueToYPosition(noteToMove.value);

        // Play the note
        playSingleNote(noteToMove.value);
      } else {
        // Move cursor note
        if (direction === 'up') {
          currentNoteValue = getNextNoteUp(currentNoteValue);
        } else {
          currentNoteValue = getNextNoteDown(currentNoteValue);
        }

        // Play the note
        playSingleNote(currentNoteValue);
      }
    }

    drawStaff();
  }

  // Handle keyboard input
  function handleKeyDown(e) {
    // Prevent default for keys we're using
    const relevantKeys = [
      'a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h',
      'u', 'j', 'k', 'o', 'l', 'p', ';', "'",
      'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '[', ']', '\\',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Delete', 'Backspace', ' ', 'Enter'
    ];

    if (relevantKeys.includes(e.key)) {
      e.preventDefault();
    }

    // Note input when a key is pressed
    if (KEY_TO_NOTE[e.key.toLowerCase()]) {
      currentNoteValue = KEY_TO_NOTE[e.key.toLowerCase()];
      playSingleNote(currentNoteValue);
      drawStaff();
      return;
    }

    // Enter key to add note
    if (e.key === 'Enter') {
      addNoteAtCursor();
      return;
    }

    // Note movement with arrow keys
    if (e.key === 'ArrowUp') {
      moveSelectedNote('up', e.ctrlKey);
      return;
    }

    if (e.key === 'ArrowDown') {
      moveSelectedNote('down', e.ctrlKey);
      return;
    }

    if (e.key === 'ArrowLeft') {
      if (selectedNoteId) {
        // When a note is selected, deselect it and move cursor to its position
        const note = notes.find(n => n.id === selectedNoteId);
        if (note) {
          cursorPosition.x = Math.max(50, note.position.x - 30);
          currentNoteValue = note.value;
          selectedNoteId = null;
        }
      } else {
        // Move cursor left
        cursorPosition.x = Math.max(50, cursorPosition.x - 30);
      }
      drawStaff();
      return;
    }

    if (e.key === 'ArrowRight') {
      if (selectedNoteId) {
        // When a note is selected, deselect it and move cursor to its position
        const note = notes.find(n => n.id === selectedNoteId);
        if (note) {
          cursorPosition.x = Math.min(canvas.width - 50, note.position.x + 30);
          currentNoteValue = note.value;
          selectedNoteId = null;
        }
      } else {
        // Move cursor right
        cursorPosition.x = Math.min(canvas.width - 50, cursorPosition.x + 30);
      }
      drawStaff();
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Delete selected note
      if (selectedNoteId) {
        const noteIndex = notes.findIndex(note => note.id === selectedNoteId);
        if (noteIndex !== -1) {
          notes.splice(noteIndex, 1);
          selectedNoteId = null;
          drawStaff();
        }
      }
      return;
    }

    if (e.key === ' ') {
      // Play composition or stop
      if (isPlaying) {
        stopPlayback();
      } else {
        playComposition();
      }
    }
  }

  // Calculate timing information for all notes
  function calculateNoteTiming() {
    // Sort notes by voice and X position
    const voiceNotes = {
      first: [...notes.filter(n => n.voice === 'first')].sort((a, b) => a.position.x - b.position.x),
      second: [...notes.filter(n => n.voice === 'second')].sort((a, b) => a.position.x - b.position.x)
    };

    // Calculate start times for each voice independently
    ['first', 'second'].forEach(voice => {
      let currentTime = 0;

      voiceNotes[voice].forEach(note => {
        note.startTime = currentTime;
        note.endTime = currentTime + NOTE_DURATIONS[note.type];
        currentTime += NOTE_DURATIONS[note.type];
      });
    });

    // Return all notes sorted by start time
    return [...voiceNotes.first, ...voiceNotes.second].sort((a, b) => a.startTime - b.startTime);
  }

  // Play the composition with proper timing
  async function playComposition() {
    if (isPlaying || notes.length === 0) return;

    initAudioContext();
    isPlaying = true;
    playButton.textContent = 'Parar';
    drawStaff();

    // Calculate timing for all notes
    const timedNotes = calculateNoteTiming();

    // Create a map to track active oscillators by note ID
    const activeOscillators = new Map();
    const activeGainNodes = new Map();

    // Track the current playback time
    let playbackTime = 0;
    const startTime = audioContext.currentTime;

    // Process notes in order of start time
    for (let i = 0; i < timedNotes.length; i++) {
      if (!isPlaying) break; // Stop if user clicked stop

      const currentNote = timedNotes[i];

      // Wait until it's time to play this note
      if (currentNote.startTime > playbackTime) {
        const waitTime = (currentNote.startTime - playbackTime) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        playbackTime = currentNote.startTime;
      }

      // Create oscillator for this note
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = NOTE_FREQUENCIES[currentNote.value] || 440;

      // Adjust volume based on how many notes are active
      const activeNotes = getActiveNotesAt(timedNotes, currentNote.startTime);
      gainNode.gain.value = 0.3 / Math.sqrt(activeNotes.length);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Store the oscillator and gain node
      activeOscillators.set(currentNote.id, oscillator);
      activeGainNodes.set(currentNote.id, gainNode);

      // Start the oscillator
      oscillator.start();

      // Create envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, audioContext.currentTime + 0.01);

      // Schedule the note to stop at its end time
      const noteDuration = NOTE_DURATIONS[currentNote.type];
      const stopTime = audioContext.currentTime + noteDuration;

      gainNode.gain.linearRampToValueAtTime(0, stopTime - 0.05);
      oscillator.stop(stopTime);

      // Schedule cleanup of this oscillator
      setTimeout(() => {
        activeOscillators.delete(currentNote.id);
        activeGainNodes.delete(currentNote.id);
      }, noteDuration * 1000);

      // Look ahead to see if there are notes starting at the same time
      let nextIndex = i + 1;
      if (nextIndex < timedNotes.length && timedNotes[nextIndex].startTime === currentNote.startTime) {
        // If the next note starts at the same time, don't wait, process it immediately
        continue;
      }

      // Find the next note's start time
      const nextStartTime = nextIndex < timedNotes.length ? timedNotes[nextIndex].startTime : Infinity;

      // Wait until the next note's start time or until this note ends, whichever comes first
      const timeToNextEvent = Math.min(
        nextStartTime - currentNote.startTime,
        noteDuration
      );

      if (timeToNextEvent < Infinity) {
        await new Promise(resolve => setTimeout(resolve, timeToNextEvent * 1000));
        playbackTime += timeToNextEvent;
      }
    }

    // Wait for the last note to finish
    if (timedNotes.length > 0) {
      const lastNote = timedNotes[timedNotes.length - 1];
      const lastNoteDuration = NOTE_DURATIONS[lastNote.type];
      await new Promise(resolve => setTimeout(resolve, lastNoteDuration * 1000));
    }

    // Reset playback state
    isPlaying = false;
    playButton.textContent = 'Tocar';
    drawStaff();
  }

  // Get all notes that are active at a specific time
  function getActiveNotesAt(timedNotes, time) {
    return timedNotes.filter(note =>
      note.startTime <= time && note.startTime + NOTE_DURATIONS[note.type] > time
    );
  }

  // Stop playback
  function stopPlayback() {
    isPlaying = false;
    playButton.textContent = 'Tocar';

    // Stop all audio
    if (audioContext) {
      audioContext.close();
      audioContext = null;
      initAudioContext();
    }

    drawStaff();
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

    // Draw staff and notes (without cursor)
    // First draw the staff lines
    const startY = canvas.height / 2 - LINE_SPACING * 2;
    tempCtx.strokeStyle = '#000';
    tempCtx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {
      const y = startY + i * LINE_SPACING;
      tempCtx.beginPath();
      tempCtx.moveTo(50, y);
      tempCtx.lineTo(canvas.width - 20, y);
      tempCtx.stroke();
    }

    // Draw treble clef
    tempCtx.font = '60px serif';
    tempCtx.fillText('𝄞', 10, startY + 35);

    // Draw notes
    notes.forEach(note => {
      const { position, type, voice } = note;
      const { x, y } = position;
      const voiceColor = voice === 'first' ? '#000' : '#0066cc';

      // Staff parameters
      const staffTop = startY;
      const staffBottom = startY + 4 * LINE_SPACING;

      // Draw ledger lines if needed
      if (y < staffTop || y > staffBottom) {
        tempCtx.beginPath();
        tempCtx.strokeStyle = voiceColor;
        tempCtx.lineWidth = 1;

        // Ledger lines above the staff
        if (y < staffTop) {
          let ledgerY = staffTop - LINE_SPACING;
          while (ledgerY >= y - LINE_SPACING / 2) {
            if (Math.abs((ledgerY - staffTop) % (LINE_SPACING)) < 0.1) {
              tempCtx.moveTo(x - 12, ledgerY);
              tempCtx.lineTo(x + 12, ledgerY);
            }
            ledgerY -= LINE_SPACING;
          }
        }

        // Ledger lines below the staff
        if (y > staffBottom) {
          let ledgerY = staffBottom + LINE_SPACING;
          while (ledgerY <= y + LINE_SPACING / 2) {
            if (Math.abs((ledgerY - staffBottom) % (LINE_SPACING)) < 0.1) {
              tempCtx.moveTo(x - 12, ledgerY);
              tempCtx.lineTo(x + 12, ledgerY);
            }
            ledgerY += LINE_SPACING;
          }
        }

        tempCtx.stroke();
      }

      // Draw accidental if needed
      if (note.value.includes('#') || note.value.includes('b')) {
        tempCtx.font = '16px serif';
        tempCtx.fillStyle = voiceColor;

        if (note.value.includes('#')) {
          tempCtx.fillText('♯', x - 15, y + 5);
        } else if (note.value.includes('b')) {
          tempCtx.fillText('♭', x - 15, y + 5);
        }
      }

      // Draw note head
      tempCtx.beginPath();
      if (type === 'quarter' || type === 'eighth' || type === 'sixteenth') {
        tempCtx.fillStyle = voiceColor;
      } else {
        tempCtx.fillStyle = '#fff';
        tempCtx.strokeStyle = voiceColor;
      }

      tempCtx.ellipse(x, y, 8, 6, 0, 0, Math.PI * 2);
      tempCtx.fill();
      if (type === 'whole' || type === 'half') {
        tempCtx.stroke();
      }

      // Draw stem for notes that have them
      if (type !== 'whole') {
        tempCtx.beginPath();
        tempCtx.strokeStyle = voiceColor;
        tempCtx.moveTo(x + 6, y);
        tempCtx.lineTo(x + 6, y - 30);
        tempCtx.stroke();
      }

      // Draw flags for eighth and sixteenth notes
      if (type === 'eighth' || type === 'sixteenth') {
        tempCtx.beginPath();
        tempCtx.strokeStyle = voiceColor;
        tempCtx.moveTo(x + 6, y - 30);
        tempCtx.quadraticCurveTo(x + 20, y - 25, x + 15, y - 15);
        tempCtx.stroke();

        if (type === 'sixteenth') {
          tempCtx.beginPath();
          tempCtx.moveTo(x + 6, y - 22);
          tempCtx.quadraticCurveTo(x + 20, y - 17, x + 15, y - 7);
          tempCtx.stroke();
        }
      }
    });

    // Create download link
    const link = document.createElement('a');
    link.download = 'contraponto-composicao.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  }

  // Download the composition as MP3
  function downloadMP3() {
    if (notes.length === 0) {
      alert('Adicione algumas notas antes de baixar o MP3.');
      return;
    }

    initAudioContext();

    // Create a destination node for recording
    const destination = audioContext.createMediaStreamDestination();
    const recorder = new MediaRecorder(destination.stream);
    const chunks = [];

    // Configure recorder
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      // Convert chunks to a single blob
      const blob = new Blob(chunks, { type: 'audio/wav' });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'contraponto-composicao.mp3';
      link.click();

      // Clean up resources
      URL.revokeObjectURL(url);
    };

    // Start recording
    recorder.start();

    // Calculate timing for all notes
    const timedNotes = calculateNoteTiming();

    // Function to play notes with proper timing during recording
    async function playForRecording() {
      // Create a map to track active oscillators by note ID
      const activeOscillators = new Map();
      const activeGainNodes = new Map();

      // Track the current playback time
      let playbackTime = 0;
      const startTime = audioContext.currentTime;

      // Process notes in order of start time
      for (let i = 0; i < timedNotes.length; i++) {
        const currentNote = timedNotes[i];

        // Wait until it's time to play this note
        if (currentNote.startTime > playbackTime) {
          const waitTime = (currentNote.startTime - playbackTime) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          playbackTime = currentNote.startTime;
        }

        // Create oscillator for this note
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = NOTE_FREQUENCIES[currentNote.value] || 440;

        // Adjust volume based on how many notes are active
        const activeNotes = getActiveNotesAt(timedNotes, currentNote.startTime);
        gainNode.gain.value = 0.3 / Math.sqrt(activeNotes.length);

        oscillator.connect(gainNode);
        oscillator.connect(audioContext.destination);
        oscillator.connect(destination); // Connect to recording destination

        // Store the oscillator and gain node
        activeOscillators.set(currentNote.id, oscillator);
        activeGainNodes.set(currentNote.id, gainNode);

        // Start the oscillator
        oscillator.start();

        // Create envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, audioContext.currentTime + 0.01);

        // Schedule the note to stop at its end time
        const noteDuration = NOTE_DURATIONS[currentNote.type];
        const stopTime = audioContext.currentTime + noteDuration;

        gainNode.gain.linearRampToValueAtTime(0, stopTime - 0.05);
        oscillator.stop(stopTime);

        // Schedule cleanup of this oscillator
        setTimeout(() => {
          activeOscillators.delete(currentNote.id);
          activeGainNodes.delete(currentNote.id);
        }, noteDuration * 1000);

        // Look ahead to see if there are notes starting at the same time
        let nextIndex = i + 1;
        if (nextIndex < timedNotes.length && timedNotes[nextIndex].startTime === currentNote.startTime) {
          // If the next note starts at the same time, don't wait, process it immediately
          continue;
        }

        // Find the next note's start time
        const nextStartTime = nextIndex < timedNotes.length ? timedNotes[nextIndex].startTime : Infinity;

        // Wait until the next note's start time or until this note ends, whichever comes first
        const timeToNextEvent = Math.min(
          nextStartTime - currentNote.startTime,
          noteDuration
        );

        if (timeToNextEvent < Infinity) {
          await new Promise(resolve => setTimeout(resolve, timeToNextEvent * 1000));
          playbackTime += timeToNextEvent;
        }
      }

      // Wait for the last note to finish
      if (timedNotes.length > 0) {
        const lastNote = timedNotes[timedNotes.length - 1];
        const lastNoteDuration = NOTE_DURATIONS[lastNote.type];
        await new Promise(resolve => setTimeout(resolve, lastNoteDuration * 1000));
      }

      // Add a small delay to capture the end of the last note
      setTimeout(() => {
        recorder.stop();
      }, 500);
    }

    // Start playback for recording
    playForRecording();

    // Show feedback to user
    alert('Gravando a composição... O download começará automaticamente quando terminar.');
  }

  // Display keyboard shortcuts help
  function showKeyboardHelp() {
    const helpText = `
      Atalhos de Teclado:
      - Clique no canvas para posicionar o cursor
      - Teclas A-G, Z-M: selecionar notas musicais
      - Enter: inserir a nota atual na posição do cursor
      - Setas para cima/baixo: mover nota selecionada meio tom
      - Ctrl + Setas para cima/baixo: mover nota selecionada uma oitava
      - Setas esquerda/direita: mover cursor
      - Delete/Backspace: apagar nota selecionada
      - Espaço: tocar/parar composição
    `;
    alert(helpText);
  }

  // Set up event listeners
  function setupEventListeners() {
    // Canvas click
    canvas.addEventListener('click', handleCanvasClick);

    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);

    // Clear button
    clearButton.addEventListener('click', () => {
      notes = [];
      selectedNoteId = null;
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
        drawStaff();
      });
    });

    // Voice buttons
    voiceButtons.forEach(button => {
      button.addEventListener('click', () => {
        voiceButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedVoice = button.id === 'first-voice' ? 'first' : 'second';
        drawStaff();
      });
    });

    // Add help button if it exists
    const helpButton = document.getElementById('help-button');
    if (helpButton) {
      helpButton.addEventListener('click', showKeyboardHelp);
    }

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

    // Show initial help message
    setTimeout(() => {
      alert('Bem-vindo ao Editor de Partituras!\n\nClique no canvas para posicionar o cursor e use o teclado para selecionar notas musicais.\nPressione Enter para inserir a nota na posição do cursor.\nUse as setas para cima/baixo para alterar a altura da nota.\nSegure Ctrl + setas para mover por oitavas.');
    }, 500);
  }

  // Start the editor
  init();
});
