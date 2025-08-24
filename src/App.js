import React, { useState, useRef, useEffect } from "react";
import "./App.css";

export default function MusicApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("nowPlaying");
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default 50%
  const audioRef = useRef(null);

  const playlist = [
    { title: "Song One", artist: "Artist A", src: "/song1.mp3" },
    { title: "Song Two", artist: "Artist B", src: "/song2.mp3" },
    { title: "Song Three", artist: "Artist C", src: "/song3.mp3" },
  ];

  // Keep volume updated when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (index) => {
    setCurrentSong(index);
    setIsPlaying(true);
    setCurrentScreen("nowPlaying");
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const changeVolume = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const increaseVolume = () => {
    setVolume((prev) => Math.min(prev + 0.1, 1));
  };

  const decreaseVolume = () => {
    setVolume((prev) => Math.max(prev - 0.1, 0));
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        // ---------- LOGIN ----------
        <div className="card">
          <h1 className="title">🎵 Music Player</h1>
          <input type="text" placeholder="Username" className="input" />
          <input type="password" placeholder="Password" className="input" />
          <button onClick={() => setIsLoggedIn(true)} className="btn">
            Get Started
          </button>
        </div>
      ) : currentScreen === "nowPlaying" ? (
        // ---------- NOW PLAYING ----------
        <div className="card">
          <h2 className="subtitle">Now Playing</h2>
          <div className="album-art">🎶</div>
          <h3 className="song-title">{playlist[currentSong].title}</h3>
          <p className="artist">{playlist[currentSong].artist}</p>

          {/* Controls */}
          <div className="controls">
            <button
              onClick={() =>
                playSong((currentSong - 1 + playlist.length) % playlist.length)
              }
            >
              ⏮
            </button>
            <button onClick={togglePlay} className="play-btn">
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={() => playSong((currentSong + 1) % playlist.length)}
            >
              ⏭
            </button>
          </div>

          {/* Volume Controls */}
          <div className="volume-container">
            <button onClick={decreaseVolume}>🔉</button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={changeVolume}
              className="volume-slider"
            />
            <button onClick={increaseVolume}>🔊</button>
          </div>

          <button
            onClick={() => setCurrentScreen("playlist")}
            className="link-btn"
          >
            View Playlist
          </button>

          {/* ✅ Audio element always exists */}
          <audio
            ref={audioRef}
            src={playlist[currentSong].src}
            autoPlay={isPlaying}
            onEnded={() =>
              playSong((currentSong + 1) % playlist.length)
            } // auto next
          />
        </div>
      ) : (
        // ---------- PLAYLIST ----------
        <div className="card">
          <h2 className="subtitle">🎵 Playlist</h2>
          {playlist.map((song, index) => (
            <div
              key={index}
              className="playlist-item"
              onClick={() => playSong(index)}
            >
              <div>
                <h3 className="song-title">{song.title}</h3>
                <p className="artist">{song.artist}</p>
              </div>
              <span>▶</span>
            </div>
          ))}
          <button
            onClick={() => setCurrentScreen("nowPlaying")}
            className="link-btn"
          >
            Back to Player
          </button>
        </div>
      )}
    </div>
  );
}
