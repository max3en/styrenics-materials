import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

// Extend the JWT type used by next-auth internally
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
