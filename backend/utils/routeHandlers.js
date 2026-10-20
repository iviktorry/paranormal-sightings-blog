import { getDataFromJSON } from "../utils/getDataFromJSON.js";
import { sendResponse } from "../utils/sendResponse.js";
import { handleSanitize } from "../utils/handleSanitize.js";
import { getBodyData } from "../utils/getBodyData.js";
import { sightingEvents } from "../events/sightingEvents.js";
import { JSONPath } from "../server.js";
import fs from "node:fs/promises";

export async function handleGET(res) {
  try {
    const fileDataObj = await getDataFromJSON();
    sendResponse(res, 200, JSON.stringify(fileDataObj));
  } catch (error) {
    console.log(`Error reading data: ${error}`);
    sendResponse(res, 500, JSON.stringify({ error: "Unable to read data" }));
  }
}

export async function handlePOST(req, res) {
  try {
    const fileDataObj = await getDataFromJSON();
    const bodyObj = await getBodyData(req);
    const sanitizedBody = handleSanitize(bodyObj);
    fileDataObj.push(sanitizedBody);

    await fs.writeFile(JSONPath, JSON.stringify(fileDataObj, null, 2), "utf8");

    sightingEvents.emit("sighting-added", sanitizedBody);
    sendResponse(res, 201, JSON.stringify(bodyObj));
  } catch (error) {
    console.log(`Error while receiving data: ${error}`);
    sendResponse(
      res,
      400,
      JSON.stringify({
        error: "Invalid JSON request body",
      }),
    );
  }
}
