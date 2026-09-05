'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AUDIO_KEY = 'empire_audio_state';
const TIME_KEY = 'empire_audio_time';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/Empire.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const savedTime = localStorage.getItem(TIME_KEY);
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }

    const savedState = localStorage.getItem(AUDIO_KEY);
    if (savedState === 'on') {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    const handleTimeUpdate = () => {
      if (audio.currentTime) {
        localStorage.setItem(TIME_KEY, audio.currentTime.toString());
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.pause();
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem(AUDIO_KEY, 'off');
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        localStorage.setItem(AUDIO_KEY, 'on');
      }).catch((e) => console.log('Audio autoplay blocked', e));
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className={`p-2 rounded-full border transition-all ${
        isPlaying
          ? 'border-gold-500 text-gold-400 bg-gold-500/10 shadow-[0_0_12px_rgba(212,175,55,0.4)] animate-pulse'
          : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
      }`}
      title={isPlaying ? 'Mute luxury soundtrack' : 'Play luxury soundtrack'}
      aria-label="Toggle Soundtrack"
    >
      {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
}
