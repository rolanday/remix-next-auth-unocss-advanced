import "source-map-support/register.js";
import "dotenv/config";
import chalk from "chalk";
import closeWithGrace from "close-with-grace";

closeWithGrace(async ({ err }) => {
  if (err) {
    console.error(chalk.red(err));
    console.error(chalk.red(err.stack));
    process.exit(1);
  }
});

if (process.env.NODE_ENV === "production") {
  await import("./build.server/index.js");
} else {
  await import("./server/index.ts");
}
