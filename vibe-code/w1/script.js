// Mapping from digits to MIDI note numbers
const notesMapping = {
  0: 36,  // C2
  1: 48,  // C3
  2: 60,  // C4
  3: 67,  // G4
  4: 65,  // F4
  5: 64,  // E4
  6: 67,  // G4
  7: 70,  // Bb4
  8: 72,  // C5
  9: 74   // D5
};

// Fibonacci sequence numbers
const numbersList = [
  1, 2, 4, 6, 9, 15, 25, 40, 64, 104, 169, 273, 441, 714, 1156, 1870, 3025, 4895,
  7921, 12816, 20736, 33552, 54289, 87841, 142129, 229970, 372100, 602070, 974169,
  1576239, 2550409, 4126648, 6677056, 10803704, 17480761, 28284465, 45765225, 74049690,
  119814916, 193864606, 313679521, 507544127, 821223649, 1328767776, 2149991424,
  3478759200, 5628750625, 9107509825, 14736260449, 23843770274, 38580030724, 62423800998,
  101003831721, 163427632719, 264431464441, 427859097160, 692290561600, 1120149658760,
  1812440220361, 2932589879121, 4745030099481, 7677619978602, 12422650078084,
  20100270056686, 32522920134769, 52623190191455, 85146110326225, 137769300517680,
  222915410843904, 360684711361584, 583600122205489
];

// Simple MIDI file generator
function generateMIDIFile(tempo, notes) {
  // MIDI file structure
  const header = createMIDIHeader();
  const track = createMIDITrack(tempo, notes);
  
  // Combine header and track
  const midiData = new Uint8Array(header.length + track.length);
  midiData.set(header);
  midiData.set(track, header.length);
  
  return midiData;
}

function createMIDIHeader() {
  const header = new Uint8Array(14);
  // MThd signature
  header[0] = 0x4d; header[1] = 0x54; header[2] = 0x68; header[3] = 0x64;
  // Header length (6)
  header[4] = 0; header[5] = 0; header[6] = 0; header[7] = 6;
  // Format type (0)
  header[8] = 0; header[9] = 0;
  // Number of tracks (1)
  header[10] = 0; header[11] = 1;
  // Division (480 ticks per quarter note)
  header[12] = 0x01; header[13] = 0xe0;
  
  return header;
}

function encodeVariableLength(value) {
  const result = [];
  let buffer = value & 0x7f;
  value >>= 7;
  while (value > 0) {
    buffer <<= 8;
    buffer |= ((value & 0x7f) | 0x80);
    result.unshift(buffer & 0xff);
    value >>= 7;
  }
  result.push(buffer);
  return result;
}

function createMIDITrack(tempo, notes) {
  let trackData = [];
  
  // MTrk signature
  trackData.push(0x4d, 0x54, 0x72, 0x6b);
  
  // Placeholder for track length (will update later)
  const trackLengthIndex = trackData.length;
  trackData.push(0, 0, 0, 0);
  
  // Set Tempo meta event (at time 0)
  trackData.push(0); // Delta time = 0
  trackData.push(0xff, 0x51, 0x03); // Meta event, Set Tempo, length 3
  const tempoValue = Math.round(60000000 / tempo);
  trackData.push((tempoValue >> 16) & 0xff, (tempoValue >> 8) & 0xff, tempoValue & 0xff);
  
  // Add notes
  notes.forEach((pitch, index) => {
    // Note On event
    trackData.push(0); // Delta time = 0
    trackData.push(0x90); // Note On, channel 0
    trackData.push(pitch & 0x7f); // Pitch
    trackData.push(100); // Velocity
    
    // Note Off event (480 ticks = 1 quarter note, variable length encoding)
    const deltaTime = encodeVariableLength(480);
    trackData.push(...deltaTime);
    trackData.push(0x80); // Note Off, channel 0
    trackData.push(pitch & 0x7f); // Pitch
    trackData.push(64); // Velocity
  });
  
  // End of Track meta event
  trackData.push(0, 0xff, 0x2f, 0);
  
  // Update track length
  const trackLength = trackData.length - 8; // Exclude header and length field
  trackData[trackLengthIndex] = (trackLength >> 24) & 0xff;
  trackData[trackLengthIndex + 1] = (trackLength >> 16) & 0xff;
  trackData[trackLengthIndex + 2] = (trackLength >> 8) & 0xff;
  trackData[trackLengthIndex + 3] = trackLength & 0xff;
  
  return new Uint8Array(trackData);
}

function generateAndDownload() {
  const statusDiv = document.getElementById('status');
  
  try {
    statusDiv.textContent = 'Generating MIDI file...';
    statusDiv.className = 'status loading';

    const tempoInput = document.getElementById('tempo');
    const tempo = parseInt(tempoInput.value) || 120;

    // Collect all note pitches
    const notes = [];
    numbersList.forEach(number => {
      const digits = String(number).split('');
      digits.forEach(digit => {
        const digitNum = parseInt(digit);
        notes.push(notesMapping[digitNum]);
      });
    });

    // Generate MIDI file
    const midiData = generateMIDIFile(tempo, notes);
    
    // Create blob and download
    const blob = new Blob([midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fibonacci_sequence.mid';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    statusDiv.textContent = `✓ MIDI file generated and downloaded! (Tempo: ${tempo} BPM, ${numbersList.length} numbers, ${notes.length} notes)`;
    statusDiv.className = 'status success';
  } catch (error) {
    statusDiv.textContent = `✗ Error: ${error.message}`;
    statusDiv.className = 'status error';
    console.error(error);
  }
}

// Allow Enter key to generate
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('tempo').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      generateAndDownload();
    }
  });
});
