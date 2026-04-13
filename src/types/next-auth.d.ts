import type { SubscriptionTier } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      tier: SubscriptionTier;
    };
  }

  interface User {
    tier?: SubscriptionTier;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tier: SubscriptionTier;
  }
}
