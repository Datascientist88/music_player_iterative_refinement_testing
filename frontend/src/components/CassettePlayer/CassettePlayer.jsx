import React, { useEffect, useRef, useState } from "react";
import useAudioStore from "../../stores/useAudioStore";
import "./CassettePlayer.css";

const CassettePlayer = () => {
  // ✅ Proper state usage: only from the store
  const audio = useAudioStore((state) => state.audio);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const playAudio = useAudioStore((state) => state.playAudio);
  const pauseAudio = useAudioStore((state) => state.pauseAudio);

  const [currentTime, setCurrentTime] = useState("00:00");
  const [isEqOn, setIsEqOn] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // ✅ Update timer display
  useEffect(() => {
    const updateTimer = () => {
      if (audio && isFinite(audio.currentTime)) {
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        setCurrentTime(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      }
    };
    if (audio) {
      audio.addEventListener("timeupdate", updateTimer);
      return () => audio.removeEventListener("timeupdate", updateTimer);
    }
  }, [audio]);

  // ✅ EQ visualizer only (does NOT control audio playback)
  useEffect(() => {
    if (!audio) return;

    if (!audioContextRef.current) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = context.createAnalyser();
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }

    if (!isEqOn) return;

    const analyser = analyserRef.current;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const numberOfBars = 30;
    let animationFrameId;

    const renderFrame = () => {
      analyser.getByteFrequencyData(frequencyData);
      for (let i = 0; i < numberOfBars; i++) {
        const index = Math.round((i + 10) * 2.5);
        const frequency = frequencyData[index];
        const bar = document.querySelector("#bar" + i);
        if (bar) {
          const barHeight = Math.max(4, frequency || 0);
          const yHeight = barHeight / 1.5 + "%";
          bar.setAttribute("y2", yHeight);
        }
      }
      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [audio, isEqOn]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audio) audio.volume = newVolume;
  };

  const handleStop = () => {
    if (audio) {
      pauseAudio();
      audio.currentTime = 0;
    }
  };

  const toggleEQ = () => setIsEqOn(!isEqOn);

  return (
    <div className="sound-visualizer-container">
      <div className="cassette-player">
        <div className="cassette-player-handle">
          <div className="top-handle">
            <div className="top-handle-grooves"></div>
          </div>
          <div className="left-handle"></div>
          <div className="right-handle"></div>
        </div>

        <div className="inner-frame">
          <div className="speaker-wrapper left-spkr-wrapper">
            <div className="speaker">
              <div className="inner-speaker"></div>
            </div>
            <div className="speaker-cover left-spkr-cover"></div>
          </div>

          <div className="middle-section">
            <div className="toppart">
              <div id="vis" className={`flip-box-inner ${isEqOn ? "toggleEQ" : ""}`}>
                <div className="counter">
                  <div className="brand-name">
                    <svg width="130px" height="25px"></svg>
                  </div>
                  <div className="volume-wrapper">
                    <label htmlFor="volume-range">VOLUME</label>&nbsp;&nbsp;
                    <input
                      type="range"
                      className="volume-slider"
                      max="1"
                      min="0"
                      step="0.01"
                      defaultValue="0.8"
                      onInput={handleVolumeChange}
                    />
                  </div>
                  <div id="counter" className="digits">{currentTime}</div>
                </div>
                <div className="visbars-wrapper">
                  <div className="lines-holder">
                    <svg id="svgbars" width="488" height="40">
                      <defs>
                        <linearGradient id="lgoff" x1="5" y1="0" x2="5" y2="50" gradientUnits="userSpaceOnUse">
                          <stop stopColor="rgba(85,255,85,0.4)" offset="0.2" />
                          <stop stopColor="rgba(238,238,0,0.4)" offset="0.45" />
                          <stop stopColor="rgba(255,85,87,0.4)" offset="0.65" />
                          <stop stopColor="rgba(238,51,51,0.4)" offset="0.85" />
                          <stop stopColor="rgba(255,0,0,0.4)" offset="9.7" />
                        </linearGradient>
                        <linearGradient id="e" x1="5" y1="0" x2="5" y2="100" gradientUnits="userSpaceOnUse">
                          <stop stopColor="rgba(85,255,85,1)" offset="0.1" />
                          <stop stopColor="rgba(238,238,0,1)" offset="0.25" />
                          <stop stopColor="rgba(255,85,87,1)" offset="0.45" />
                          <stop stopColor="rgba(221,34,34,1)" offset="0.65" />
                          <stop stopColor="rgba(255,0,0,1)" offset="7.7" />
                        </linearGradient>
                      </defs>
                      {[...Array(30)].map((_, i) => (
                        <line key={`off-${i}`} stroke="url(#lgoff)" id={`baroff${i}`} className="bars-off" x1={5 + i * 6} y1="0" x2={5 + i * 6} y2="100" />
                      ))}
                      {[...Array(30)].map((_, i) => (
                        <line key={`on-${i}`} stroke="url(#e)" id={`bar${i}`} className="singlebars" x1={5 + i * 6} y1="0" x2={5 + i * 6} y2="0" />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Cassette graphic */}
            <div className="cassette">
              <svg className="cassette-svg">
                <circle id="leftwheel" className={`wheel-inner lw ${isPlaying ? "inmotion" : ""}`} cx="100" cy="130" r="20" />
                <circle id="rightwheel" className={`wheel-inner rw ${isPlaying ? "inmotion" : ""}`} cx="300" cy="130" r="20" />
                {/* ... rest of your SVG as-is ... */}
              </svg>
            </div>
          </div>

          {/* Controls */}
          <div className="ctrls">
            <div id="btnStop" className={`button ${!audio ? "disabled" : ""}`} onClick={handleStop}>
              <svg className="svg-bttns" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18">
                <path d="M0 0h24v24H0z" fill="none" /><path d="M6 6h12v12H6z" />
              </svg>
            </div>
            <div id="btnPlay" className={`button ${isPlaying || !audio ? "disabled" : ""}`} onClick={() => audio?.play()}>
              <svg className="svg-bttns" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18">
                <path d="M0 0h24v24H0z" fill="none" /><path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div id="btnPause" className={`button ${!isPlaying ? "disabled" : ""}`} onClick={() => audio?.pause()}>
              <svg className="svg-bttns" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18">
                <path d="M0 0h24v24H0z" fill="none" /><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </div>
            <div className="button btn-settings">
              <svg className="rec-icon" width="30" height="25">
                <circle cx="15" cy="9" r="5" fill="#700" />
              </svg>
            </div>
            <div className={`button btn-eq ${!audio ? "disabled" : ""}`} onClick={toggleEQ}>
              <svg className="vis-icon" width="30" height="25">
                <line x1="8" y1="9" x2="8" y2="17" stroke="#0b07" />
                <line x1="13" y1="9" x2="13" y2="14" stroke="#ff57" />
                <line x1="18" y1="9" x2="18" y2="16" stroke="#faa7" />
                <line x1="23" y1="9" x2="23" y2="13" stroke="#f228" />
              </svg>
            </div>
          </div>

          <div className="speaker-wrapper right-spkr-wrapper">
            <div className="speaker"><div className="inner-speaker"></div></div>
            <div className="speaker-cover right-spkr-cover"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CassettePlayer;
