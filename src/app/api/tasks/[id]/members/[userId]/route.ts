import { removeMemberHandler } from "@/routes/task-members-route";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const { id, userId } = await params;
  return removeMemberHandler(request, parseInt(id), parseInt(userId));
}
