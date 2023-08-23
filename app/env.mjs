import { z } from "zod";

export const AWSRegionSchema = z.enum(["us-east-1", "us-west-2"]);

const server = z.object({
  BASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  OAUTH_GITHUB_ID: z.string(),
  OAUTH_GITHUB_SECRET: z.string(),
  SESSION_SECRET: z.string().min(16),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  AWS_REGION: process.env.AWS_REGION,
  BASE_URL: process.env.BASE_URL,
  CDN_MEDIA_ROOT: process.env.CDN_MEDIA_ROOT,
  CDN_PUBLIC_ROOT: process.env.CDN_PUBLIC_ROOT,
  CUID2_FINGERPRINT: process.env.CUID2_FINGERPRINT,
  NODE_ENV: process.env.NODE_ENV,
  OAUTH_GITHUB_ID: process.env.OAUTH_GITHUB_ID,
  OAUTH_GITHUB_SECRET: process.env.OAUTH_GITHUB_SECRET,
  OAUTH_GOOGLE_ID: process.env.OAUTH_GOOGLE_ID,
  OAUTH_GOOGLE_SECRET: process.env.OAUTH_GOOGLE_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_ACCESS_KEY_SECRET: process.env.S3_ACCESS_KEY_SECRET,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_DROPBOX: process.env.S3_DROPBOX,
  S3_PRESIGN_TTL: process.env.S3_PRESIGN_TTL,
  S3_MEDIA: process.env.S3_MEDIA,
  S3_PUBLIC: process.env.S3_PUBLIC,
  SESSION_SECRET: process.env.SESSION_SECRET,
  REDIS_URL: process.env.REDIS_URL,
};

// Don't touch the part below
// --------------------------
const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

const isServer = typeof window === "undefined";

const parsed = /** @type {MergedSafeParseReturn} */ (
  isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
);

if (parsed.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

env = new Proxy(parsed.data, {
  get(target, prop) {
    if (typeof prop !== "string") return undefined;
    // Throw a descriptive error if a server-side env var is accessed on the client
    // Otherwise it would just be returning `undefined` and be annoying to debug
    if (!isServer && !prop.startsWith("PUBLIC_"))
      throw new Error(
        process.env.NODE_ENV === "production"
          ? "❌ Attempted to access a server-side environment variable on the client"
          : `❌ Attempted to access server-side environment variable '${prop}' on the client`
      );
    return target[/** @type {keyof typeof target} */ (prop)];
  },
});
export { env };
