import EventHistory from "../models/EventHistory";
import connectMongoose from "../utils/connect-mongoose";

export default (io: any, socket: any) => async (eventid: string) => {
  try {
    await connectMongoose();
    const eventHistory = await EventHistory.findById(eventid);
    if (eventHistory) {
      eventHistory.status = "seen";
      await eventHistory.save();
    }
  } catch (err) {
    console.log(err);
  }
};
