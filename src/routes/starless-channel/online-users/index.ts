import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import server from "starless-server";

export default brewBlankExpressFunc(async (req, res) => {
  if (req.query.accesskey != process.env.access_key) {
    throwErrorResponse(401, "Unauthorized!");
  }
  res.json({
    code: 200,
    message: "Successful.",
    data: Object.values(server.sharedMemory.getAll()),
  });
});
