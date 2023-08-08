import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import log from "../utils/log";
import connectMongoose from "../../../utils/connect-mongoose";
import EventHistory from "../../../models/EventHistory";

export default brewBlankExpressFunc(async (req, res) => {
  const { eventid, userid, accesskey } = req.body;
  if (accesskey != process.env.access_key) {
    throwErrorResponse(401, "Unauthorized!");
  }
  log(`Received event api ${eventid} triggered by ${userid}`);
  await connectMongoose();
  const eventHistory = await EventHistory.findOne({ eventid, room: userid });
  if (eventHistory) {
    eventHistory.status = "received";
    await eventHistory.save();
  }

  res.json({
    code: 200,
    message: "Event received successful.",
  });
});
