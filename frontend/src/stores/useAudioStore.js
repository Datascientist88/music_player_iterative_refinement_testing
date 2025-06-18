// src/stores/useAudioStore.js

import { create } from "zustand";

const useAudioStore = create((set, get) => ({
  // --- STATE ---
  tracks: [],
  currentTrackIndex: null,
  isPlaying: false,
  // Use a single audio element for the entire lifecycle
  audio: typeof window !== "undefined" ? new Audio() : undefined,
  audioContext: undefined,
  analyserNode: undefined,
  volume: 1,
  currentTime: 0,
  duration: 0,
  isShuffle: false,
  isLiked: [],

  // --- ACTIONS ---

  // Initializes the store with tracks
  setTracks: (tracks) => {
    const { audio } = get();
    set({
      tracks,
      isLiked: Array(tracks.length).fill(false)
    });
    // Preload the first track
    if (audio && get().currentTrackIndex === null && tracks.length > 0) {
      audio.src = tracks[0].url;
      set({ currentTrackIndex: 0 });
    }
  },

  // Initializes the Web Audio API for the visualizer
  _initVisualizer: () => {
    const { audio, audioContext } = get();
    // Proceed only if the context doesn't exist and the audio element is ready
    if (audioContext || !audio) return;

    const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    const newAnalyserNode = newAudioContext.createAnalyser();
    newAnalyserNode.fftSize = 256; // Visualizer detail

    const source = newAudioContext.createMediaElementSource(audio);
    source.connect(newAnalyserNode);
    newAnalyserNode.connect(newAudioContext.destination);

    set({ audioContext: newAudioContext, analyserNode: newAnalyserNode });
  },

  // Plays a track by its index in the `tracks` array
  playTrack: (index) => {
    const { audio, tracks, currentTrackIndex, audioContext } = get();

    // --- FIX: Guard clause to prevent the error ---
    if (!tracks || index < 0 || index >= tracks.length) {
      return; // Exit if tracks aren't loaded or index is invalid
    }

    // Initialize the visualizer on the first play action
    if (!audioContext) {
      get()._initVisualizer();
    }

    // If a new track is selected, change the audio source
    if (index !== currentTrackIndex) {
      set({ currentTrackIndex: index, currentTime: 0 });
      audio.src = tracks[index].url;
    }
    
    // Play the audio
    audio.play().catch(e => console.error("Audio play failed:", e));
    set({ isPlaying: true });
  },

  // Toggles play/pause for the current track
  playPause: () => {
    const { audio, isPlaying, audioContext, tracks } = get();

    if (!audio.src && tracks.length > 0) {
      get().playTrack(0); // If no song is loaded, play the first one
      return;
    }
    
    if (isPlaying) {
      audio.pause();
      set({ isPlaying: false });
    } else {
      // Initialize visualizer if it's the very first play
      if (!audioContext) {
        get()._initVisualizer();
      }
      audio.play().catch(e => console.error("Audio play failed:", e));
      set({ isPlaying: true });
    }
  },

  nextTrack: () => {
    const { tracks, currentTrackIndex, isShuffle } = get();
    if (tracks.length === 0) return;
    const nextIndex = isShuffle
      ? Math.floor(Math.random() * tracks.length)
      : ((currentTrackIndex ?? -1) + 1) % tracks.length;
    get().playTrack(nextIndex);
  },

  prevTrack: () => {
    const { tracks, currentTrackIndex } = get();
    if (tracks.length === 0) return;
    const prevIndex = ((currentTrackIndex ?? 0) - 1 + tracks.length) % tracks.length;
    get().playTrack(prevIndex);
  },
  
  // Initialize event listeners for the single audio element
  _initEventListeners: () => {
    const { audio } = get();
    if (!audio) return;
    audio.addEventListener('timeupdate', () => set({ currentTime: audio.currentTime }));
    audio.addEventListener('loadedmetadata', () => set({ duration: audio.duration }));
    audio.addEventListener('ended', () => get().nextTrack());
    audio.addEventListener('play', () => set({ isPlaying: true }));
    audio.addEventListener('pause', () => set({ isPlaying: false }));
  },
  
  // Other actions remain the same...
  setVolume: (volume) => { /* ... */ },
  seek: (time) => { /* ... */ },
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleLike: (index) => { /* ... */ },
}));

// Initialize listeners right after store creation
if (typeof window !== "undefined") {
  useAudioStore.getState()._initEventListeners();
}

export default useAudioStore;