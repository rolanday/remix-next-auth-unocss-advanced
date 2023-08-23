/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: Remove eslint disable directive after completing implementation.
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import createDebug from "debug";

const debug = createDebug("AuthAdapter");

// TODO: Implement this adapter interface for your own database and session management.

export function AuthAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      debug("createUser", user);
      throw new Error("createUser not implemented");
    },
    async getUser(id: string): Promise<AdapterUser | null> {
      debug("getUser", id);
      throw new Error("getUser not implemented");
    },
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      debug("getUserByEmail", email);
      throw new Error("getUserByEmail not implemented");
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<AdapterUser | null> {
      debug("getUserByAccount", provider, providerAccountId);
      throw new Error("getUserByAccount not implemented");
    },
    async updateUser(
      user: Partial<AdapterUser> & Pick<AdapterUser, "id">
    ): Promise<AdapterUser> {
      debug("updateUser", user);
      throw new Error("updateUser not implemented");
    },
    async deleteUser(userId: string) {
      debug("deleteUser", userId);
      throw new Error("deleteUser not implemented");
    },
    async linkAccount(account: AdapterAccount) {
      debug("linkAccount", account);
      throw new Error("linkAccount not implemented");
    },
    async unlinkAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }) {
      debug("unlinkAccount", provider, providerAccountId);
      throw new Error("unlinkAccount not implemented");
    },
    async createSession(session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }): Promise<AdapterSession> {
      debug("createSession", session);
      throw new Error("createSession not implemented");
    },
    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      debug("getSessionAndUser", sessionToken);
      throw new Error("getSessionAndUser not implemented");
    },
    async updateSession({
      sessionToken,
    }: {
      sessionToken: string;
    }): Promise<AdapterSession | null | undefined> {
      debug("updateSession", sessionToken);
      throw new Error("updateSession not implemented");
    },
    async deleteSession(sessionToken: string) {
      debug("deleteSession");
      throw new Error("deleteSession not implemented");
    },
    async createVerificationToken({
      identifier,
      expires,
      token,
    }: {
      identifier: string;
      expires: Date;
      token: string;
    }): Promise<VerificationToken | null | undefined> {
      debug("createVerificationToken", identifier, expires, token);
      throw new Error("createVerificationToken not implemented");
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }): Promise<VerificationToken | null> {
      debug("useVerificationToken", identifier, token);
      throw new Error("useVerificationToken not implemented");
    },
  };
}
