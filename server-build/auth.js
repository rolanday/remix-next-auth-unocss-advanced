import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import NextAuth from "next-auth";
import { Router } from "express";
const authActions = /^\/api\/auth\/(session|signin\/?\w*|signout|csrf|providers|callback\/\w+|_log)$/;
const router = Router();
function NextAuthMiddleware(options) {
  return router.use(bodyParser.urlencoded({ extended: false })).use(bodyParser.json()).use(cookieParser()).all(authActions, (req, res, next) => {
    if (req.method !== "POST" && req.method !== "GET") {
      return next();
    }
    req.query.nextauth = req.path.split("/").slice(3);
    NextAuth.default(req, res, options);
  });
}
export {
  NextAuthMiddleware as default
};
//# sourceMappingURL=auth.js.map
