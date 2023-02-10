import { asyncEach } from "starless-async";
import EventHistory from "../models/EventHistory";
import connectMongoose from "../utils/connect-mongoose";

export const saveEventHistories = async (
  name: string,
  rooms: string[],
  payload: any
) => {
  if (process.env.connection_string) {
    await connectMongoose();
    return await asyncEach(rooms, async (room) => {
      const eventHistory = new EventHistory({
        name,
        room,
        payload: payload || null,
      });
      await eventHistory.save();
      return eventHistory;
    });
  }
};
