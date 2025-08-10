// src/components/SoundVisualizer.jsx
import React, { useEffect, useRef } from "react";
import useAudioStore from "../stores/useAudioStore";
import "../styles/AudioWave.css"; // reuse your existing stylesheet if you like

const SoundVisualizer = ({ stream, audioUrl, onEnded, className = "" }) => {
  const analyserFromStore = useAudioStore((state) => state.analyserNode);
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaNodeCleanupRef = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // --- size & DPR handling ---
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      const parent = canvas.parentElement;
      const w = (parent?.offsetWidth || 600);
      const h = (parent?.offsetHeight || 300);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("resize", resize);

    // --- wave params (from your AudioWave) ---
    const turbulenceFactor = 0.25;
    const numberOfWaves = 10;
    let globalTime = 0;

    const baseLine = () => (canvas.height / dpr) / 2;
    const maxAmplitude = () => (canvas.height / dpr) / 3.5;

    const createGradient = () => {
      const w = (canvas.width / dpr);
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, "rgba(255, 25, 255, 0.2)");
      gradient.addColorStop(0.5, "rgba(25, 255, 255, 0.75)");
      gradient.addColorStop(1, "rgba(255, 255, 25, 0.2)");
      return gradient;
    };
    let strokeGradient = createGradient();

    // redraw gradient on resize
    const refreshGradient = () => { strokeGradient = createGradient(); };
    window.addEventListener("resize", refreshGradient);

    const drawWave = (dataArray) => {
      const w = (canvas.width / dpr);
      const h = (canvas.height / dpr);

      ctx.clearRect(0, 0, w, h);
      globalTime += 0.05;

      const mid = dataArray.length / 2;
      const sliceWidth = w / dataArray.length;

      for (let j = 0; j < numberOfWaves; j++) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeGradient;

        let x = 0;
        let lastX = 0;
        let lastY = baseLine();

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;

          // center-weighted damping for symmetry around the center
          const distanceFromMid = Math.abs(i - mid) / mid;
          const dampFactor = 1 - Math.pow((2 * i) / dataArray.length - 1, 2);

          const amplitude = maxAmplitude() * dampFactor * (1 - distanceFromMid);

          const isWaveInverted = j % 2 ? 1 : -1;
          const frequency = isWaveInverted * (0.05 + turbulenceFactor);

          const y = baseLine() + Math.sin(i * frequency + globalTime + j) * amplitude * v;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            // smooth curve
            const xc = (x + lastX) / 2;
            const yc = (y + lastY) / 2;
            ctx.quadraticCurveTo(lastX, lastY, xc, yc);
          }

          lastX = x;
          lastY = y;
          x += sliceWidth;
        }

        ctx.lineTo(w, lastY);
        ctx.stroke();
      }
    };

    const animate = () => {
      const analyser = analyserRef.current;
      if (!analyser) return;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      drawWave(dataArray);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // --- audio graph setup priority: store analyser -> stream -> audioUrl ---
    const setupFromAnalyser = (analyser) => {
      analyserRef.current = analyser;
      animate();
    };

    const setupFromStream = (mediaStream) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      // cleanup for this path
      mediaNodeCleanupRef.current = () => {
        try { source.disconnect(); } catch {}
      };

      animate();
    };

    const setupFromAudio = (url) => {
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      // Autoplay may be blocked; caller should handle user gesture if needed.
      audio.play().catch(() => { /* ignore */ });

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      mediaNodeCleanupRef.current = () => {
        try { source.disconnect(); } catch {}
        try { analyser.disconnect(); } catch {}
        try { audio.pause(); } catch {}
      };

      animate();

      const onAudioEnd = () => {
        onEnded?.();
      };
      audio.addEventListener("ended", onAudioEnd);

      return () => {
        audio.removeEventListener("ended", onAudioEnd);
      };
    };

    // choose setup path
    let teardownAudioListener = null;
    if (analyserFromStore) {
      setupFromAnalyser(analyserFromStore);
    } else if (stream) {
      setupFromStream(stream);
    } else if (audioUrl) {
      teardownAudioListener = setupFromAudio(audioUrl);
    } else {
      // nothing to visualize yet
    }

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);

      mediaNodeCleanupRef.current?.();

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }

      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", refreshGradient);
      if (teardownAudioListener) teardownAudioListener();
    };
  }, [analyserFromStore, stream, audioUrl, onEnded]);

  return (
    <div className={`sound-visualizer-container ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SoundVisualizer;
