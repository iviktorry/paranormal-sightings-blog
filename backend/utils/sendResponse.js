export function sendResponse(res, statusCode, payload) {
  res.setStatus = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(payload);
}
