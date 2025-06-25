import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../../../src/components/Navbar/Navbar.jsx";
import Search from "../../../src/components/Search/Search.jsx";
import FavListDrawer from "./FavListDrawer.jsx";
import { WordCard } from "../../../src/components/Headings.jsx";
import { TextS, TextS_a } from "../../../src/components/Texts.jsx";
import {
  ScuccessData,
  FailureData,
} from "../../../src/components/WordResult/WordResult.jsx";
import DictionaryContext from "../../hooks/DictionaryContext.jsx";
import ThemeContext from "../../hooks/ThemeContext.jsx";
import AudioPlayer from "../../../src/components/AudioPlayer/AudioPlayer.jsx";
import { fetchWordData } from "../../apis/fetchWordData.js";
import WordHistory from "../../../src/components/WordHistory.jsx";

import "./Dictionary.scss";

export default function Dictionary() {
  const { word, WordHandler } = useContext(DictionaryContext);
  const { isNight, font } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const [history, setHistory] = useState([]);
  const { vocabulary, phonetics, meanings, sourceUrls } = word;

  const phoneticData = useMemo(() => phonetics || null, [word]);
  const meaningsData = useMemo(() => meanings || null, [word]);

  useEffect(() => {
    async function loadInitialWord() {
      //welcome to our users
      try {
        const data = await fetchWordData("welcome");
        WordHandler(data);
        setCurrentSearch("welcome");
        setIsSuccess(true);
      } catch (error) {
        console.error("Fail to load initial word:", error);
        setIsSuccess(false);
      }
    }
    loadInitialWord();
  }, []);

  useEffect(() => {
    //processing word data
    if (Object.keys(word).length > 0) {
      setIsLoading(false);
    }
  }, [word]);

  const handleSearch = useCallback((newWord) => {
    setCurrentSearch(newWord);
    setHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter((word) => word !== newWord);
      return [newWord, ...filteredHistory].slice(0, 5);
    });
  }, []);

  const searchByClick = useCallback(
    async (Word) => {
      //search by click synonyms or antonyms
      await fetchWordData(Word)
        .then((data) => {
          WordHandler(data);
          setCurrentSearch(Word);
          setIsSuccess(true);
        })
        .catch((error) => {
          console.error("Fail to search by click:", error);
          setIsSuccess(false);
        });
    },
    [WordHandler]
  );

  return (
    <div className={`Dictionary-bg ${isNight ? "bg-Black-3 " : "bg-white"}`}>
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
                <hr className={isNight ? "border-white" : "border-Gray-2"} />
                <footer className="Dictionary__footer">
                  <TextS data={"Source"} />
                  {sourceUrls?.map((url, index) => (
                    <TextS_a data={url} key={index} />
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
