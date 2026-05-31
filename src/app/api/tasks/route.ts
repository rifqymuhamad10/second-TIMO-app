import { getTasksHandler, createTaskHandler } from "@/routes/tasks-route";

export async function GET(request: Request) {
  return getTasksHandler(request);
}

export async function POST(request: Request) {
  return createTaskHandler(request);
}
