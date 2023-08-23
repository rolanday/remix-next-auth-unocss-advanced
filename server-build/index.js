import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import {
  createRequestHandler as _createRequestHandler
} from "@remix-run/express";
import {
  broadcastDevReady,
  installGlobals
} from "@remix-run/node";
import { wrapExpressCreateRequestHandler } from "@sentry/remix";
import address from "address";
import chalk from "chalk";
import chokidar from "chokidar";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import express from "express";
import rateLimit from "express-rate-limit";
import getPort, { portNumbers } from "get-port";
import morgan from "morgan";
import * as remixBuild from "../build/index.js";
import NextAuthMiddleware from "./auth.js";
import { authOptions } from "./auth.options.js";
installGlobals();
const MODE = process.env.NODE_ENV;
const createRequestHandler = wrapExpressCreateRequestHandler(
  _createRequestHandler
);
const BUILD_PATH = "../build/index.js";
const build = remixBuild;
let devBuild = build;
const app = express();
const getHost = (req) => req.get("X-Forwarded-Host") ?? req.get("host") ?? "";
app.use((req, res, next) => {
  const proto = req.get("X-Forwarded-Proto");
  const host = getHost(req);
  if (proto === "http") {
    res.set("X-Forwarded-Proto", "https");
    res.redirect(`https://${host}${req.originalUrl}`);
    return;
  }
  next();
});
app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});
app.use(compression());
app.use(NextAuthMiddleware(authOptions));
app.disable("x-powered-by");
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);
app.use(
  "/fonts",
  express.static("public/fonts", { immutable: true, maxAge: "1y" })
);
app.use(express.static("public", { maxAge: "1h" }));
morgan.token("url", (req, res) => decodeURIComponent(req.url ?? ""));
app.use(morgan("tiny"));
app.use((_, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});
const maxMultiple = MODE !== "production" || process.env.PLAYWRIGHT_TEST_BASE_URL ? 1e4 : 1;
const rateLimitDefault = {
  windowMs: 60 * 1e3,
  max: 1e3 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false
};
const strongestRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1e3,
  max: 10 * maxMultiple
});
const strongRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1e3,
  max: 100 * maxMultiple
});
const generalRateLimit = rateLimit(rateLimitDefault);
app.use((req, res, next) => {
  const strongPaths = [
    "/login",
    "/signup",
    "/verify",
    "/admin",
    "/onboarding",
    "/reset-password",
    "/settings/profile",
    "/resources/login",
    "/resources/verify"
  ];
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (strongPaths.some((p) => req.path.includes(p))) {
      return strongestRateLimit(req, res, next);
    }
    return strongRateLimit(req, res, next);
  }
  if (req.path.includes("/verify")) {
    return strongestRateLimit(req, res, next);
  }
  return generalRateLimit(req, res, next);
});
function getRequestHandler(build2) {
  function getLoadContext(_, res) {
    return { cspNonce: res.locals.cspNonce };
  }
  return createRequestHandler({ build: build2, mode: MODE, getLoadContext });
}
app.all(
  "*",
  MODE === "development" ? (...args) => getRequestHandler(devBuild)(...args) : getRequestHandler(build)
);
const desiredPort = Number(process.env.PORT || 3e3);
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100)
});
const server = app.listen(portToUse, () => {
  const addy = server.address();
  const portUsed = desiredPort === portToUse ? desiredPort : addy && typeof addy === "object" ? addy.port : 0;
  if (portUsed !== desiredPort) {
    console.warn(
      chalk.yellow(
        `\u26A0\uFE0F  Port ${desiredPort} is not available, using ${portUsed} instead.`
      )
    );
  }
  console.log(`\u{1F680}  We have liftoff!`);
  const localUrl = `http://localhost:${portUsed}`;
  let lanUrl = null;
  const localIp = address.ip();
  if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
    lanUrl = `http://${localIp}:${portUsed}`;
  }
  console.log(
    `
${chalk.bold("Local:")}            ${chalk.cyan(localUrl)}
${lanUrl ? `${chalk.bold("On Your Network:")}  ${chalk.cyan(lanUrl)}` : ""}
${chalk.bold("Press Ctrl+C to stop")}
		`.trim()
  );
  if (MODE === "development") {
    broadcastDevReady(build);
  }
});
closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    server.close((e) => e ? reject(e) : resolve("ok"));
  });
});
if (MODE === "development") {
  async function reloadBuild() {
    devBuild = await import(`${BUILD_PATH}?update=${Date.now()}`);
    broadcastDevReady(devBuild);
  }
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const watchPath = path.join(dirname, BUILD_PATH).replace(/\\/g, "/");
  const watcher = chokidar.watch(watchPath, { ignoreInitial: true });
  watcher.on("all", reloadBuild);
}
//# sourceMappingURL=index.js.map
