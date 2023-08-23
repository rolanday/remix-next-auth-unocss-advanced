import type { AuthOptions } from "next-auth";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import NextAuth from "next-auth";
import { Router } from "express";

// credit: https://github.com/s-kris/vite-ssr-starter
const authActions =
  /^\/api\/auth\/(session|signin\/?\w*|signout|csrf|providers|callback\/\w+|_log)$/;
const router = Router();
export default function NextAuthMiddleware(options: AuthOptions) {
  return router
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(cookieParser())
    .all(authActions, (req, res, next) => {
      if (req.method !== "POST" && req.method !== "GET") {
        return next();
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      req.query.nextauth = req.path.split("/").slice(3);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      NextAuth.default(req, res, options);
    });
}
