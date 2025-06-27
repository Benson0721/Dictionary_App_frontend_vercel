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
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LoginIcon from "@mui/icons-material/Login";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const { user } = useContext(AuthContext);

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
    <div className={`Dictionary__navbar-interface gap-4`} ref={menuRef}>
      {isMobile ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {location.pathname === "/" ? (
              <IconButton type="button" onClick={() => navigate("/dictionary")}>
                <AutoStoriesIcon
                  sx={{ color: isNight ? "white" : "#2d2d2d" }}
                />
              </IconButton>
            ) : (
              <IconButton type="button" onClick={() => navigate("/")}>
                <HomeIcon sx={{ color: isNight ? "white" : "#2d2d2d" }} />
              </IconButton>
            )}

            <IconButton
              type="button"
              onClick={() => navigate(`/${user?.id}/favorites`)}
            >
              <FavoriteIcon sx={{ color: isNight ? "white" : "#2d2d2d" }} />
            </IconButton>
          </div>
          <div className="flex gap-4">
            <IconButton type="button" onClick={() => navigate("/register")}>
              <AppRegistrationIcon
                sx={{ color: isNight ? "white" : "#2d2d2d" }}
              />
            </IconButton>

            <IconButton type="button" onClick={() => navigate("/login")}>
              <LoginIcon sx={{ color: isNight ? "white" : "purple" }} />
            </IconButton>
          </div>
        </div>
      ) : (
        <nav
          className={` ${
            isNight ? "bg-Black-1" : "bg-white"
          } Dictionary__navbar-interface__menu`}
        >
          {location.pathname === "/dictionary" && (
            <IconButton type="button" onClick={() => navigate("/")}>
              <HomeIcon sx={{ color: isNight ? "white" : "#2d2d2d" }} />
            </IconButton>
          )}
          <IconButton type="button" onClick={() => navigate("/register")}>
            <AppRegistrationIcon
              sx={{ color: isNight ? "white" : "#2d2d2d" }}
            />
          </IconButton>

          <IconButton type="button" onClick={() => navigate("/login")}>
            <LoginIcon sx={{ color: isNight ? "white" : "purple" }} />
          </IconButton>
        </nav>
      )}
    </div>
  );
}

function UserInterface({ user, logoutHandler, isMobile }) {
  const navigate = useNavigate();
  const { isNight } = useContext(ThemeContext);

  const handleLogout = async () => {
    await logoutHandler();
    navigate("/dictionary");
  };

  const getSettingItems = () => {
    switch (location.pathname) {
      case "/":
        return [{ to: `/${user?.id}/favorites`, icon: FavoriteIcon }];
      case `/${user?.id}/favorites`:
        return [
          { to: "/", icon: HomeIcon },
          isMobile ? { to: "/dictionary", icon: AutoStoriesIcon } : null,
        ];

      case "/dictionary":
        return [
          { to: "/", icon: HomeIcon },
          isMobile
            ? { to: `/${user?.id}/favorites`, icon: FavoriteIcon }
            : null,
        ];
      case "/login":
        return [
          { to: "/", icon: HomeIcon },
          { to: "/dictionary", icon: AutoStoriesIcon },
        ];
      case "/register":
        return [
          { to: "/", icon: HomeIcon },
          { to: "/dictionary", icon: AutoStoriesIcon },
        ];

      default:
        return [
          { to: "/", icon: HomeIcon },
          { to: "/dictionary", icon: AutoStoriesIcon },
          { to: `/${user?.id}/favorites`, icon: FavoriteIcon },
        ];
    }
  };

  return (
    <div className={`Dictionary__navbar-interface`}>
      <div className="flex gap-4">
        {getSettingItems().map((item, index) =>
          item === null ? null : (
            <div key={index}>
              <IconButton
                onClick={() => navigate(item.to)}
                sx={{
                  color: isNight ? "white" : "#2d2d2d",
                }}
              >
                <item.icon />
              </IconButton>
            </div>
          )
        )}
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
          <IconButton type="submit">
            <LogoutIcon sx={{ color: isNight ? "white" : "#2d2d2d" }} />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

function Settings({
  isNight,
  setFont,
  font,
  isMobile,
  isLoggedIn,
  user,
  logoutHandler,
}) {
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
            isNight ? "bg-Black-3" : "bg-white"
          } Dictionary__navbar-settings__menu-box `}
        >
          {isLoggedIn && (
            <>
              <div className={`Dictionary__navbar-interface__user `}>
                <img
                  className="Dictionary__navbar-interface__avatar"
                  src={avatar}
                  alt="avatar"
                />
                <span className="mt-1">{user?.username}</span>
              </div>
              <hr className="absolute top-16 left-0 w-full border-Gray-4 border-1 mb-1" />
            </>
          )}

          <div className="Dictionary__navbar-settings__menu__item">
            <FontSelector setFont={setFont} font={font} />
          </div>

          <div className="Dictionary__navbar-settings__menu__item">
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
          </div>
        </div>
      ) : (
        <div className={`Dictionary__navbar-settings `} ref={menuRef}>
          <IconButton onClick={() => setToggle(!toggle)}>
            <SettingsIcon sx={{ color: isNight ? "white" : "#2d2d2d" }} />
          </IconButton>

          <div
            className={`${
              toggle
                ? "Dictionary__navbar-settings__menu--open"
                : "Dictionary__navbar-settings__menu--close"
            } ${
              isNight ? "bg-Black-1" : "bg-white"
            } Dictionary__navbar-settings__menu-box `}
          >
            {isLoggedIn && (
              <>
                <div className={`Dictionary__navbar-interface__user `}>
                  <img
                    className="Dictionary__navbar-interface__avatar"
                    src={avatar}
                    alt="avatar"
                  />
                  <span className="mt-1">{user?.username}</span>
                </div>
                <hr className="absolute top-16 w-full border-Gray-4 border-1 mb-1" />
              </>
            )}

            <div className="Dictionary__navbar-settings__menu__item">
              <FontSelector setFont={setFont} font={font} />
            </div>

            <div className="Dictionary__navbar-settings__menu__item">
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
            </div>
          </div>
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
  const navigate = useNavigate();
  const hamButtonStyle = {
    color: isNight ? "white" : "gray",
    fontSize: 30,
    marginLeft: "32px",
  };

  const getNavItems = () => {
    switch (location.pathname) {
      case "/":
        return [
          !isMobile ? { to: "/dictionary", icon: AutoStoriesIcon } : null,
        ];
      case `/${user?.id}/favorites`:
        return [
          !isMobile ? { to: "/dictionary", icon: AutoStoriesIcon } : null,
        ];
      case "/dictionary":
        return [
          !isMobile
            ? { to: `/${user?.id}/favorites`, icon: FavoriteIcon }
            : null,
        ];
      case "/login":
        return [
          { to: "/", icon: HomeIcon },
          { to: "/dictionary", icon: AutoStoriesIcon },
        ];
      case "/register":
        return [
          { to: "/", icon: HomeIcon },
          { to: "/dictionary", icon: AutoStoriesIcon },
        ];

      default:
        return [
          { to: "/", icon: HomeIcon },
          { to: "/dictionary", icon: AutoStoriesIcon },
          { to: `/${user?.id}/favorites`, icon: FavoriteIcon },
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
        isNight ? "bg-Black-3 text-white" : "bg-white text-Black-3"
      }  transition duration-400 ease-in-out`}
    >
      <img
        src={logo}
        alt="dictionary__logo"
        className="Dictionary__navbar__logo"
      />
      <div className="ml-auto">
        <DayNightToggle />
      </div>

      {isMobile && (
        <MenuIcon
          sx={hamButtonStyle}
          onClick={() => setIsOpen(() => !isOpen)}
        />
      )}
      <div
        className={`Dictionary__navbar__space 
          ${isNight ? "bg-Black-3 " : "bg-white "}
          ${
            isOpen
              ? "Dictionary__navbar__space--open"
              : "Dictionary__navbar__space--close"
          } 
        `}
      >
        <div className=" md:ml-6">
          <div className="flex sm:flex-col md:flex-row items-center">
            <div className="order-1 md:order-2">
              {location.pathname !== "/register" &&
                location.pathname !== "/login" && (
                  <div className="Dictionary__navbar__space__icon">
                    <Settings
                      isNight={isNight}
                      isMobile={isMobile}
                      isLoggedIn={isLoggedIn}
                      user={user}
                      logoutHandler={logoutHandler}
                    />
                  </div>
                )}
            </div>
            <div className="flex flex-col gap-4 items-center order-2 md:order-1   ">
              {
                <div className="flex items-center gap-4 md:gap-0">
                  {getNavItems().map((item, index) =>
                    item === null ? null : (
                      <div key={index}>
                        <IconButton
                          onClick={() => navigate(item.to)}
                          sx={{
                            color: isNight ? "white" : "#2d2d2d",
                          }}
                        >
                          <item.icon />
                        </IconButton>
                      </div>
                    )
                  )}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
