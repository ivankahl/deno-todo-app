import { Context, HandlerFunc } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import Task from "./interfaces/Task.ts";

/** Reads all the tasks from the JSON file */
async function readTasks(): Promise<Task[]> {
  return JSON.parse(await Deno.readTextFile("./tasks.json")) as Task[];
}

/** Writes all the tasks to the JSON file (overwrites) */
async function saveTasks(tasks: Task[]): Promise<void> {
  await Deno.writeTextFile("./tasks.json", JSON.stringify(tasks));
}

/** Retrieve all the tasks in the JSON file */
export const getAllTasks: HandlerFunc = async (ctx: Context) => {
  const tasks = await readTasks();

  return ctx.json(tasks, 200);
};

/** Create a new task and save it */
export const createTask: HandlerFunc = async (ctx: Context) => {
  // Get the task description
  const { description } = (await ctx.body) as Task;

  // Create a new task object which we can save
  const newTask: Task = {
    id: crypto.randomUUID(),
    description,
    createdDate: new Date(),
    complete: false,
    completedDate: null,
  };

  // Read the current tasks in the file
  const tasks = await readTasks();

  // Update the list of tasks from the file to include the new task
  const newTasks = [...tasks, newTask];

  // Save the new list of tasks back to the file
  await saveTasks(newTasks);

  // Return the new task
  return ctx.json(newTask, 200);
};

/** Marks the specified task as complete and saves it to the JSON file */
export const completeTask: HandlerFunc = async (ctx: Context) => {
  // Retrieve the task ID that should be completed
  const { id } = ctx.params;

  const tasks = await readTasks();

  // Find the specified task in the list of saved tasks. If the task is
  // not found, return a 404 response
  const index = tasks.findIndex((t) => t.id == id);

  if (index === -1) {
    return ctx.json({ message: "Task not found" }, 404);
  }

  // If the task is found, set it to complete and update the completed date
  // to the current date
  tasks[index].complete = true;
  tasks[index].completedDate = new Date();

  await saveTasks(tasks);

  // Return the completed task
  return ctx.json(tasks[index], 200);
};

/** Marks the specified task as incomplete and saves it to the JSON file */
export const uncompleteTask: HandlerFunc = async (ctx: Context) => {
  // Retrieve the task ID that should be marked as incomplete
  const { id } = ctx.params;

  const tasks = await readTasks();

  // Find the specified task in the list of saved tasks. If the task is
  // not found, return a 404 response
  const index = tasks.findIndex((t) => t.id == id);

  if (index === -1) {
    return ctx.json({ message: "Task not found" }, 404);
  }

  // If the task is found, set it to incomplete and clear the completed
  // date
  tasks[index].complete = false;
  tasks[index].completedDate = null;

  await saveTasks(tasks);

  // Return the completed task
  return ctx.json(tasks[index], 200);
};

/** Updates the description of the specified task */
export const updateTask: HandlerFunc = async (ctx: Context) => {
  // Retrieve the task ID from the path parameters and the description from
  // the request body.
  const { id } = ctx.params;
  const { description } = (await ctx.body) as Task;

  const tasks = await readTasks();

  // Find the specified task in the list of saved tasks. If the task is
  // not found, return a 404 response
  const index = tasks.findIndex((t) => t.id == id);

  if (index === -1) {
    return ctx.json({ message: "Task not found" }, 404);
  }

  // Update the task description
  tasks[index].description = description;

  await saveTasks(tasks);

  // Return the updated task
  return ctx.json(tasks[index], 200);
};

/** Deletes the specified task from the JSON file */
export const deleteTask: HandlerFunc = async (ctx: Context) => {
  // Retrieve the ID of the task to delete
  const { id } = ctx.params;

  const tasks = await readTasks();

  // Find the specified task in the list of saved tasks. If the task is
  // not found, return a 404 response
  const task = tasks.find((t) => t.id == id);
  if (!task) {
    return ctx.json({ message: "Task not found" }, 404);
  }

  // Filter the specified task out of the list of tasks and save it
  const updatedTasks = tasks.filter((t) => t.id != id);
  await saveTasks(updatedTasks);

  // Return a success message
  return ctx.json({ message: "Task deleted successfully" }, 200);
};
