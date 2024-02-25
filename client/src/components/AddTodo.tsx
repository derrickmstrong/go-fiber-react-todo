import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Group, TextInput, Textarea, Center } from "@mantine/core";
import { ENDPOINT, Todo } from "../App";
import { KeyedMutator } from "swr";

function AddTodo({ mutate }: { mutate: KeyedMutator<Todo[]> }) {
  const [opened, { open, close }] = useDisclosure(false); // This is a hook from Mantine that helps us manage the state of the modal

  const form = useForm({
    initialValues: {
      title: "",
      body: "",
    },
  });

  async function createTodo(values: { title: string; body: string }) {
    const createTodo = await fetch(`${ENDPOINT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values), // Send the form data as JSON
    }).then((r) => r.json()); // Parse the JSON response

    mutate(createTodo); // This is the key to updating the UI
    form.reset(); // Reset the form
    close(); // Close the modal
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Todo">
        <form onSubmit={form.onSubmit(createTodo)}>
          <TextInput
            required
            mb={12}
            label="Todo"
            placeholder="What do you want to do?"
            {...form.getInputProps("title")}
          />
          <Textarea
            required
            mb={12}
            label="Body"
            placeholder="Tell me more..."
            {...form.getInputProps("body")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Create Todo</Button>
          </Group>
        </form>
      </Modal>
      <Center>
        <Button onClick={open}>ADD TODO</Button>
      </Center>
    </>
  );
}

export default AddTodo;
