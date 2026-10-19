import http from "node:http";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const PORT = process.env.PORT || 7000;
const JSONPath = fileURLToPath(new URL("./data/data.json", import.meta.url));

function setCORSPolicy(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
}

function sendResponse(res, statusCode, contentType, payload) {
  res.setStatus = statusCode;
  res.setHeader("Content-Type", contentType);
  res.end(payload);
}

async function getDataFromJSON() {
  const fileData = await fs.readFile(JSONPath, "utf8");
  return JSON.parse(fileData);
}

async function getBodyData(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }
  return JSON.parse(body);
}

async function handleGET(res) {
  try {
    const fileDataObj = await getDataFromJSON();
    sendResponse(res, 200, "application/json", JSON.stringify(fileDataObj));
  } catch (error) {
    console.log(`Error reading data: ${error}`);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: "Unable to read data" }),
    );
  }
}

async function handlePOST(req, res) {
  try {
    const fileDataObj = await getDataFromJSON();
    const bodyObj = await getBodyData(req);
    fileDataObj.push(bodyObj);

    await fs.writeFile(JSONPath, JSON.stringify(fileDataObj, null, 2), "utf8");

    sendResponse(res, 201, "application/json", JSON.stringify(bodyObj));
  } catch (error) {
    console.log(`Error white receiving data: ${error}`);
    sendResponse(
      res,
      400,
      "application/json",
      JSON.stringify({
        error: "Invalid JSON request body",
      }),
    );
  }
}

const server = http.createServer(async (req, res) => {
  setCORSPolicy(res);
  console.log("helloooo");

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
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`server is running on port ${PORT}`);
});
