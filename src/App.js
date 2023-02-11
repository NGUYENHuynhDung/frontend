import React, { useState, useEffect } from "react";
import { Stack, Typography, Button } from "@mui/material";

import SelectTypeBar from "./components/SelectTypeBar";
import TodoList from "./components/TodoList";
import FormCreate from "./components/FormModal/FormCreate";

import axios from "axios";

import AddIcon from "@mui/icons-material/Add";

const options = [
  { id: 1, value: "all", label: "All" },
  { id: 2, value: "complete", label: "Complete" },
  { id: 3, value: "incomplete", label: "Incomplete" },
];

function App() {
  const [selectType, setSelectType] = useState(options?.[0]?.value);
  const [todoItemsAll, setTodoItemAll] = useState([]);
  const [todoItemsComplete, setTodoItemsComplete] = useState([]);
  const [todoItemsIncomplete, setTodoItemsIncomplete] = useState([]);

  useEffect(() => {
    const getData = async () => {
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

    getData();

    return () => {
      setTodoItemsComplete([]);
      setTodoItemsIncomplete([]);
    };
  }, []);

  // CreateHandle
  const [openCreate, setOpenCreate] = useState(false);

  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "#363636",
        padding: "0 20px",
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        sx={{
          background: "#fff",
          width: "100%",
          maxWidth: "700px",
          borderRadius: "5px",
          padding: "30px",
          marginTop: "100px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", width: "100%", marginBottom: "20px" }}
        >
          TODO APP 📔
        </Typography>

        <Stack
          spacing={{ xs: 1, sm: 0 }}
          direction={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "flex-start", sm: "space-between" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ width: "100%", marginBottom: "30px" }}
        >
          <SelectTypeBar
            options={options}
            selectType={selectType}
            setSelectType={setSelectType}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpenCreate}
          >
            Add task
          </Button>
        </Stack>

        {selectType === "all" ? (
          <TodoList
            todoItems={todoItemsAll}
            setTodoItemAll={setTodoItemAll}
            setTodoItemsComplete={setTodoItemsComplete}
            setTodoItemsIncomplete={setTodoItemsIncomplete}
          />
        ) : null}
        {selectType === "complete" ? (
          <TodoList
            todoItems={todoItemsComplete}
            setTodoItemAll={setTodoItemAll}
            setTodoItemsComplete={setTodoItemsComplete}
            setTodoItemsIncomplete={setTodoItemsIncomplete}
          />
        ) : null}
        {selectType === "incomplete" ? (
          <TodoList
            todoItems={todoItemsIncomplete}
            setTodoItemAll={setTodoItemAll}
            setTodoItemsComplete={setTodoItemsComplete}
            setTodoItemsIncomplete={setTodoItemsIncomplete}
          />
        ) : null}
      </Stack>

      {/* Form */}
      {/* Create */}
      {openCreate ? (
        <FormCreate
          openCreate={openCreate}
          setOpenCreate={setOpenCreate}
          setTodoItemAll={setTodoItemAll}
          setTodoItemsComplete={setTodoItemsComplete}
          setTodoItemsIncomplete={setTodoItemsIncomplete}
        />
      ) : null}
    </Stack>
  );
}

export default App;
