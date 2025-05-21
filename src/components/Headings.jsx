import { useContext } from "react";
import ThemeContext from "../hooks/ThemeContext";
import FavoriteWordsContext from "../hooks/FavoriteWordsContext";
import AuthContext from "../hooks/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { pink } from "@mui/material/colors";
import { IconButton } from "@mui/material";

export function WordCard({
  vocubulary,
  phoneticText,
  spacing,
  setOpenDrawer,
  openDrawer,
}) {
  const { isNight } = useContext(ThemeContext);
  const { isFav } = useContext(FavoriteWordsContext);
  const { user } = useContext(AuthContext);

  const heartStyle = {
    color: pink[500],
    fontSize: 30,
  };

  return (
    <div className={`flex flex-col items-start ${spacing}`}>
      <div className="flex items-center">
        <h1
          className={`text-[32px] md:text-[64px] font-bold mr-4 ${
            isNight ? "text-white" : "text-Black-3"
          } transition duration-400 ease-in-out`}
        >
          {vocubulary}
        </h1>
        {user ? (
          <IconButton id="margin" onClick={() => setOpenDrawer(!openDrawer)}>
            {isFav ? (
              <FavoriteIcon sx={heartStyle} />
            ) : (
              <FavoriteBorderIcon sx={heartStyle} />
            )}
          </IconButton>
        ) : (
          <></>
        )}
      </div>
      <h2 className="text-[24px] font-bold text-Purple-1">{phoneticText}</h2>
    </div>
  );
}

export function HeadingM({ data }) {
  const { isNight } = useContext(ThemeContext);
  return (
    <h2
      className={`text-[18px] md:text-[24px] font-bold  mb-4 grow ${
        isNight ? "text-white" : "text-Black-3"
      } transition duration-400 ease-in-out`}
    >
      {data}
    </h2>
  );
}

export function HeadingS({ data }) {
  return (
    <h3 className="text-[16px] md:text-[20px] font-medium text-Gray-1 mb-2">
      {data}
    </h3>
  );
}

export function HeadingS_a({ data }) {
  return (
    <h3 className="text-[16px] md:text-[20px] font-medium text-Purple-1 cursor-pointer">
      {data}
    </h3>
  );
}

export function FavWordHeading({ word, phonetic, meaning }) {
  const { isNight } = useContext(ThemeContext);

  return (
    <div className={`flex flex-col items-start ml-8`}>
      <h3
        className={`text-[32px] md:text-[36px] font-bold mr-4 ${
          isNight ? "text-white" : "text-Black-3"
        } transition duration-400 ease-in-out`}
      >
        {word}
      </h3>
      <p className="text-[16px] font-bold text-Purple-1">{phonetic}</p>
      <p className="text-[12px] font-bold text-gray-400">-{meaning}</p>
    </div>
  );
}
