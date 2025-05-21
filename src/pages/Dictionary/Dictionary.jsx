import { useContext, useEffect, useState } from "react";
import Navbar from "../../../src/components/Navbar/Navbar.jsx";
import Search from "../../../src/components/Search/Search.jsx";
import FavListDrawer from "./FavListDrawer.jsx";
import { WordCard } from "../../../src/components/Headings.jsx";
import { BodyS, BodyS_a } from "../../../src/components/Bodys.jsx";
import {
  ScuccessData,
  FailureData,
} from "../../../src/components/WordResult/WordResult.jsx";
import DictionaryContext from "../../hooks/DictionaryContext.jsx";
import ThemeContext from "../../hooks/ThemeContext.jsx";
import AudioPlayer from "../../../src/components/AudioPlayer/AudioPlayer.jsx";
import { fetchWordData } from "../../apis/fetchWordData.js";
import WordHistory from "../../../src/components/WordHistory.jsx";
import AuthContext from "../../hooks/AuthContext.jsx";

import "./Dictionary.css";

export default function Dictionary() {
  const { word, WordHandler } = useContext(DictionaryContext); //get word and handler by using useContent
  const { isNight, font } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [phoneticData, setPhoneticData] = useState(null); //extract data form word
  const [meaningsData, setMeaningsData] = useState(null); //extract data form word
  const [isLoading, setIsLoading] = useState(true); //waiting data fetch
  const [isSuccess, setIsSuccess] = useState(false); //is fetch success or not
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentSearch, setCurrentSearch] = useState(""); //is fetch success or not
  const [history, setHistory] = useState([]);
  const { vocabulary, phonetics, meanings, sourceUrls } = word;

  useEffect(() => {
    async function welcome() {
      //welcome to our users
      try {
        const data = await fetchWordData("welcome");
        WordHandler(data);
        setCurrentSearch("welcome");
        setIsSuccess(true);
      } catch (error) {
        console.error(error);
        setIsSuccess(false);
      }
    }
    welcome();
  }, []);

  useEffect(() => {
    //processing word data
    if (Object.keys(word).length > 0) {
      setPhoneticData(phonetics);
      setMeaningsData(meanings);
      setIsLoading(false);
    }
  }, [word, WordHandler, user]);

  const handleSearch = (newWord) => {
    setCurrentSearch(newWord);
    setHistory((prevHistory) => {
      const newHistory = [newWord, ...prevHistory];
      if (prevHistory.includes(newWord)) {
        const newprev = prevHistory.filter((word) => word != newWord);
        const newHistory = [newWord, ...newprev];
        return newHistory.slice(0, 5);
      } else {
        return newHistory.slice(0, 5);
      }
    });
  };

  const searchByClick = async (Word) => {
    //search by click synonyms or antonyms
    await fetchWordData(Word)
      .then((data) => {
        WordHandler(data);
        setCurrentSearch(Word);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error(error);
        setIsSuccess(false);
      });
  };

  return (
    <div className={`Dictionary-bg ${isNight ? "bg-Black-1 " : "bg-white"}`}>
      <main className={`Dictionary font-${font} `}>
        <FavListDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        <Navbar />
        <Search
          setIsSuccess={setIsSuccess}
          currentSearch={currentSearch}
          handleSearch={handleSearch}
        />
        <WordHistory history={history} searchByClick={searchByClick} />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {isSuccess ? (
              <div className="Dictionary__main">
                <div className="Dictionary__word">
                  <WordCard
                    vocubulary={vocabulary}
                    phoneticText={phoneticData?.text || null}
                    setOpenDrawer={setOpenDrawer}
                    openDrawer={openDrawer}
                  />
                  <AudioPlayer audioSrc={phoneticData?.audio || null} />
                </div>
                {meaningsData && meaningsData.length > 0
                  ? meaningsData.map((meaning, index) => (
                      <ScuccessData
                        data={meaning}
                        key={index}
                        searchByClick={searchByClick}
                      />
                    ))
                  : ""}
                <hr />
                <footer className="Dictionary__footer">
                  <BodyS data={"Source"} />
                  {sourceUrls?.map((url, index) => (
                    <BodyS_a data={url} key={index} />
                  ))}
                </footer>
              </div>
            ) : (
              <FailureData />
            )}
          </>
        )}
      </main>
    </div>
  );
}
