import { getPomodoroHandler, createPomodoroSessionHandler } from "@/routes/pomodoro-route";

export async function GET(request: Request) {
  return getPomodoroHandler(request);
}

export async function POST(request: Request) {
  return createPomodoroSessionHandler(request);
}
