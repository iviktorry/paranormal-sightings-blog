import fs from "node:fs/promises";
import { JSONPath } from "../server.js";

export async function getDataFromJSON() {
  const fileData = await fs.readFile(JSONPath, "utf8");
  return JSON.parse(fileData);
}
