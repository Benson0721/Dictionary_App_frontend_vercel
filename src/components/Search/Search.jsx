import search from "../../assets/icons/icon-search.svg";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { searchRule } from "../../utils/Rules.js";
import DictionaryContext from "../../hooks/DictionaryContext.jsx";
import ThemeContext from "../../hooks/ThemeContext.jsx";
import { fetchWordData } from "../../apis/fetchWordData.js";
import { useContext, useEffect, useCallback } from "react";
import "./Search.scss";

export default function Search({ setIsSuccess, currentSearch, handleSearch }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: joiResolver(searchRule) });

  const { word, WordHandler } = useContext(DictionaryContext);
  const { isNight } = useContext(ThemeContext);

  const onSubmit = useCallback(async () => {
    try {
      const word = watch("word");
      const data = await fetchWordData(word);
      WordHandler(data);
      handleSearch(word);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
    }
  }, [watch, WordHandler, handleSearch, setIsSuccess]);

  useEffect(() => {
    setValue("word", currentSearch);
  }, [currentSearch, word]);

  return (
    <div className="Dictionary__search mb-3 md:mb-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("word")}
          placeholder="Search for any word..."
          className={`Dictionary__search__input focus-within:outline-Purple-1 ${
            errors.word && "border-2 border-Orange-1"
          } ${isNight ? "bg-Black-2 text-white" : "bg-Gray-3"}`}
        />
        {errors.word && (
          <p
            className=" text-Orange-1 text-[16px]  ml-auto"
            aria-live="polite"
            role="alert"
          >
            {errors.word?.message}
          </p>
        )}
        <button type="submit" className="Dictionary__search__button">
          <img src={search} alt="search_img" />
        </button>
      </form>
    </div>
  );
}
