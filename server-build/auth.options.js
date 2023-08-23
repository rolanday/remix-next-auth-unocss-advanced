import GithubProvider from "next-auth/providers/github";
import { env } from "../app/env.mjs";
import { AuthAdapter } from "./auth.adapter.js";
const authOptions = {
  secret: env.SESSION_SECRET,
  // Set adapter to use here. Can be one of the standard "inbox" adapters,
  // or implement your own as shown by ./auth.adapter.ts
  adapter: AuthAdapter(),
  providers: [
    GithubProvider.default({
      clientId: env.OAUTH_GITHUB_ID,
      clientSecret: env.OAUTH_GITHUB_SECRET
    })
  ]
};
export {
  authOptions
};
//# sourceMappingURL=auth.options.js.map
