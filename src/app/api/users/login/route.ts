import { loginHandler } from "@/routes/users-route";

export async function POST(request: Request) {
  return loginHandler(request);
}
