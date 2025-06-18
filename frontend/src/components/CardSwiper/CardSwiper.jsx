// src/components/CardSwiper/CardSwiper.js

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import useAudioStore from "../../stores/useAudioStore"; // Make sure path is correct

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// Import custom styles and Font Awesome
import "./CardSwiper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faPlay,
  faPause,
  faForward,
  faBackward,
  faShuffle,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";

// Import your assets
import track1_url from "../../assets/music/track1.mp3";
import track2_url from "../../assets/music/track2.mp3";
import track3_url from "../../assets/music/track3.mp3";
import track4_url from "../../assets/music/track4.mp3";
import track5_url from "../../assets/music/track5.mp3";
import track6_url from "../../assets/music/track6.mp3";
import track7_url from "../../assets/music/track7.mp3";
import track8_url from "../../assets/music/track8.mp3";
import track9_url from "../../assets/music/track9.mp3";
import track10_url from "../../assets/music/track10.mp3";
import track11_url from "../../assets/music/track11.mp3";
import track12_url from "../../assets/music/track12.mp3";
import track13_url from "../../assets/music/track13.mp3";
import cover1_img from "../../assets/images/cover1.jpg";
import cover2_img from "../../assets/images/cover2.jpg";
import cover3_img from "../../assets/images/cover3.jpg";
import cover4_img from "../../assets/images/cover4.jpg";
import cover5_img from "../../assets/images/cover5.jpg";
import cover6_img from "../../assets/images/cover6.jpg";
import cover7_img from "../../assets/images/cover7.jpg";
import cover8_img from "../../assets/images/cover8.jpg";
import cover9_img from "../../assets/images/cover9.jpg";
import cover10_img from "../../assets/images/cover10.jpg";
import cover11_img from "../../assets/images/cover11.jpg";
import cover12_img from "../../assets/images/cover12.jpg";
import cover13_img from "../../assets/images/cover13.jpg";

const tracks = [
  {
    title: "كتير بنعشق",
    artist: "شرين عبد الوهاب",
    rating: "8.5",
    url: track1_url,
    cover: cover1_img,
  },
  {
    title: "مشاعر",
    artist: "شرين عبد الوهاب",
    rating: "9.2",
    url: track2_url,
    cover: cover2_img,
  },
  {
    title: "مين دا اللي نسيك",
    artist: "نانسي عجرم",
    rating: "8.9",
    url: track3_url,
    cover: cover3_img,
  },
  {
    title: "بحبك وحشتني",
    artist: "حسين الجسمي",
    rating: "9.0",
    url: track4_url,
    cover: cover4_img,
  },
  {
    title: "بيت حبيبي",
    artist: "يارا",
    rating: "9.1",
    url: track5_url,
    cover: cover5_img,
  },
  {
    title: "ساعات",
    artist: "أليسا",
    rating: "9.3",
    url: track6_url,
    cover: cover6_img,
  },
  {
    title: "بحك مش حقول تاني",
    artist: "وائل جسار",
    rating: "9.8",
    url: track13_url,
    cover: cover13_img,
  },
  {
    title: "بامارة مين",
    artist: "احمد فريد",
    rating: "9.0",
    url: track7_url,
    cover: cover7_img,
  },
  {
    title: "كلمات",
    artist: "ماجدة الرومي",
    rating: "9.4",
    url: track8_url,
    cover: cover8_img,
  },
  {
    title:"خليني ذكرى",
    artist: "وائل جسار",
    rating: "9.5",
    url: track9_url,
    cover: cover9_img,
  },
  {
    title: "لو كان بخاطري",
    artist: "  امال ماهر|  راشد الماجد",
    rating: "9.6",
    url: track10_url,
    cover: cover10_img,
  },
  {
    title: "خذني معك",
    artist: "فضل شاكر",
    rating: "9.7",
    url: track11_url,
    cover: cover11_img,
  },
  {
    title: "موجوع",
    artist: "وائل جسار",
    rating: "9.8",
    url: track12_url,
    cover: cover12_img,
  },

];
// --- Sound Visualizer Component ---
const SoundVisualizer = () => {
  const analyserNode = useAudioStore((state) => state.analyserNode);
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const cwidth = canvas.width;
    const cheight = canvas.height;
    const meterWidth = 8;
    const gap = 3;
    const meterNum = Math.floor(cwidth / (meterWidth + gap));
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
        const value = array[i * Math.floor(array.length / meterNum)];
        if (capYPositionArray.length < meterNum) capYPositionArray.push(value);
        ctx.fillStyle = capStyle;
        if (value < capYPositionArray[i]) {
          ctx.fillRect(
            i * (meterWidth + gap),
            cheight - --capYPositionArray[i],
            meterWidth,
            capHeight
          );
        } else {
          ctx.fillRect(
            i * (meterWidth + gap),
            cheight - value,
            meterWidth,
            capHeight
          );
          capYPositionArray[i] = value;
        }
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
    drawMeter();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [analyserNode]);

  return (
    <div className="sound-visualizer-wrapper">
      <canvas
        id="visualizer-canvas"
        width="800"
        height="120"
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

// --- Player Component ---
const Player = () => {
  const {
    isPlaying,
    playPause,
    nextTrack,
    prevTrack,
    toggleShuffle,
    isShuffle,
    volume,
    setVolume,
    currentTime,
    duration,
    seek,
  } = useAudioStore();

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="players">
      <SoundVisualizer />

      <div className="progress-container">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          id="progress-bar"
          value={isNaN(currentTime) ? 0 : currentTime}
          max={isNaN(duration) ? 0 : duration}
          onChange={(e) => seek(e.target.value)}
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="controls">
        <FontAwesomeIcon
          icon={faShuffle}
          id="shuffleBtn"
          onClick={toggleShuffle}
          className={isShuffle ? "active-icon" : ""}
        />
        <FontAwesomeIcon icon={faBackward} id="prevBtn" onClick={prevTrack} />
        <button id="playPauseBtn" onClick={playPause}>
          <FontAwesomeIcon
            icon={isPlaying ? faPause : faPlay}
            id="playPauseIcon"
          />
        </button>
        <FontAwesomeIcon icon={faForward} id="nextBtn" onClick={nextTrack} />
        <div className="volume">
          <FontAwesomeIcon icon={volume > 0 ? faVolumeHigh : faVolumeXmark} />
          <input
            type="range"
            id="volume-range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

// --- Playlist Component ---
const Playlist = ({ onTrackSelect }) => {
  const { tracks, currentTrackIndex, isLiked, toggleLike } = useAudioStore();

  return (
    <div className="playlist">
      {tracks.map((track, index) => (
        <div
          key={index}
          className={`playlist-item ${
            index === currentTrackIndex ? "active-playlist-item" : ""
          }`}
          onClick={() => onTrackSelect(index)}
        >
          <img src={track.cover} alt={track.title} />
          <div className="song">
            <p>{track.artist}</p>
            <p>{track.title}</p>
          </div>
          <FontAwesomeIcon
            icon={isLiked[index] ? faHeartSolid : faHeartRegular}
            className={`like-btn ${isLiked[index] ? "liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(index);
            }}
          />
        </div>
      ))}
    </div>
  );
};

// --- Main Exported Component ---
const CardSwiper = () => {
  const { setTracks, currentTrackIndex, playTrack } = useAudioStore();
  const swiperRef = useRef(null);
  const [isUserInteraction, setIsUserInteraction] = useState(false);

  useEffect(() => {
    setTracks(tracks);
  }, [setTracks]);

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (
      swiper &&
      swiper.realIndex !== currentTrackIndex &&
      !isUserInteraction
    ) {
      swiper.slideToLoop(currentTrackIndex);
    }
  }, [currentTrackIndex, isUserInteraction]);

  const handleSlideChange = (swiper) => {
    if (isUserInteraction) {
      playTrack(swiper.realIndex);
    }
  };

  return (
    <div className="ui">
      <div className="content">
        <div className="slider-playlist">
          <Swiper
            ref={swiperRef}
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards,Mousewheel]}
            initialSlide={0}
            speed={700}
            loop={true}
            mousewheel={{
            invert: false,
          }}
            cardsEffect={{ perSlideOffset: 10, perSlideRotate: 5 }}
            onSlideChange={handleSlideChange}
            onTouchStart={() => setIsUserInteraction(true)}
            onTouchEnd={() => setTimeout(() => setIsUserInteraction(false), 50)}
            className="swiper"
          >
            {tracks.map((track, index) => (
              <SwiperSlide key={index}>
                <img src={track.cover} alt={track.title} />
                <h1>{track.artist}</h1>
              </SwiperSlide>
            ))}
          </Swiper>

          <Playlist onTrackSelect={playTrack} />
        </div>
        <Player />
      </div>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default CardSwiper;
