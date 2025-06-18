// src/components/MusicPlayer.js

import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards, Mousewheel, Pagination } from "swiper/modules";
import "./MusicPlayer.css";

import useAudioStore from "../stores/useAudioStore";
import SoundVisualizer from "./SoundVisualizer/SoundVisualizer";
// Assets
import track1_url from "../assets/music/track1.mp3";
import track2_url from "../assets/music/track2.mp3";
import track3_url from "../assets/music/track3.mp3";
import track4_url from "../assets/music/track4.mp3";
import track5_url from "../assets/music/track5.mp3";
import track6_url from "../assets/music/track6.mp3";
import track7_url from "../assets/music/track7.mp3";
import track8_url from "../assets/music/track8.mp3";
import track9_url from "../assets/music/track9.mp3";
import track10_url from "../assets/music/track10.mp3";
import track11_url from "../assets/music/track11.mp3";
import track12_url from "../assets/music/track12.mp3";
import track13_url from "../assets/music/track13.mp3";

import cover1_img from "../assets/images/cover1.jpg";
import cover2_img from "../assets/images/cover2.jpg";
import cover3_img from "../assets/images/cover3.jpg";
import cover4_img from "../assets/images/cover4.jpg";
import cover5_img from "../assets/images/cover5.jpg";
import cover6_img from "../assets/images/cover6.jpg";
import cover7_img from "../assets/images/cover7.jpg";
import cover8_img from "../assets/images/cover8.jpg";
import cover9_img from "../assets/images/cover9.jpg";
import cover10_img from "../assets/images/cover10.jpg";
import cover11_img from "../assets/images/cover11.jpg";
import cover12_img from "../assets/images/cover12.jpg";
import cover13_img from "../assets/images/cover13.jpg";

const tracks = [
  {
    title: "كتير بنعشق",
    artist: "شرين عبد الوهاب",
    url: track1_url,
    cover: cover1_img,
  },
  {
    title: "مشاعر",
    artist: "شرين عبد الوهاب",
    url: track2_url,
    cover: cover2_img,
  },
  {
    title: "مين دا اللي نسيك",
    artist: "نانسي عجرم",
    url: track3_url,
    cover: cover3_img,
  },
  {
    title: "بحبك وحشتني",
    artist: "حسين الجسمي",
    url: track4_url,
    cover: cover4_img,
  },
  { title: "بيت حبيبي", artist: "يارا", url: track5_url, cover: cover5_img },
  { title: "ساعات", artist: "أليسا", url: track6_url, cover: cover6_img },
  {
    title: "بحك مش حقول تاني",
    artist: "وائل جسار",
    url: track13_url,
    cover: cover13_img,
  },
  {
    title: "بامارة مين",
    artist: "احمد فريد",
    url: track7_url,
    cover: cover7_img,
  },
  {
    title: "كلمات",
    artist: "ماجدة الرومي",
    url: track8_url,
    cover: cover8_img,
  },
  {
    title: "خليني ذكرى",
    artist: "وائل جسار",
    url: track9_url,
    cover: cover9_img,
  },
  {
    title: "لو كان بخاطري",
    artist: "امال ماهر | راشد الماجد",
    url: track10_url,
    cover: cover10_img,
  },
  {
    title: "خذني معك",
    artist: "فضل شاكر",
    url: track11_url,
    cover: cover11_img,
  },
  { title: "موجوع", artist: "وائل جسار", url: track12_url, cover: cover12_img },
];

const MusicPlayer = () => {
  const {
    audio,
    currentTrackIndex,
    isPlaying,
    playPause,
    playTrack,
    nextTrack,
    prevTrack,
    setVolume,
    currentTime,
    duration,
    seek,
    toggleShuffle,
  } = useAudioStore();

  const swiperRef = useRef(null);

  useEffect(() => {
    useAudioStore.getState().setTracks(tracks);
  }, []);

  useEffect(() => {
    if (swiperRef.current?.swiper && currentTrackIndex !== null) {
      swiperRef.current.swiper.slideTo(currentTrackIndex);
    }
  }, [currentTrackIndex]);

  const handleVolumeChange = (e) => {
    const vol = e.target.value / 100;
    audio.volume = vol;
    setVolume(vol);
  };

  const handleProgressChange = (e) => {
    seek(Number(e.target.value));
  };

  return (
    <main>
      <div className="slider-playlist">
        <Swiper
          ref={swiperRef}
          
          className="swiper"
          effect={"cards"}
          grabCursor={true}
            modules={[EffectCards, Mousewheel, Pagination]}
          initialSlide={0}
          mousewheel={{
            invert: false,
          }}
          onSlideChange={(swiper) => playTrack(swiper.realIndex)}
          cardsEffect={{ perSlideOffset: 9, perSlideRotate: 3 }}
        >
          {tracks.map((track, index) => (
            <SwiperSlide key={index}>
              <img src={track.cover} alt={track.title} />
              <h1>{track.artist}</h1>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="playlist">
          {tracks.map((track, index) => (
            <div
              key={index}
              className={`playlist-item ${
                index === currentTrackIndex ? "active-playlist-item" : ""
              }`}
              onClick={() => playTrack(index)}
            >
              <img src={track.cover} alt={track.title} />
              <div className="song">
                <p>{track.artist}</p>
                <p>{track.title}</p>
              </div>
              <i className="fa-regular fa-heart"></i>
            </div>
          ))}
        </div>
      </div>

      <div className="player">
        {/* ✅ VISUALIZER: keep this above the controls */}
        <SoundVisualizer />

        <div className="controls">
          <i
            className="fa-solid fa-shuffle"
            id="shuffleBtn"
            onClick={toggleShuffle}
          ></i>
          <i
            className="fa-solid fa-backward"
            id="prevBtn"
            onClick={prevTrack}
          ></i>
          <button id="playPauseBtn" onClick={playPause}>
            <i
              className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}
              id="playPauseIcon"
            ></i>
          </button>
          <i
            className="fa-solid fa-forward"
            id="nextBtn"
            onClick={nextTrack}
          ></i>
          <div className="volume">
            <i className="fa-solid fa-volume-high"></i>
            <input
              type="range"
              id="volume-range"
              min="0"
              max="100"
              defaultValue="100"
              onChange={handleVolumeChange}
            />
          </div>
        </div>

        <input
          type="range"
          id="progress-bar"
          value={currentTime}
          min="0"
          max={duration || 0}
          onChange={handleProgressChange}
        />
      </div>
    </main>
  );
};

export default MusicPlayer;
