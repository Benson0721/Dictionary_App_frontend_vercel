import { useEffect, useRef, useState } from "react";

import "./AudioPlayer.scss";

export default function AudioPlayer({ audioSrc }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); //avoid replay
  const [isAudioExist, setIsAudioExist] = useState(false); //avoid replay

  const playAudio = () => {
    setIsButtonDisabled(true);
    if (isPlaying && audioRef.current !== null) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    //control state when play audio is over
    if (!audioSrc) {
      setIsAudioExist(false);
    } else {
      setIsAudioExist(true);
    }
    if (audioRef.current) {
      const handleEnded = () => {
        setIsPlaying(false);
        setIsButtonDisabled(false);
      };
      audioRef.current.addEventListener("ended", handleEnded);
      return () => {
        if (audioRef.current)
          audioRef.current.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef, audioSrc]);

  return (
    <>
      <audio src={audioSrc} ref={audioRef} />
      <button
        className={`Dictonary__playButton ${isAudioExist ? "block" : "hidden"}`}
        onClick={playAudio}
        disabled={isButtonDisabled}
      >
        <svg
          className="Dictonary__playButton__icon"
          xmlns="http://www.w3.org/2000/svg"
          width="75"
          height="75"
          viewBox="0 0 75 75"
        >
          <g fill="#A445ED" fillRule="evenodd">
            <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" />
            <path d="M29 27v21l21-10.5z" />
          </g>
        </svg>
      </button>
    </>
  );
}
