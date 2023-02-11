import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import succes_animation from "../success_animation.json";
import Lottie from "lottie-react";

import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FormEdit(props) {
  const {
    dataSelect,
    openEdit,
    setOpenEdit,
    setTodoItemAll,
    setTodoItemsComplete,
    setTodoItemsIncomplete,
  } = props;
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [checkComplete, setCheckComplete] = useState(false);

  // Alert Error Handle
  const [getError, setGetError] = useState();
  const [openAlertError, setOpenAlertError] = useState(false);
  const vertical = "top";
  const horizontal = "center";
  const handleCloseAlertError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlertError(false);
    setGetError();
  };

  // get Data
  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`http://127.0.0.1:8000/api/tasks/${dataSelect?.id}/`)
        .then((res) => {
          setTitle(res?.data?.title);
          setDescription(res?.data?.description);
          setCheckComplete(res?.data?.completed);
        })
        .catch((err) => {
          console.clear();
        });
    };

    getData();
  }, [dataSelect?.id]);

  // Refresh state
  useEffect(() => {
    setGetError();
    setOpenAlertError(false);
    setIsSubmitSuccess(false);
  }, [dataSelect]);

  // handle submit
  const refreshData = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/tasks/")
      .then((response) => {
        const todoItems = response.data;
        setTodoItemAll(todoItems);
        setTodoItemsComplete(todoItems?.filter((item) => item?.completed));
        setTodoItemsIncomplete(todoItems?.filter((item) => !item?.completed));
      })
      .catch((err) => {
        console.clear();
      });
  };

  const onSubmitHandle = async (event) => {
    event.preventDefault();

    if (title === "") {
      setOpenAlertError(true);
      setGetError("Task's name must be filled !");
      return;
    }

    if (description === "") {
      setOpenAlertError(true);
      setGetError("Task's description must be filled !");
      return;
    }

    const data_request = {
      title: title,
      description: description,
      completed: checkComplete,
    };

    await axios
      .put(`http://127.0.0.1:8000/api/tasks/${dataSelect?.id}/`, data_request)
      .then((res) => {
        setIsSubmitSuccess(true);
        setOpenAlertError(false);
        setGetError();
        refreshData();

        // fermer form
        setTimeout(() => {
          setOpenEdit(false);
          setTimeout(() => {
            setIsSubmitSuccess(false);
            setTitle("");
            setDescription("");
            setCheckComplete(false);
          }, 1000);
        }, 2000);
      })
      .catch((err) => {
        setOpenAlertError(true);
        setGetError(
          "There are errors ! Please verify the information on the form."
        );
        console.clear();
      });
  };

  // handle Fermer
  const handleFermer = () => {
    setOpenEdit(false);
  };

  return (
    <Dialog
      onClose={handleFermer}
      aria-labelledby="customized-dialog-title"
      open={openEdit}
      sx={{
        "& .MuiDialog-paperScrollPaper": {
          width: "100%",
          overflow: "auto",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "0.4rem",
            height: "0.4rem",
          },
          "&::-webkit-scrollbar-track": {
            background: "#fff",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--color-blue-marine-hover)",
          },
        },
      }}
    >
      <DialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2 }}>
        Edit Task
        <IconButton
          aria-label="close"
          onClick={handleFermer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form>
        {isSubmitSuccess ? (
          <DialogContent
            dividers
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "350px",
              display: "flex",
              direction: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Lottie
              loop={false}
              animationData={succes_animation}
              style={{ height: "200px", width: "200px" }}
            />
          </DialogContent>
        ) : (
          <DialogContent dividers>
            {/* Title */}
            <TextField
              name="name"
              label="Task's name"
              sx={{ width: "100%", marginBottom: "15px" }}
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            {/* Description */}
            <TextField
              name="description"
              label="Task's description"
              sx={{ width: "100%", marginBottom: "5px" }}
              type="text"
              multiline
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            {/* Complete */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkComplete}
                  onChange={(event) => setCheckComplete(event.target.checked)}
                />
              }
              label="Complete"
            />
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openAlertError}
              autoHideDuration={5000}
              onClose={handleCloseAlertError}
            >
              <Alert
                onClose={handleCloseAlertError}
                severity="error"
                sx={{ width: "100%" }}
              >
                {getError}
              </Alert>
            </Snackbar>
          </DialogContent>
        )}
      </form>
      <DialogActions>
        {isSubmitSuccess ? null : (
          <Button
            size="large"
            variant="contained"
            type="submit"
            startIcon={<AddIcon />}
            onClick={onSubmitHandle}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
