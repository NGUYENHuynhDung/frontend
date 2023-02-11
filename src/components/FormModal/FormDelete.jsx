import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import succes_animation from "../success_animation.json";
import Lottie from "lottie-react";

import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FormDelete(props) {
  const {
    dataSelect,
    openDelete,
    setOpenDelete,
    setTodoItemAll,
    setTodoItemsComplete,
    setTodoItemsIncomplete,
  } = props;
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

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

    await axios
      .delete(`http://127.0.0.1:8000/api/tasks/${dataSelect?.id}/`)
      .then((res) => {
        setIsSubmitSuccess(true);
        setOpenAlertError(false);
        setGetError();
        refreshData();

        // fermer form
        setTimeout(() => {
          setOpenDelete(false);
          setTimeout(() => {
            setIsSubmitSuccess(false);
          }, 1000);
        }, 2000);
      })
      .catch((err) => {
        setOpenAlertError(true);
        setGetError("There are errors ! Please try again !");
        console.clear();
      });
  };

  // handle Fermer
  const handleFermer = () => {
    setOpenDelete(false);
  };

  return (
    <Dialog
      onClose={handleFermer}
      aria-labelledby="customized-dialog-title"
      open={openDelete}
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
        Delete Task
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
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "500" }}>
              Do you really want to delete this task "{dataSelect?.title}" ?
            </Typography>
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
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onSubmitHandle}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
