import createDebug from "debug";
const debug = createDebug("AuthAdapter");
function AuthAdapter() {
  return {
    async createUser(user) {
      debug("createUser", user);
      throw new Error("createUser not implemented");
    },
    async getUser(id) {
      debug("getUser", id);
      throw new Error("getUser not implemented");
    },
    async getUserByEmail(email) {
      debug("getUserByEmail", email);
      throw new Error("getUserByEmail not implemented");
    },
    async getUserByAccount({
      providerAccountId,
      provider
    }) {
      debug("getUserByAccount", provider, providerAccountId);
      throw new Error("getUserByAccount not implemented");
    },
    async updateUser(user) {
      debug("updateUser", user);
      throw new Error("updateUser not implemented");
    },
    async deleteUser(userId) {
      debug("deleteUser", userId);
      throw new Error("deleteUser not implemented");
    },
    async linkAccount(account) {
      debug("linkAccount", account);
      throw new Error("linkAccount not implemented");
    },
    async unlinkAccount({
      providerAccountId,
      provider
    }) {
      debug("unlinkAccount", provider, providerAccountId);
      throw new Error("unlinkAccount not implemented");
    },
    async createSession(session) {
      debug("createSession", session);
      throw new Error("createSession not implemented");
    },
    async getSessionAndUser(sessionToken) {
      debug("getSessionAndUser", sessionToken);
      throw new Error("getSessionAndUser not implemented");
    },
    async updateSession({
      sessionToken
    }) {
      debug("updateSession", sessionToken);
      throw new Error("updateSession not implemented");
    },
    async deleteSession(sessionToken) {
      debug("deleteSession");
      throw new Error("deleteSession not implemented");
    },
    async createVerificationToken({
      identifier,
      expires,
      token
    }) {
      debug("createVerificationToken", identifier, expires, token);
      throw new Error("createVerificationToken not implemented");
    },
    async useVerificationToken({
      identifier,
      token
    }) {
      debug("useVerificationToken", identifier, token);
      throw new Error("useVerificationToken not implemented");
    }
  };
}
export {
  AuthAdapter
};
//# sourceMappingURL=auth.adapter.js.map
