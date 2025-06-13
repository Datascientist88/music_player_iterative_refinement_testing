// src/components/SoundVisualizer.js
import React, { useEffect, useRef } from "react";
import useAudioStore from "../../stores/useAudioStore"; // Import the Zustand store
import "./SoundVisualizer.css";

const SoundVisualizer = () => {
  const analyserNode = useAudioStore((state) => state.analyserNode);
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    // Do nothing if the analyser from the main player isn't ready
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const cwidth = canvas.width;
    const cheight = canvas.height - 2;
    const meterWidth = 10;
    const gap = 2;
    const meterNum = Math.floor(cwidth / (meterWidth + gap)); // Make the number of bars responsive to canvas width
    const capHeight = 2;
    const capStyle = "rgba(255, 255, 255, 0.8)";
    const capYPositionArray = [];

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, "#2b86c5");
    gradient.addColorStop(0.5, "#784ba0");
    gradient.addColorStop(0, "#ff3cac");

    const drawMeter = () => {
      const array = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(array);

      ctx.clearRect(0, 0, cwidth, cheight);

      for (let i = 0; i < meterNum; i++) {
        // Use a value from the array for each bar
        const value = array[i * Math.floor(array.length / meterNum)];

        if (capYPositionArray.length < meterNum) {
          capYPositionArray.push(value);
        }

        ctx.fillStyle = capStyle;
        // Draw the cap
        if (value < capYPositionArray[i]) {
          // Fall down
          ctx.fillRect(
            i * (meterWidth + gap),
            cheight - --capYPositionArray[i],
            meterWidth,
            capHeight
          );
        } else {
          // Rise up
          ctx.fillRect(
            i * (meterWidth + gap),
            cheight - value,
            meterWidth,
            capHeight
          );
          capYPositionArray[i] = value;
        }

        // Draw the main bar
        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * (meterWidth + gap),
          cheight - value + capHeight,
          meterWidth,
          cheight
        );
      }
      animationIdRef.current = requestAnimationFrame(drawMeter);
    };

    // Start the animation
    drawMeter();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [analyserNode]); // This effect re-runs if the analyser node ever changes

  return (
    <div className="sound-visualizer-wrapper">
      <canvas
        id="canvas-two"
        width="1000"
        height="250"
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default SoundVisualizer;
