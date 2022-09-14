import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import {
  completeTask,
  createTask,
  deleteTask,
  getAllTasks,
  uncompleteTask,
  updateTask,
} from "./tasks.ts";

const app = new Application();

app.get("/api/tasks", getAllTasks);
app.post("/api/tasks/:id/complete", completeTask);
app.delete("/api/tasks/:id/complete", uncompleteTask);
app.post("/api/tasks", createTask);
app.put("/api/tasks/:id", updateTask);
app.delete("/api/tasks/:id", deleteTask);

app.static("/", "public");
app.file("/", "public/index.html");

app.start({
  port: parseInt(Deno.env.get("TODO_APP_PORT") ?? "3000"),
});
