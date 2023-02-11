import {
  brewExpressFuncCreateOrFindAll,
  throwErrorResponse,
} from "code-alchemy";
import EventHistory from "../../../models/EventHistory";
import connectMongoose from "../../../utils/connect-mongoose";

export default brewExpressFuncCreateOrFindAll(
  EventHistory,
  {
    afterFunctionStart: async (req, res) => {
      if (req.query.accesskey != process.env.access_key) {
        throwErrorResponse(401, "Unauthorized!");
      }
      await connectMongoose();
    },
  },
  "mongoose"
);
