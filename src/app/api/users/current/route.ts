import { getCurrentUserHandler, updateCurrentUserHandler } from "@/routes/users-route";

export async function GET(request: Request) {
  return getCurrentUserHandler(request);
}

export async function PUT(request: Request) {
  return updateCurrentUserHandler(request);
}
