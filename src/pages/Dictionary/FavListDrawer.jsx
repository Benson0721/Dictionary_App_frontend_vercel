import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import * as Icons from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconsDialog from "../FavoritePage/IconsDialog";
import FavoriteListsContext from "../../hooks/FavoriteListsContext";
import FavoriteWordsContext from "../../hooks/FavoriteWordsContext";
import DictionaryContext from "../../hooks/DictionaryContext";
import { pink } from "@mui/material/colors";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function FavListDrawer({ openDrawer, setOpenDrawer }) {
  const [inputList, setInputList] = useState("");
  const [mode, setMode] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedListID, setSelectedListID] = useState(null);
  const [curWord, setCurWord] = useState(null);
  const [curWordList, setCurWordList] = useState([]);

  const { lists, setLists, addLists, updateLists, deleteLists } =
    useContext(FavoriteListsContext);
  const { addFavWord, allFavoriteWords, setIsFav } =
    useContext(FavoriteWordsContext);
  const { word } = useContext(DictionaryContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const Icon = useMemo(() => Icons[selectedIcon], [selectedIcon]);

  const { vocabulary, phonetics, meanings } = word;

  const curWordData = useMemo(() => {
    if (word.vocabulary && word.meanings) {
      return {
        word: vocabulary,
        phonetic: phonetics?.text,
        audio: phonetics?.audio,
        meaning: meanings[0]?.definitions[0]?.definition,
      };
    }
    return null;
  }, [vocabulary, phonetics, meanings]);

  useEffect(() => {
    if (curWordData) {
      setCurWord(curWordData);
      const isWordFavorited = allFavoriteWords?.some(
        (fav) => fav.word === word.vocabulary
      );
      setIsFav(isWordFavorited);

      const foundFav = allFavoriteWords?.find(
        (fav) => fav.word === word.vocabulary
      );
      setCurWordList(foundFav?.favoriteLists || []);
    }
  }, [curWordData, word.vocabulary, allFavoriteWords]);

  const resetForm = useCallback(() => {
    setInputList("");
    setMode(null);
    setSelectedIcon(null);
  }, []);

  const handleCreate = useCallback(
    async (name, icon) => {
      await addLists({ name, icon });
      resetForm();
    },
    [addLists, resetForm]
  );

  const handleEdit = useCallback(
    async (updatedLists) => {
      await updateLists(updatedLists);
      resetForm();
    },
    [updateLists, resetForm]
  );

  const handleCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleDelete = useCallback(
    async (id) => {
      await deleteLists(id);
    },
    [deleteLists]
  );

  const heartStyle = useMemo(
    () => ({
      color: pink[500],
      fontSize: 20,
    }),
    []
  );

  const DrawerList = (
    <Box
      sx={{
        width: isMobile ? "100vw" : "400px",
        height: isMobile ? "50vh" : "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      <List>
        {lists?.map((list) => {
          const Icon = Icons[list?.icon];
          return mode === "edit" ? (
            <ListItem disablePadding key={list._id}>
              <ListItemButton>
                <ListItemIcon>
                  <IconButton
                    onClick={() => {
                      setOpenDialog(true);
                      setSelectedListID(list._id);
                    }}
                  >
                    <Icon />
                  </IconButton>
                </ListItemIcon>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={list.name}
                  onChange={(e) =>
                    setLists((prevLists) =>
                      prevLists.map((item) =>
                        item._id === list._id
                          ? { ...item, name: e.target.value }
                          : item
                      )
                    )
                  }
                  placeholder="Enter new list name"
                />

                <IconButton
                  color="error"
                  onClick={() => handleDelete(list._id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem key={list._id} disablePadding>
              <ListItemButton onClick={() => addFavWord(list._id, curWord)}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={list.name} />
                {curWordList.includes(list._id) ? (
                  <FavoriteIcon sx={heartStyle} />
                ) : (
                  <FavoriteBorderIcon sx={heartStyle} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}

        {mode === "create" && (
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <IconButton onClick={() => setOpenDialog(true)}>
                  {selectedIcon ? <Icon /> : <AddIcon />}
                </IconButton>
              </ListItemIcon>
              <TextField
                fullWidth
                variant="outlined"
                value={inputList}
                onChange={(e) => setInputList(e.target.value)}
                placeholder="Enter new list name"
              />
              <IconButton
                color="success"
                disabled={!inputList || !selectedIcon}
                onClick={() => handleCreate(inputList, selectedIcon)}
              >
                <CheckIcon />
              </IconButton>
              <IconButton color="error" onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </ListItemButton>
          </ListItem>
        )}
      </List>

      <Box
        sx={{
          mt: "auto",
          p: 2,
          display: "flex",
          gap: 1,
          justifyContent: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <Divider />
        {mode === "edit" ? (
          <Button
            variant="contained"
            sx={{ flexGrow: 1 }}
            onClick={() => handleEdit(lists)}
            color="success"
          >
            <CheckIcon />
            End edit
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              sx={{ flexGrow: 1 }}
              onClick={() => setMode("create")}
              disabled={mode == "create"} // 防止重複點擊
            >
              Create
            </Button>
            <Button
              variant="contained"
              sx={{ flexGrow: 1 }}
              onClick={() => {
                setMode("edit");
              }}
              disabled={mode == "edit"}
              color="success"
            >
              Edit
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <div>
      <IconsDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setSelectedIcon={setSelectedIcon}
        selectedIcon={selectedIcon}
        selectedListID={selectedListID}
        setLists={setLists}
      />
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setMode(null);
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
