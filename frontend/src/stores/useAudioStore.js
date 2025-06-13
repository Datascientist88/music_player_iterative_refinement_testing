// src/stores/useAudioStore.js
import { create } from 'zustand';

const useAudioStore = create((set) => ({
    // The URL of the track to be played
    audioUrl: null,
    
    // The AnalyserNode from the main player's AudioContext
    analyserNode: null,

    // Action for CardSwiper to call
    playAudio: (url) => set({ audioUrl: url }),

    // Action for MusicPlayer to call once it creates the analyser
    setAnalyserNode: (node) => set({ analyserNode: node }),
}));

export default useAudioStore;