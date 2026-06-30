import morgan from "morgan";
import fs from "fs";

const stream = fs.createWriteStream(
  "logs/server/access.log",
  { flags: "a" }
);

export const requestLogger = morgan("combined", { stream });
