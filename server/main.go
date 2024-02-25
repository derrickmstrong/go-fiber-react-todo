package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// Create todo struct
type Todo struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Body      string `json:"body"`
	Completed bool   `json:"completed"`
}

// Create a list of todos
var todos []Todo

func main() {

	// Create the server
	app := fiber.New()

	// Enable CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Create a healthcheck route
	app.Get("/healthcheck", healthCheck)

	// Get all todos
	app.Get("/api/todos", getTodos)

	// Create a todo
	app.Post("/api/todos", createTodo)

	// Update a todo by id (mark as completed)
	app.Patch("/api/todos/:id/completed", updateTodo)

	// Delete a todo by id
	app.Delete("/api/todos/:id", deleteTodo)

	// Start the server
	log.Fatal(app.Listen(":4000"))
}

// Healthcheck route
func healthCheck(c *fiber.Ctx) error {
	return c.SendString("OK")
}

// Get all todos
func getTodos(c *fiber.Ctx) error {
	return c.JSON(todos)
}

// Create a todo
func createTodo(c *fiber.Ctx) error {
	// Create a new todo
	todo := &Todo{}

	// Parse the body into the todo
	if err := c.BodyParser(todo); err != nil {
		return c.Status(400).SendString("Invalid todo")
	}

	// Set the id of the todo to the length of the todos + 1
	todo.ID = len(todos) + 1

	// Append the todo to the list of todos (dereference the pointer)
	todos = append(todos, *todo)

	// Return the new todo
	return c.JSON(todos)
}

// Update a todo by id (mark as completed)
func updateTodo(c *fiber.Ctx) error {
	// Get the id from the url
	id, err := c.ParamsInt("id")

	// If there is an error, return a 400
	if err != nil {
		return c.Status(400).SendString("Invalid id")
	}

	// Loop through the todos
	for i, t := range todos {
		// If the id of the todo is equal to the id from the url
		if t.ID == id {
			// Mark the todo as completed
			todos[i].Completed = true
			break
		}
	}

	// Return the updated todo
	return c.JSON(todos)
}

// Delete a todo by id
func deleteTodo(c *fiber.Ctx) error {
	// Get the id from the url
	id, err := c.ParamsInt("id")

	// If there is an error, return a 400
	if err != nil {
		return c.Status(400).SendString("Invalid id")
	}

	// Loop through the todos
	for i, t := range todos {
		// If the id of the todo is equal to the id from the url
		if t.ID == id {
			// Remove the todo from the list of todos
			todos = append(todos[:i], todos[i+1:]...)
			break
		}
	}

	// Return the updated list of todos
	return c.JSON(todos)
}
