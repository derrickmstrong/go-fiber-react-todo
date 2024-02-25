import { Box, Flex, List, ThemeIcon } from "@mantine/core";
import { CheckCircleFillIcon, TrashIcon } from "@primer/octicons-react";
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

  async function deleteTodo(id: number) {
    const deleteTodo = await fetch(`${ENDPOINT}/api/todos/${id}`, {
      method: "DELETE",
    }).then((r) => r.json());

    mutate(deleteTodo); // This is the key to updating the UI
  }

  return (
    <>
      <Box
        w={{ base: 200, sm: 400, lg: 500, xl: 700 }}
        px={{ base: "xs", sm: "md", lg: "xl", xl: "2xl" }}
        py={{ base: "xs", sm: "md", lg: "xl", xl: "2xl" }}
        mx="auto"
        my={{ base: "lg", sm: "xl", lg: "2xl", xl: "3xl" }}
        bg={{ base: "blue.7", sm: "orange.7", lg: "green.7", xl: "gray.7" }}
        c="#fff"
        ta="center"
      >
        <List
          spacing="xs"
          size="sm"
          mb={{ base: "lg", sm: "xl", lg: "2xl", xl: "3xl" }}
          center
        >
          {data?.map((todo) => {
            return (
              <Flex
                mih={50}
                gap="sm"
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
                key={`todo_list__${todo.id}`}
              >
                <List.Item
                  onClick={() => markTodoAsCompleted(todo.id)}
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
                  title={todo.body}
                >
                  {todo.completed ? <s>{todo.title}</s> : todo.title}
                </List.Item>
                <ThemeIcon
                  onClick={() => deleteTodo(todo.id)}
                  color="red"
                  size={24}
                  radius="xl"
                >
                  <TrashIcon size={20} />
                </ThemeIcon>
              </Flex>
            );
          })}
        </List>
        <AddTodo mutate={mutate} />
      </Box>
    </>
  );
}

export default App;
