import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Mousewheel, Pagination } from "swiper/modules";
import useAudioStore from "../../stores/useAudioStore";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

import "./CardSwiper.css";

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

const CardSwiper = () => {
  // Get the playAudio action from the Zustand store
  const playAudio = useAudioStore((state) => state.playAudio);

  return (
    <section className="card-swiper-section">
      <div className="content">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards, Mousewheel, Pagination]}
          initialSlide={0}
          speed={800}
          loop={true}
          rotate={true}
          mousewheel={{
            invert: false,
          }}
          pagination={{
            el: ".swiper-pagination-custom", // Link to custom pagination element
            clickable: true,
            dynamicBullets: true,
          }}
          className="my-card-swiper"
        >
          {tracks.map((track, index) => (
            <SwiperSlide key={index}>
              <img src={track.cover} alt={track.title} />
              <div className="overlay">
                <div className="rating">
                  <span>★</span> {track.rating}
                </div>
                <div className="title-container">
                  <h2>{track.title}</h2>
                  <p>{track.artist}</p>
                </div>
                <button
                  className="card-play-button"
                  onClick={() => playAudio(track.url)}
                  aria-label={`Play ${track.title}`}
                >
                  <svg viewBox="0 0 100 100">
                    <path d="M40,30 75,50 40,70Z" />
                  </svg>
                  Play
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom Pagination container */}
        <div className="swiper-pagination-custom"></div>
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
    </section>
  );
};

export default CardSwiper;
