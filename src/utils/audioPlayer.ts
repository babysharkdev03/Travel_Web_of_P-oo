// High-fidelity procedural acoustic piano engine for cozy travel journaling
// Synthesizes warm grand piano acoustics with realistic hammer transient, harmonic overtones & relaxing chord progressions

export interface PianoTrack {
  id: string;
  titleVI: string;
  titleJA: string;
  mood: string;
  descriptionVI: string;
  chords: number[][];
  melodyNotes: number[];
  intervalMs: number;
}

// Note frequencies (Hz) for authentic piano pitches
const NOTES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

export const PIANO_PLAYLIST: PianoTrack[] = [
  {
    id: 'ghibli-summer',
    titleVI: 'Ghibli Summer Rain • Joe Hisaishi Vibe ♫',
    titleJA: '久石譲風 • あの夏の雨音ピアノ ♫',
    mood: 'Nostalgic & Peaceful',
    descriptionVI: 'Giai điệu piano hoài niệm trong vắt tựa những thước phim Ghibli',
    // Cmaj7 -> Am9 -> Fmaj7 -> G7sus4
    chords: [
      [NOTES.C3, NOTES.G3, NOTES.C4, NOTES.E4, NOTES.B4],
      [NOTES.A3, NOTES.E4, NOTES.A4, NOTES.C5, NOTES.E5],
      [NOTES.F3, NOTES.C4, NOTES.F4, NOTES.A4, NOTES.C5],
      [NOTES.G3, NOTES.D4, NOTES.G4, NOTES.C5, NOTES.D5],
    ],
    melodyNotes: [NOTES.G4, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.B4, NOTES.C5, NOTES.A4, NOTES.G4],
    intervalMs: 1900,
  },
  {
    id: 'kyoto-twilight',
    titleVI: 'Kyoto Autumn Solitude • Dạ Khúc Piano ♫',
    titleJA: '京都黄昏の静寂 • ピアノソロ ♫',
    mood: 'Temple & Falling Leaves',
    descriptionVI: 'Tiếng đàn lãng đãng giữa chiều thu lá đỏ cố đô Kyoto',
    // Dm9 -> G13 -> Cmaj9 -> Am7
    chords: [
      [NOTES.D3, NOTES.A3, NOTES.F4, NOTES.C5, NOTES.E5],
      [NOTES.G3, NOTES.F4, NOTES.B4, NOTES.E5],
      [NOTES.C3, NOTES.G3, NOTES.E4, NOTES.B4, NOTES.D5],
      [NOTES.A3, NOTES.E4, NOTES.G4, NOTES.C5],
    ],
    melodyNotes: [NOTES.E5, NOTES.D5, NOTES.C5, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.G4],
    intervalMs: 2200,
  },
  {
    id: 'hoian-midnight',
    titleVI: 'Hội An River Lanterns • Piano Mộc Thư Giãn ♫',
    titleJA: 'ホイアンの夜 • 穏やかな川辺ピアノ ♫',
    mood: 'Lanterns & Silk Water',
    descriptionVI: 'Phím đàn dịu êm bên dòng sông Hoài lấp lánh ánh hoa đăng',
    // F#m/D -> A/C# -> Bm7 -> E
    chords: [
      [NOTES.F3, NOTES.C4, NOTES.A4, NOTES.C5],
      [NOTES.A3, NOTES.E4, NOTES.A4, NOTES.C5, NOTES.E5],
      [NOTES.D3, NOTES.A3, NOTES.F4, NOTES.B4, NOTES.D5],
      [NOTES.E3, NOTES.B3, NOTES.G4, NOTES.B4, NOTES.E5],
    ],
    melodyNotes: [NOTES.A4, NOTES.B4, NOTES.C5, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.B4],
    intervalMs: 2000,
  },
  {
    id: 'tokyo-rainy-cafe',
    titleVI: 'Tokyo Rainy Cafe • Chill Piano Keys ♫',
    titleJA: '東京雨宿りカフェ • ジャズピアノ ♫',
    mood: 'Coffee & Books',
    descriptionVI: 'Tiếng piano ấm áp bên tách cà phê ngắm mưa rơi ngoài hiên quán nhỏ',
    // Eb/C -> Bb/D -> Abmaj7 -> Bb7
    chords: [
      [NOTES.C3, NOTES.G3, NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.D3, NOTES.A3, NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.F3, NOTES.C4, NOTES.A4, NOTES.C5, NOTES.E5],
      [NOTES.G3, NOTES.D4, NOTES.B4, NOTES.D5, NOTES.F5],
    ],
    melodyNotes: [NOTES.G4, NOTES.C5, NOTES.D5, NOTES.E5, NOTES.G5, NOTES.E5, NOTES.D5, NOTES.C5],
    intervalMs: 1800,
  },
];

class CozyPianoEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private sequenceTimer: any = null;
  private noiseNode: AudioNode | null = null;
  private currentTrackIndex = 0;
  private chordStep = 0;
  private masterVolume = 0.32;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setTrack(index: number) {
    this.currentTrackIndex = Math.max(0, Math.min(index, PIANO_PLAYLIST.length - 1));
    this.chordStep = 0;
    if (this.isPlaying) {
      // Smoothly restart loop with new track progression
      this.stopSequence();
      this.startSequence();
    }
  }

  public play() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;

    // Start very subtle warm room presence (analog vinyl/room warmth)
    this.startWarmAmbience();

    // Start playing piano progression
    this.startSequence();
  }

  public pause() {
    this.isPlaying = false;
    this.stopSequence();

    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop?.();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private startSequence() {
    this.stopSequence();
    const track = PIANO_PLAYLIST[this.currentTrackIndex];

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx) return;

      const chord = track.chords[this.chordStep % track.chords.length];
      this.chordStep++;

      // Arpeggiate chord notes with realistic pianist micro-timing
      chord.forEach((freq, idx) => {
        const delay = idx * 0.045 + (Math.random() * 0.015);
        const velocity = idx === 0 ? 0.75 : 0.55 - (idx * 0.04) + (Math.random() * 0.1);
        const duration = 2.8 + (Math.random() * 0.6);
        setTimeout(() => {
          if (this.isPlaying) {
            this.playAcousticPianoNote(freq, velocity, duration);
          }
        }, delay * 1000);
      });

      // Play occasional expressive melodic counterpoint
      if (Math.random() > 0.35) {
        const melodyDelay = 0.5 + Math.random() * 0.6;
        const melodyNote = track.melodyNotes[Math.floor(Math.random() * track.melodyNotes.length)];
        setTimeout(() => {
          if (this.isPlaying) {
            this.playAcousticPianoNote(melodyNote, 0.65, 2.4);
          }
        }, melodyDelay * 1000);
      }
    };

    // Play initial step immediately
    playChordStep();
    this.sequenceTimer = setInterval(playChordStep, track.intervalMs);
  }

  private stopSequence() {
    if (this.sequenceTimer) {
      clearInterval(this.sequenceTimer);
      this.sequenceTimer = null;
    }
  }

  // Realistic Acoustic Grand Piano Synthesis
  // Models fundamental string oscillation, 2nd & 3rd wooden harmonics, and felt hammer strike
  public playAcousticPianoNote(freq: number, velocity: number = 0.6, duration: number = 3.0) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const effectiveVol = velocity * this.masterVolume;

      // 1. Fundamental tone (warm triangle + slight detuned sine for chorus string depth)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      const oscDetune = this.ctx.createOscillator();
      oscDetune.type = 'sine';
      oscDetune.frequency.setValueAtTime(freq * 1.0015, now);

      // 2. Second harmonic (gives acoustic piano string clarity)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // 3. Third harmonic (subtle wooden soundboard resonance)
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, now);

      // Gain envelopes
      const gain1 = this.ctx.createGain();
      const gain2 = this.ctx.createGain();
      const gain3 = this.ctx.createGain();
      const masterNoteGain = this.ctx.createGain();

      // Authentic Piano ADSR: instant hammer strike -> initial rapid decay -> gentle acoustic sustain
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(effectiveVol * 0.75, now + 0.007);
      gain1.gain.exponentialRampToValueAtTime(effectiveVol * 0.4, now + 0.14);
      gain1.gain.exponentialRampToValueAtTime(0.00001, now + duration);

      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(effectiveVol * 0.28, now + 0.005);
      gain2.gain.exponentialRampToValueAtTime(effectiveVol * 0.08, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.00001, now + duration * 0.65);

      gain3.gain.setValueAtTime(0.0001, now);
      gain3.gain.linearRampToValueAtTime(effectiveVol * 0.12, now + 0.004);
      gain3.gain.exponentialRampToValueAtTime(0.00001, now + duration * 0.35);

      // Felt hammer impact click (subtle 15ms percussive knock)
      const hammer = this.ctx.createOscillator();
      const hammerGain = this.ctx.createGain();
      hammer.type = 'sine';
      hammer.frequency.setValueAtTime(Math.min(freq * 4, 3800), now);
      hammerGain.gain.setValueAtTime(effectiveVol * 0.18, now);
      hammerGain.gain.exponentialRampToValueAtTime(0.00001, now + 0.018);

      // Piano body low-pass filter (warms high frequencies like wooden sounding board)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 4.8, 3600), now);
      filter.Q.setValueAtTime(0.8, now);

      osc1.connect(gain1);
      oscDetune.connect(gain1);
      osc2.connect(gain2);
      osc3.connect(gain3);
      hammer.connect(hammerGain);

      gain1.connect(masterNoteGain);
      gain2.connect(masterNoteGain);
      gain3.connect(masterNoteGain);
      hammerGain.connect(masterNoteGain);

      masterNoteGain.connect(filter);
      filter.connect(this.ctx.destination);

      osc1.start(now);
      oscDetune.start(now);
      osc2.start(now);
      osc3.start(now);
      hammer.start(now);

      const stopTime = now + duration + 0.1;
      osc1.stop(stopTime);
      oscDetune.stop(stopTime);
      osc2.stop(stopTime);
      osc3.stop(stopTime);
      hammer.stop(now + 0.04);
    } catch (e) {
      // Audio fallback safe
    }
  }

  // Soft ambient warmth (rain / vinyl hum)
  private startWarmAmbience() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.015 * white) / 1.015;
        lastOut = data[i];
        data[i] *= 0.08;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.02 * this.masterVolume, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.noiseNode = noise;
    } catch (e) {}
  }
}

export const cozyAudio = new CozyPianoEngine();
