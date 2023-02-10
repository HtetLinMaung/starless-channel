import { Schema, model } from "mongoose";

export interface EventHistoryModel {
  name: string;
  room: string;
  payload: any;
}

const eventHistorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

export default model<EventHistoryModel>("EventHistory", eventHistorySchema);
