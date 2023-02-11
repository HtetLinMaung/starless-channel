import { Schema, model } from "mongoose";

export interface EventHistoryModel {
  name: string;
  room: string;
  payload: any;
  status: string;
}

const eventHistorySchema = new Schema(
  {
    eventid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      default: null,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ["sent", "received", "seen"],
      default: "sent",
    },
  },
  { timestamps: true }
);

eventHistorySchema.index({ "$**": "text" });

export default model<EventHistoryModel>("EventHistory", eventHistorySchema);
