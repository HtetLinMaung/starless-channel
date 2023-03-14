import { asyncEach } from "starless-async";
import EventHistory from "../models/EventHistory";
import connectMongoose from "../utils/connect-mongoose";
import { v4 } from "uuid";

export const saveEventHistories = async (
  name: string,
  rooms: string[],
  payload: any
) => {
  const eventid = v4();
  if (process.env.connection_string) {
    await connectMongoose();
    asyncEach(rooms, async (room) => {
      const eventHistory = new EventHistory({
        eventid,
        name,
        room,
        payload: payload || null,
      });
      await eventHistory.save();
      console.log(eventHistory);
      return eventHistory;
    });
  }
  return eventid;
};
