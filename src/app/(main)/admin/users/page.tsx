import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { UserManagement } from "@/components/admin/user-management";

export default async function AdminUsersPage() {
  await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and roles
        </p>
      </div>
      <UserManagement initialUsers={users} />
    </div>
  );
}
