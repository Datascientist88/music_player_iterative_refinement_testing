
# 🎵 React Music Player App

A responsive and animated music player web application built with **React.js**. It allows users to swipe through a selection of music tracks and play them via a unified, visually enriched audio player. This project combines minimal design with interactive animations based on native DOM manipulation — closely adhering to original HTML/CSS/JavaScript logic.

---

## 📦 Features

- 🎚️ **MusicPlayer Component**  
  - Centralized HTML `<audio>` element
  - Real-time volume control and seek bar
  - Play/Pause toggle with full animation sync
  - Visual animations via class-based DOM manipulation
  - Clean transitions when playback starts/ends

- 🎴 **CardSwiper Component**
  - Swipeable/scrollable cards for music selection
  - Each card includes a play button to trigger playback
  - Integrates tightly with the shared MusicPlayer
  - Fully mobile-responsive with touch support

- 🌗 **Light/Dark Theme Support**
  - Toggle available for switching themes
  - All components and animations adapt accordingly

- 📱 **Responsive Design**
  - Mobile-first layout with CSS Grid/Flexbox
  - Seamless scaling across mobile, tablet, and desktop

---

## 📁 Project Structure

```

/src
├── App.js                      # Root component integrating the two
├── components/
│   ├── MusicPlayer.js          # Central audio player logic + UI + animation triggers
│   └── CardSwiper.js           # Music selection card swiper
├── styles/
│   ├── MusicPlayer.css         # Animation, layout, controls styling
│   └── CardSwiper.css          # Swiper card styling and mobile layout
└── index.js                    # React DOM entry point

````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/react-music-player.git
cd react-music-player
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App

```bash
npm start
```

Your app should now be running at:
**[http://localhost:3000](http://localhost:3000)**

---

## ⚙️ Usage Instructions

1. Browse through the tracks using the **Card Swiper**.
2. Press the **Play** button on any card.
3. The **MusicPlayer** loads the track and starts playing.
4. Use the **volume** and **seek bar** for control.
5. Toggle between **Light/Dark mode** for visual preference.

All animations and visual effects are tied to the audio’s state.

---

## 🔒 Design Constraints

* ✅ Animation logic mirrors the original vanilla JavaScript version.
* ✅ Class-based animations are preserved — minimal abstraction.
* ✅ No SVG or external animation libraries are used.
* ❌ No canvas visualization (can be added later optionally).
* ❌ No glassmorphism or neumorphism; clean design only.

---

## 🧠 Technologies Used

* [React.js](https://reactjs.org/)
* [SwiperJS](https://swiperjs.com/) (for card swiper)
* Pure CSS animations and transitions
* HTML5 Audio API

---

## 📸 Screenshots

> *You can add mobile and desktop screenshots here*

---

## 🛠️ Future Enhancements

* [ ] Add audio waveform visualizer
* [ ] Show track duration and progress in mm\:ss format
* [ ] Support drag-and-drop custom track uploads
* [ ] Implement shuffle and auto-next features

---

## 📄 License

This project is licensed under the MIT License — feel free to use, adapt, and build on it.

---

## 👨‍💻 Author

**Mohammed Bahageel**
AI Developer – Dr. Samir Abbas Hospital
[LinkedIn](https://linkedin.com/in/your-profile) | [GitHub](https://github.com/your-username)



