import { Box, Center, List, ThemeIcon } from "@mantine/core";
import { CheckCircleFillIcon } from "@primer/octicons-react";
import useSWR from "swr";
import "./App.css";
import AddTodo from "./components/AddTodo";

export interface Todo {
  id: number;
  title: string;
  body: string;
  completed: boolean;
}

export const ENDPOINT = "http://localhost:4000";

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json());

function App() {
  const { data, mutate } = useSWR<Todo[]>("api/todos", fetcher);

  async function markTodoAsCompleted(id: number) {
    const updateTodo = await fetch(`${ENDPOINT}/api/todos/${id}/completed`, {
      method: "PATCH",
    }).then((r) => r.json());

    mutate(updateTodo); // This is the key to updating the UI
  }

  return (
    <Center
      // maw={{ base: 200, sm: 400, lg: 500, xl: 700 }}
      h={675}
      bg="var(--mantine-color-gray-light)"
    >
      <Box
        w={{ base: 200, sm: 400, lg: 500, xl: 700 }}
        px={{ base: "xs", sm: "md", lg: "xl", xl: "2xl" }}
        py={{ base: "xs", sm: "md", lg: "xl", xl: "2xl" }}
        bg={{ base: "blue.7", sm: "red.7", lg: "green.7", xl: "gray.7" }}
        c="#fff"
        // ta="center"
        mx="auto"
      >
        <List
          spacing="xs"
          size="sm"
          mb={{ base: "lg", sm: "xl", lg: "2xl", xl: "3xl" }}
          center
        >
          {data?.map((todo) => {
            return (
              <List.Item
                onClick={() => markTodoAsCompleted(todo.id)}
                key={`todo_list__${todo.id}`}
                icon={
                  todo.completed ? (
                    <ThemeIcon color="teal" size={24} radius="xl">
                      <CheckCircleFillIcon size={20} />
                    </ThemeIcon>
                  ) : (
                    <ThemeIcon color="gray" size={24} radius="xl">
                      <CheckCircleFillIcon size={20} />
                    </ThemeIcon>
                  )
                }
              >
                {todo.completed ? <s>{todo.title}</s> : todo.title}
              </List.Item>
            );
          })}
        </List>
        <AddTodo mutate={mutate} />
      </Box>
    </Center>
  );
}

export default App;
