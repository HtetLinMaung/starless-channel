import server from "starless-server";
import EventHistory from "../models/EventHistory";
import connectMongoose from "../utils/connect-mongoose";
import log from "../utils/log";

export default (io: any, socket: any) => async (eventid: string) => {
  try {
    const userid = server.sharedMemory.get(socket.id);
    log(`Received event ${eventid} triggered by ${userid}`);
    await connectMongoose();
    const eventHistory = await EventHistory.findOne({ eventid, room: userid });
    if (eventHistory) {
      eventHistory.status = "received";
      await eventHistory.save();
    }
  } catch (err) {
    socket.emit("error", err.message);
    console.error(err);
  }
};
