import { getCurrentUserHandler } from "@/routes/users-route";

export async function GET(request: Request) {
  return getCurrentUserHandler(request);
}
