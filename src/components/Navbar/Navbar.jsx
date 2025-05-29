import { useContext, useEffect, useRef, useState } from "react";
import ThemeContext from "../../hooks/ThemeContext";
import AuthContext from "../../hooks/AuthContext";
import avatar from "../../assets/images/emojinoko.jpg";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate, useLocation } from "react-router";
import logo from "../../assets/icons/logo.svg";
import moon from "../../assets/icons/icon-moon.svg";
import selectToggle from "../../assets/icons/selector.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import "./Navbar.scss";

function DayNightToggle() {
  const { isNight, setIsNight } = useContext(ThemeContext);
  return (
    <div className="Dictionary__navbar-toggle">
      <label htmlFor="toggle" className="Dictionary__navbar-toggle__space ">
        <input
          checked={isNight}
          type="checkbox"
          id="toggle"
          onChange={() => {
            setIsNight(() => !isNight);
          }}
        />
        <span className="Dictionary__navbar-toggle__switch"></span>
      </label>
      <img src={moon} alt="moon" className="Dictionary__navbar-toggle__moon" />
    </div>
  );
}
function FontSelector() {
  const { font, setFont } = useContext(ThemeContext);
  const fonts = ["Inter", "Lora", "Incons"];
  const currentIndex = fonts.indexOf(font);

  const handleNext = () => {
    setFont(() => fonts[(currentIndex + 1) % fonts.length]);
  };
  const handlePrev = () => {
    setFont(() => fonts[(currentIndex - 1 + fonts.length) % fonts.length]);
  };

  return (
    <div className={`Dictionary__navbar-font__box`}>
      <button
        className={`Dictionary__navbar-font__toggler Dictionary__navbar-font__toggler--prev `}
        onClick={() => handlePrev()}
      >
        <img src={selectToggle} alt="toggler" />
      </button>
      <span className={`font-bold mx-4 `}>{font}</span>
      <button
        className={`Dictionary__navbar-font__toggler Dictionary__navbar-font__toggler--next `}
        onClick={() => handleNext()}
      >
        <img src={selectToggle} alt="toggler" />
      </button>
    </div>
  );
}

function VistorInterface({ isMobile, isNight }) {
  const [toggle, setToggle] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggle(false);
      }
    };

    if (toggle) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggle]);
  return (
    <div className={`Dictionary__navbar-interface `} ref={menuRef}>
      {isMobile ? (
        <>
          <div className="Dictionary__navbar__space__item">
            <Link to={"/register"}>SignUp</Link>
          </div>
          <div className="Dictionary__navbar__space__item">
            <Link to={"/login"}>Login</Link>
          </div>
        </>
      ) : (
        <nav
          className={` ${
            isNight ? "bg-Black-1" : "bg-white"
          } Dictionary__navbar-interface__menu`}
        >
          <button
            className={`Dictionary__navbar-interface__button ${
              isNight ? "bg-white text-Black-3" : "bg-Black-1 text-white"
            }`}
          >
            <Link to={"/register"}>SignUp</Link>
          </button>
          <button
            className={`Dictionary__navbar-interface__button ${
              isNight ? "bg-purple-600 text-white" : "bg-purple-600 text-white"
            } ml-4`}
          >
            <Link to={"/login"}>Login</Link>
          </button>
        </nav>
      )}
    </div>
  );
}

function UserInterface({ user, logoutHandler, isMobile }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutHandler();
    navigate("/dictionary");
  };

  return (
    <div className={`Dictionary__navbar-interface`}>
      {!isMobile && (
        <div className={`Dictionary__navbar-interface__user `}>
          <img
            className="Dictionary__navbar-interface__avatar"
            src={avatar}
            alt="avatar"
          />
          <span className="mt-1">{user.username}</span>
        </div>
      )}

      {isMobile && (
        <div className="Dictionary__navbar__space__item">
          <form
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              } else {
                event.preventDefault();
                handleLogout();
              }
            }}
          >
            <button type="submit">Logout</button>
          </form>
        </div>
      )}
    </div>
  );
}

function Settings({ isNight, setFont, font, isMobile }) {
  const menuRef = useRef(null);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <div
          className={` ${
            isNight ? "bg-Black-1" : "bg-white"
          } Dictionary__navbar-settings__menu-box `}
        >
          <div className="Dictionary__navbar-settings__menu__item">
            <FontSelector setFont={setFont} font={font} />
          </div>
          <div className="Dictionary__navbar-settings__menu__item">
            <DayNightToggle />
          </div>
        </div>
      ) : (
        <div className={`Dictionary__navbar-settings `} ref={menuRef}>
          <IconButton onClick={() => setToggle(!toggle)}>
            <SettingsIcon />
          </IconButton>

          <nav
            className={`${
              toggle
                ? "Dictionary__navbar-settings__menu--open"
                : "Dictionary__navbar-settings__menu--close"
            } ${
              isNight ? "bg-Black-1" : "bg-white"
            } Dictionary__navbar-settings__menu-box `}
          >
            <div className="Dictionary__navbar-settings__menu__item">
              <FontSelector setFont={setFont} font={font} />
            </div>
            <div className="Dictionary__navbar-settings__menu__item">
              <DayNightToggle />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
export default function Navbar() {
  const { isLoggedIn, user, logoutHandler } = useContext(AuthContext);
  const { isNight } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const hamButtonStyle = {
    color: isNight ? "white" : "gray",
    fontSize: 30,
    marginLeft: "auto",
  };

  const getNavItems = () => {
    switch (location.pathname) {
      case "/":
        return [
          { to: "/dictionary", text: "Dictionary" },
          { to: `/${user?.id}/favorites`, text: "Favorites" },
        ];
      case `/${user?.id}/favorites`:
        return [
          { to: "/", text: "Home" },
          { to: "/dictionary", text: "Dictionary" },
        ];
      case "/dictionary":
        return [
          { to: "/", text: "Home" },
          { to: `/${user?.id}/favorites`, text: "Favorites" },
        ];
      case "/login":
        return [
          { to: "/", text: "Home" },
          { to: "/dictionary", text: "Dictionary" },
        ];
      case "/register":
        return [
          { to: "/", text: "Home" },
          { to: "/dictionary", text: "Dictionary" },
        ];

      default:
        return [
          { to: "/", label: "Home" },
          { to: "/dictionary", label: "Dictionary" },
          { to: `/${user?.id}/favorites`, label: "Favorites" },
        ];
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isWideScreen = window.innerWidth >= 768;
      setIsMobile(!isWideScreen);
      setIsOpen(isWideScreen); // 如果是桌機模式就自動打開選單
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 767) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      ref={menuRef}
      className={`Dictionary__navbar ${
        isNight ? "bg-Black-1 text-white" : "bg-white text-Black-3"
      }  transition duration-400 ease-in-out`}
    >
      <img
        src={logo}
        alt="dictionary__logo"
        className="Dictionary__navbar__logo"
      />

      {isMobile && (
        <MenuIcon
          sx={hamButtonStyle}
          onClick={() => setIsOpen(() => !isOpen)}
        />
      )}
      <div
        className={`Dictionary__navbar__space 
          ${isNight ? "bg-Black-1 " : "bg-white "}
          ${
            isOpen
              ? "Dictionary__navbar__space--open"
              : "Dictionary__navbar__space--close"
          } 
        `}
      >
        {getNavItems().map((item, index) => (
          <div key={index} className="Dictionary__navbar__space__item">
            <Link to={`${item.to}`}>{item.text}</Link>
          </div>
        ))}
        <div className="Dictionary__navbar__space__item Dictionary__navbar__space__item--flex">
          {isLoggedIn ? (
            <UserInterface
              user={user}
              isNight={isNight}
              logoutHandler={logoutHandler}
              isMobile={isMobile}
            />
          ) : (
            <VistorInterface isMobile={isMobile} isNight={isNight} />
          )}
          <div className="flex items-center">
            {location.pathname !== "/register" &&
              location.pathname !== "/login" && (
                <div className="Dictionary__navbar__space__icon">
                  <Settings isNight={isNight} isMobile={isMobile} />
                </div>
              )}
            <div
              className={`Dictionary__navbar__space__icon ${
                isMobile ? "hidden" : ""
              }`}
            >
              <form
                onSubmit={(event) => {
                  if (!confirm("Are you sure you want to logout?")) {
                    event.preventDefault();
                  } else {
                    event.preventDefault();
                    handleLogout();
                  }
                }}
              >
                <IconButton type="submit">
                  <LogoutIcon />
                </IconButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
