import React, { useState } from "react";
import { Stack, Typography, Button, IconButton } from "@mui/material";
import FormEdit from "./FormModal/FormEdit";
import FormDelete from "./FormModal/FormDelete";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TodoList(props) {
  const {
    todoItems,
    setTodoItemAll,
    setTodoItemsComplete,
    setTodoItemsIncomplete,
  } = props;

  const [dataSelect, setDataSelect] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // EditHandle
  const handleClickOpenEdit = (activity) => {
    setOpenEdit(true);
    setDataSelect(activity);
  };

  // deleteHandle
  const handleClickOpenDelete = (activity) => {
    setOpenDelete(true);
    setDataSelect(activity);
  };

  return (
    <Stack
      spacing={1}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        paddingTop: "30px",
        borderTop: "0.5px dashed #000",
      }}
    >
      {todoItems?.length > 0 ? (
        <>
          {todoItems?.map((item) => (
            <Stack
              key={item?.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  fontWeight: "500",
                  textDecoration: item?.completed ? "line-through red" : "none",
                }}
              >
                ➙ {item?.title}
              </Typography>
              <Stack
                spacing={1}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    handleClickOpenEdit(item);
                  }}
                >
                  Edit
                </Button>

                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => {
                    handleClickOpenDelete(item);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </>
      ) : (
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            fontWeight: "500",
          }}
        >
          You currently have no tasks. Click "ADD TASK" to create a task.
        </Typography>
      )}
      {/* Form */}
      {/* Edit */}
      {openEdit ? (
        <FormEdit
          dataSelect={dataSelect}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          setTodoItemAll={setTodoItemAll}
          setTodoItemsComplete={setTodoItemsComplete}
          setTodoItemsIncomplete={setTodoItemsIncomplete}
        />
      ) : null}

      {/* Delete */}
      {openDelete ? (
        <FormDelete
          dataSelect={dataSelect}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          setTodoItemAll={setTodoItemAll}
          setTodoItemsComplete={setTodoItemsComplete}
          setTodoItemsIncomplete={setTodoItemsIncomplete}
        />
      ) : null}
    </Stack>
  );
}
