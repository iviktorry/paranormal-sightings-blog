import http from "node:http";
import { fileURLToPath } from "node:url";
import { handleGET, handlePOST } from "./utils/routeHandlers.js";
import { setCORSPolicy } from "./utils/setCORSPolicy.js";
import { sendResponse } from "./utils/sendResponse.js";

const PORT = process.env.PORT || 7000;

export const JSONPath = fileURLToPath(
  new URL("./data/data.json", import.meta.url),
);

const server = http.createServer(async (req, res) => {
  setCORSPolicy(res);

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/api") {
    if (req.method === "GET") {
      handleGET(res);
    } else if (req.method === "POST") {
      handlePOST(req, res);
    }
  } else {
    sendResponse(
      res,
      404,
      JSON.stringify({ message: "Route not found. Use /api endpoint." }),
    );
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`server is running on port ${PORT}`);
});
