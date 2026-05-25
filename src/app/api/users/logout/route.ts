import { logoutHandler } from "@/routes/users-route";

export async function DELETE(request: Request) {
  return logoutHandler(request);
}
