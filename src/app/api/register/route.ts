import { registerHandler } from "@/routes/users-route";

export async function POST(request: Request) {
  return registerHandler(request);
}
