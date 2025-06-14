// frontend/src/components/CardSwiper/CardSwiper.js use it when you decide to fetch data from Sanity

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Mousewheel, Pagination } from "swiper/modules";
import { client, urlFor } from "../../client"; // Import Sanity client and urlFor helper
import useAudioStore from "../../stores/useAudioStore";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "./CardSwiper.css";

const CardSwiper = () => {
  // State to hold the tracks fetched from Sanity
  const [tracks, setTracks] = useState([]);
  const playAudio = useAudioStore((state) => state.playAudio);

  useEffect(() => {
    // This is a GROQ query to fetch all documents of type 'track'
    // We also project the asset URLs for the image and audio file directly
    const query = `*[_type == "track"]{
      _id,
      title,
      artist,
      rating,
      coverImage,
      "audioUrl": audioFile.asset->url
    }`;

    // Fetch the data from Sanity
    client.fetch(query).then((data) => {
      setTracks(data);
    });
  }, []); // The empty array ensures this effect runs only once when the component mounts

  // Display a loading message while fetching data
  if (!tracks.length) {
    return <div className="loading">Loading Tracks…</div>;
  }

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
            el: ".swiper-pagination-custom", // Link to our custom pagination element
            clickable: true,
            dynamicBullets: true,
          }}
          className="my-card-swiper"
        >
          {tracks.map((track, index) => (
            <SwiperSlide key={track._id || index}>
              {/* Use the urlFor helper to generate a usable image URL */}
              <img src={urlFor(track.coverImage).url()} alt={track.title} />
              <div className="overlay">
                <div className="rating">
                  <span>★</span> {track.rating}
                </div>
                <div className="title-container">
                  <h2>{track.title}</h2>
                  <p>{track.artist}</p>
                </div>
                {/* The audioUrl is now directly available on the track object */}
                <button
                  className="card-play-button"
                  onClick={() => playAudio(track.audioUrl)}
                  aria-label={`Play ${track.title}`}
                >
                  <svg viewBox="0 0 100 100">
                    <path d="M40,30 75,50 40,70Z" />
                  </svg>
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