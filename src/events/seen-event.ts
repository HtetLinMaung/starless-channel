import EventHistory from "../models/EventHistory";
import connectMongoose from "../utils/connect-mongoose";
import server from "starless-server";
import log from "../utils/log";

export default (io: any, socket: any) => async (eventid: string) => {
  try {
    await connectMongoose();
    const userid = server.sharedMemory.get(socket.id);
    log(`Seen event ${eventid} triggered by ${userid}`);
    const eventHistory = await EventHistory.findOne({ eventid, room: userid });
    if (eventHistory) {
      eventHistory.status = "seen";
      await eventHistory.save();
    }
  } catch (err) {
    socket.emit("error", err.message);
    console.error(err);
  }
};
