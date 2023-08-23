import GithubProvider from "next-auth/providers/github";
import type { AuthOptions } from "next-auth";
import { env } from "../app/env.mjs";
import { AuthAdapter } from "./auth.adapter.js";

export const authOptions: AuthOptions = {
  secret: env.SESSION_SECRET,
  // Set adapter to use here. Can be one of the standard "inbox" adapters,
  // or implement your own as shown by ./auth.adapter.ts. Leave commented
  // out to store session state locally in a cookie (encrypted JWT).
  // adapter: AuthAdapter(), // Note: AuthAdapter is stubbed impl and will fail if not implemented completely
  providers: [
    GithubProvider.default({
      clientId: env.OAUTH_GITHUB_ID,
      clientSecret: env.OAUTH_GITHUB_SECRET,
    }),
  ],
};
