// src/components/MusicPlayer/MusicPlayer.js
import React, { useRef, useEffect, useState } from "react";
import "./MusicPlayer.css";

const MusicPlayer = ({ trackUrl }) => {
  // Refs for DOM elements
  const audioRef = useRef(null);
  const playBtnRef = useRef(null);
  const pauseBtnRef = useRef(null);
  const svgFlowerRef = useRef(null);
  const svgFlower2Ref = useRef(null);
  const lrgPetalsRef = useRef(null);
  const pistilRef = useRef(null);
  const filamentRefs = useRef([]);
  const canvasRef = useRef(null);
  const seekbarRef = useRef(null);
  const volumeRef = useRef(null);

  // Refs for visualizer state to prevent re-initialization
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // State for playback
  const [isPlaying, setIsPlaying] = useState(false);

  // Utility to add animation classes
  const startAnimations = () => {
    svgFlowerRef.current?.classList.add("flowerSpinner");
    svgFlower2Ref.current?.classList.add("flowerSpinner");
    lrgPetalsRef.current?.classList.add("lrg-petals-animation");
    pistilRef.current?.classList.add("pistil-animation");
    filamentRefs.current.forEach((el) =>
      el?.classList.add("filament-animation")
    );
  };

  // Utility to remove animation classes
  const stopAnimations = () => {
    svgFlowerRef.current?.classList.remove("flowerSpinner");
    svgFlower2Ref.current?.classList.remove("flowerSpinner");
    lrgPetalsRef.current?.classList.remove("lrg-petals-animation");
    pistilRef.current?.classList.remove("pistil-animation");
    filamentRefs.current.forEach((el) =>
      el?.classList.remove("filament-animation")
    );
  };

  // Setup visualizer
  const setupVisualizer = () => {
    if (!audioContextRef.current && audioRef.current) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const src = context.createMediaElementSource(audioRef.current);
      const analyser = context.createAnalyser();

      src.connect(analyser);
      analyser.connect(context.destination);
      analyser.fftSize = 256;

      audioContextRef.current = context;
      analyserRef.current = analyser;

      renderFrame();
    }
  };

  // Render loop for canvas visualizer
  const renderFrame = () => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] * (canvas.height / 255);
      const hue = i * (360 / (bufferLength * 0.7));
      const radius = barHeight / 1.8;
      if (radius > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, 1)`;
        ctx.fill();
      }
    }
    animationFrameIdRef.current = requestAnimationFrame(renderFrame);
  };

  // --- EFFECT HOOKS ---

  // Effect for when a new track is selected
  useEffect(() => {
    if (trackUrl && audioRef.current) {
      audioRef.current.src = trackUrl;
      audioRef.current.load();
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setupVisualizer(); // Setup visualizer on first play
          })
          .catch((error) => {
            console.error("Audio playback failed:", error);
            setIsPlaying(false);
          });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackUrl]);

  // Effect for controlling UI and animations based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      playBtnRef.current?.classList.add("hidden");
      pauseBtnRef.current?.classList.remove("hidden");
      startAnimations();
      animationFrameIdRef.current = requestAnimationFrame(renderFrame);
    } else {
      playBtnRef.current?.classList.remove("hidden");
      pauseBtnRef.current?.classList.add("hidden");
      stopAnimations();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Effect for binding audio events
  useEffect(() => {
    const audio = audioRef.current;
    const seekbar = seekbarRef.current;

    const handleTimeUpdate = () => {
      if (audio && seekbar && !isNaN(audio.duration)) {
        const position = audio.currentTime * (100 / audio.duration);
        seekbar.value = position;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (seekbar) seekbar.value = 0;
    };

    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
    }

    // Cleanup function
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, []);

  // --- EVENT HANDLERS ---

  const togglePlayPause = () => {
    if (!trackUrl) return; // Don't do anything if no track is loaded

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    if (audioRef.current) {
      audioRef.current.volume = e.target.value / 100;
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime =
        audioRef.current.duration * (e.target.value / 100);
    }
  };

  // JSX is a direct translation of the provided HTML
  return (
    <div className="player-container">
      {/* The visualizer and player structure */}
      <div className="wrapper">
        <div className="player">
          <div className="visualizer">
            {/* SVG Flower 1 */}
            <div ref={svgFlowerRef} className="svg-flower">
              <svg viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="dLionTint">
                    <stop offset="0" stopColor="#00f" />
                    <stop offset="0.6" stopColor="#0ff0" />
                    <stop offset="0.8" stopColor="#fff" />
                    <stop offset="0.9" stopColor="#203a" />
                  </radialGradient>
                  <radialGradient id="lrgPetalsX">
                    <stop offset="0" stopColor="#969" />
                    <stop offset="0.05" stopColor="#a57" />
                    <stop offset="0.78" stopColor="#979" />
                    <stop offset="0.8" stopColor="#fe0" />
                    <stop offset="0.85" stopColor="#d102" />
                  </radialGradient>
                  <radialGradient id="lrgPetals">
                    <stop offset="0" stopColor="#969" />
                    <stop offset="0.25" stopColor="#a25" />
                    <stop offset="0.45" stopColor="#0a2" />
                    <stop offset="0.5" stopColor="#079" />
                    <stop offset="0.8" stopColor="#fe9" />
                  </radialGradient>
                  <radialGradient id="btmPetals">
                    <stop offset="0" stopColor="#5034" />
                    <stop offset="0.3" stopColor="#68f4" />
                    <stop offset="0.5" stopColor="#a794" />
                    <stop offset="0.55" stopColor="#e8a4" />
                    <stop offset="1" stopColor="#fe0d" />
                  </radialGradient>
                  <radialGradient id="radTen">
                    <stop offset="0" stopColor="#503" />
                    <stop offset="0.3" stopColor="#68f" />
                    <stop offset="0.5" stopColor="#a791" />
                    <stop offset="0.55" stopColor="#e8a1" />
                    <stop offset="0.7" stopColor="#fa45" />
                  </radialGradient>
                  <radialGradient id="midPetalsLrg" cx="50%" cy="50%">
                    <stop offset="0" stopColor="#ff8a" />
                    <stop offset="0.5" stopColor="#ee0" />
                    <stop offset="1" stopColor="#990b" />
                  </radialGradient>
                  <radialGradient id="hollowPetals0">
                    <stop offset="0" stopColor="#4b90" />
                    <stop offset="0.45" stopColor="#f0f2" />
                    <stop offset="0.75" stopColor="#fa0" />
                    <stop offset="0.84" stopColor="#6d6b" />
                    <stop offset="1" stopColor="#80eb" />
                  </radialGradient>
                  <radialGradient id="hollowPetals">
                    <stop offset="0" stopColor="#4b90" />
                    <stop offset="0.45" stopColor="#f0f1" />
                    <stop offset="0.75" stopColor="#fa0" />
                    <stop offset="0.8" stopColor="#fff" />
                    <stop offset="0.98" stopColor="#000" />
                  </radialGradient>
                  <radialGradient id="petalBg" cx="50%" cy="50%">
                    <stop offset="0" stopColor="#fff4" />
                    <stop offset="0.5" stopColor="#8ff4" />
                    <stop offset="0.9" stopColor="#bb84" />
                    <stop offset="1" stopColor="#6c94" />
                  </radialGradient>
                  <radialGradient id="petalGr" cx="50%" cy="50%">
                    <stop offset="0" stopColor="#ff08" />
                    <stop offset="0.5" stopColor="#3230" />
                    <stop offset="0.9" stopColor="#333" />
                    <stop offset="1" stopColor="#000" />
                  </radialGradient>
                  <radialGradient id="newFlowerGradCtr" cx="50%" cy="50%">
                    <stop offset="0" stopColor="#0001" />
                    <stop offset="0.5" stopColor="#29b1" />
                    <stop offset="1" stopColor="#0002" />
                  </radialGradient>
                  <radialGradient id="heart">
                    <stop offset="0" stopColor="#990a" />
                    <stop offset="0.5" stopColor="#f6a9" />
                    <stop offset=".9" stopColor="#d9ff" />
                  </radialGradient>
                  <radialGradient
                    id="lrgDots"
                    cx="50%"
                    cy="50%"
                    r="53.2%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset=".9" stopColor="#fff6" />
                    <stop offset="0.95" stopColor="#000" />
                    <stop offset="1" stopColor="#fff" />
                  </radialGradient>
                  <pattern
                    id="crcls-pattern"
                    x="5.25"
                    y="5.25"
                    width="5"
                    height="5"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="5" cy="5" r="0.5" />
                  </pattern>
                </defs>
                <path
                  ref={lrgPetalsRef}
                  className="lrg-petals"
                  d="M74.96,40.26c-6.9,4.59-12.37,7.11-16.42,7.57-.29,.05-.58,.08-.9,.08-.04,0-.07,0-.1,0-.5,.02-.98,0-1.43-.05-.02-.06-.04-.12-.06-.18-.75-.23-1.36-.64-1.84-1.14-.74-.66-1.23-1.54-1.46-2.49-.02,.02-.04,.04-.06,.05-.07-.03-.14-.07-.22-.1-.66-4.15,1.86-10.5,7.59-19.06,5.34-8.64,2-16.95-10.01-24.93-12.01,7.98-15.35,16.29-10.01,24.93,5.71,8.53,8.24,14.87,7.6,19.03-.02,0-.05,.02-.07,.03l-.32,.3c-.48,1.38-1.53,2.54-3.14,2.97l-.08,.07c-4.16,.8-10.62-1.71-19.38-7.53-8.67-5.32-16.89-1.96-24.65,10.06,7.76,11.91,15.98,15.2,24.65,9.88,6.62-4.39,11.92-6.89,15.91-7.51,.47-.15,1-.23,1.57-.23,.41,0,.8,.04,1.16,.12,.18,.02,.36,.03,.53,.06-.02,.02-.03,.04-.05,.07,1.76,.57,2.79,2.06,3.09,3.71,0,0,0,0,0,0,.07-.06,.14-.12,.21-.17,.02,0,.03,.02,.05,.02,.77,4.15-1.75,10.56-7.56,19.25-5.34,8.64-2,16.95,10.01,24.93,12.01-7.98,15.35-16.29,10.01-24.93-5.65-8.44-8.18-14.73-7.61-18.88,.07-.02,.14-.05,.21-.08,.02,.02,.05,.04,.07,.06,.47-1.99,2.03-3.68,4.67-3.68,.03,0,.05,0,.07,0,.02,0,.03,0,.04,0,.04,0,.08,.01,.12,.01,.22,0,.43,.03,.63,.06,.1,.01,.22,.01,.32,.03,4.09,.33,9.69,2.86,16.85,7.61h-.01c8.67,5.33,17.02,2,25.02-9.96-8.01-11.97-16.35-15.29-25.02-9.97Z"
                />
              </svg>
            </div>

            <canvas
              ref={canvasRef}
              id="canvas"
              width="296px"
              height="296px"
            ></canvas>
            <div className="conic-bg"></div>

            {/* SVG Flower 2 and Masks */}
            <div ref={svgFlower2Ref} className="svg-flower2">
              <svg viewBox="0 0 100 100">
                <path
                  className="rad-ten-wavey"
                  d="M60,50 Q63.04,53.49 58.66,55 Q59.55,59.55 55,58.66 Q53.49,63.04 50,60 Q46.51,63.04 45,58.66 Q40.45,59.55 41.34,55 Q36.96,53.49 40,50 Q36.96,46.51 41.34,45 Q40.45,40.45 45,41.34 Q46.51,36.96 50,40 Q53.49,36.96 55,41.34 Q59.55,40.45 58.66,45 Q63.04,46.51 60,50"
                />
                <path
                  className="hollow-petals"
                  d="M50,0 Q61.39,7.50 62,21 Q72,11.89 86,14 Q88.11,28.00 79,38 Q92.50,38.61 100,50 Q92.50,61.39 79,62 Q88.11,72 86,86 Q72.00,88.11 62,79 Q61.39,92.50 50,100 Q38.61,92.50 38,79 Q28.00,88.11 14,86 Q11.89,72.00 21,62 Q7.50,61.39 0,50 Q7.50,38.61 21,38 Q11.89,28.00 14,14 Q28.00,11.89 38,21 Q38.61,7.50 50,0"
                />
                <circle className="crcl-unamsked" cx="50" cy="50" r="6" />
                <circle
                  className="large-dots"
                  cx="50"
                  cy="50"
                  r="35"
                  fill="url(#lrgDots)"
                />
                <mask id="flower-mask">
                  <g>
                    <circle className="bg-crcl" cx="50" cy="50" r="50" />
                    <circle className="crcl-masked" cx="50" cy="50" r="6" />
                    <circle className="crcls" cx="50" cy="50" r="4" />
                  </g>
                  <g>
                    <path
                      className="dlion-tint "
                      d="M79.5,49.5c-10,4.67-12.93,11.74-8.79,21.21-9.47-4.14-16.54-1.21-21.21,8.79-4.67-10-11.74-12.93-21.21-8.79,4.14-9.47,1.21-16.54-8.79-21.21,10-4.67,12.93-11.74,8.79-21.21,9.47,4.14,16.54,1.21,21.21-8.79,4.67,10,11.74,12.93,21.21,8.79-4.14,9.47-1.21,16.54,8.79,21.21"
                    />
                    <path
                      className="dandylion"
                      d="M55.97,46.82c9-2.54,16.84-1.65,23.53,2.68-6.69,4.33-14.53,5.22-23.53,2.68,8.16,4.57,13.07,10.74,14.74,18.53-7.79-1.67-13.96-6.58-18.53-14.74,2.54,9,1.65,16.84-2.68,23.53-4.33-6.69-5.22-14.53-2.68-23.53-4.57,8.16-10.74,13.07-18.53,14.74,1.67-7.79,6.58-13.96,14.74-18.53-9,2.54-16.84,1.65-23.53-2.68,6.69-4.33,14.53-5.22,23.53-2.68-8.16-4.57-13.07-10.74-14.74-18.53,7.79,1.67,13.96,6.58,18.53,14.74-2.54-9-1.65-16.84,2.68-23.53,4.33,6.69,5.22,14.53,2.68,23.53,4.57-8.16,10.74-13.07,18.53-14.74-1.67,7.79-6.58,13.96-14.74,18.53"
                    />
                    <path
                      className="petal-bg-msk"
                      d="M49.5,9.5c4.68,3.13,10.68,1.99,17.99-3.42,1.34,8.99,4.77,14.04,10.29,15.14,1.1,5.52,6.15,8.95,15.14,10.29-5.41,7.31-6.55,13.31-3.42,17.99-3.13,4.68-1.99,10.68,3.42,17.99-8.99,1.34-14.04,4.77-15.14,10.29-5.52,1.1-8.95,6.15-10.29,15.14-7.31-5.41-13.31-6.55-17.99-3.42-4.68-3.13-10.68-1.99-17.99,3.42-1.34-8.99-4.77-14.04-10.29-15.14-1.1-5.52-6.15-8.95-15.14-10.29,5.41-7.31,6.55-13.31,3.42-17.99,3.13-4.68,1.99-10.68-3.42-17.99,8.99-1.34,14.04-4.77,15.14-10.29,5.52-1.1,8.95-6.15,10.29-15.14,7.31,5.41,13.31,6.55,17.99,3.42"
                    />
                    <path
                      className="petal"
                      d="M74.23,59.61c8.59,5.27,16.85,1.97,24.77-9.87-7.93-11.85-16.19-15.14-24.77-9.87-8.32,5.53-14.54,8.03-18.67,7.52-.04-.1-.07-.21-.11-.31,2.49-3.34,8.7-5.99,18.66-7.98,9.81-2.33,13.32-10.48,10.52-24.44-14.01-2.79-22.19,.7-24.53,10.48-1.97,9.84-4.62,16-7.93,18.53-.07-.03-.14-.07-.22-.1-.65-4.11,1.84-10.4,7.52-18.87,5.29-8.56,1.98-16.78-9.91-24.69-11.89,7.9-15.2,16.13-9.91,24.69,5.65,8.45,8.16,14.72,7.53,18.84-.02,0-.05,.02-.07,.03-3.45-2.38-6.18-8.61-8.22-18.73-2.34-9.77-10.52-13.27-24.53-10.48-2.8,13.96,.7,22.11,10.52,24.44,10.06,2,16.3,4.69,18.73,8.08-4.12,.79-10.52-1.69-19.19-7.46-8.59-5.27-16.72-1.94-24.41,9.96,7.68,11.79,15.82,15.05,24.41,9.78,8.54-5.66,14.86-8.16,18.98-7.49-2.35,3.47-8.63,6.21-18.85,8.25-9.81,2.33-13.32,10.48-10.52,24.44,14.01,2.79,22.19-.7,24.53-10.48,2-9.98,4.69-16.18,8.07-18.64,.02,0,.03,.02,.05,.02,.76,4.11-1.73,10.46-7.49,19.06-5.29,8.56-1.98,16.78,9.91,24.69,11.89-7.9,15.2-16.13,9.91-24.69-5.59-8.36-8.1-14.59-7.54-18.69,.07-.02,.14-.05,.21-.08,3.39,2.44,6.09,8.64,8.09,18.65,2.34,9.77,10.52,13.27,24.53,10.48,2.8-13.96-.7-22.11-10.52-24.44-9.81-1.95-15.98-4.57-18.54-7.84,.05-.09,.1-.19,.14-.29,4.13-.6,10.41,1.89,18.85,7.5h0Z"
                      fill="#fdf8c1"
                      opacity=".6"
                    />
                  </g>
                </mask>
                <path
                  className="rad-ten-wavey-unmsk"
                  d="M60,50 Q63.04,53.49 58.66,55 Q59.55,59.55 55,58.66 Q53.49,63.04 50,60 Q46.51,63.04 45,58.66 Q40.45,59.55 41.34,55 Q36.96,53.49 40,50 Q36.96,46.51 41.34,45 Q40.45,40.45 45,41.34 Q46.51,36.96 50,40 Q53.49,36.96 55,41.34 Q59.55,40.45 58.66,45 Q63.04,46.51 60,50"
                />
                <circle
                  className="masked-crcl"
                  cx="50"
                  cy="50"
                  r="50"
                  mask="url(#flower-mask)"
                />
                <circle className="crcl-unamsked" cx="50" cy="50" r="6" />
                <circle
                  className="patternedCircle"
                  cx="50"
                  cy="50"
                  r="10"
                  fill="url(#patternedCircle)"
                />
                {/* Pistil group */}
                <g ref={pistilRef} className="pistil">
                  {[...Array(8)].map((_, i) => (
                    <React.Fragment key={i}>
                      <g
                        ref={(el) => (filamentRefs.current[i * 2] = el)}
                        className="filament"
                      >
                        <path d="M49.18,47c.67-2.33,.67-4.67,0-7" />
                        <path d="M51.18,47c-.67-2.33-.67-4.67,0-7" />
                      </g>
                      <g className="anther">
                        <circle cx="48.88" cy="40" r=".6" />
                        <circle cx="51.48" cy="40" r=".6" />
                      </g>
                      <g
                        ref={(el) => (filamentRefs.current[i * 2 + 1] = el)}
                        className="filament"
                      >
                        <path d="M50.78,53c-.67,2.33-.67,4.67,0,7" />
                        <path d="M48.78,53c.67,2.33,.67,4.67,0,7" />
                      </g>
                      <g className="anther">
                        <circle cx="48.48" cy="60" r=".6" />
                        <circle cx="51.08" cy="60" r=".6" />
                      </g>
                      {/* Add other filament and anther groups here if needed, assigning refs */}
                    </React.Fragment>
                  ))}
                </g>
              </svg>
            </div>
          </div>
          <audio ref={audioRef} id="audio" hidden={true}></audio>
        </div>
      </div>

      {/* The Controls */}
      <div className="controls">
        <div
          ref={playBtnRef}
          id="playBtn"
          className="bttn-play"
          onClick={togglePlayPause}
        >
          <svg viewBox="0 0 100 100" className="svg-bttns">
            <path d="M40,30 75,50 40,70 40,30" />
          </svg>
        </div>
        <div
          ref={pauseBtnRef}
          id="pauseBtn"
          className="bttn-play hidden"
          onClick={togglePlayPause}
        >
          <svg viewBox="0 0 100 100" className="svg-bttns">
            <line x1="40" y1="30" x2="40" y2="70" />
            <line x1="60" y1="30" x2="60" y2="70" />
          </svg>
        </div>
        <div className="seekbar-wrapper input-range-wrapper">
          <input
            ref={seekbarRef}
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            id="seekbar"
            onChange={handleSeek}
          />
        </div>
        <label className="volume-label">
          <div className="input-range-wrapper volume-wrapper">
            <input
              ref={volumeRef}
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              onInput={handleVolumeChange}
              id="volume"
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default MusicPlayer;
