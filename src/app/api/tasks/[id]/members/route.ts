import { getMembersHandler, addMemberHandler } from "@/routes/task-members-route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getMembersHandler(request, parseInt(id));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return addMemberHandler(request, parseInt(id));
}
