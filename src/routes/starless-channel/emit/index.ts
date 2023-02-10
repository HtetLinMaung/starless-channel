import { brewBlankExpressFunc, throwErrorResponse } from "code-alchemy";
import server from "starless-server";
import { saveEventHistories } from "../../../services/event";

export default brewBlankExpressFunc(async (req, res) => {
  const { accesskey, rooms, event, payload } = req.body;
  if (accesskey != process.env.access_key) {
    throwErrorResponse(401, "Unauthorized!");
  }
  if (!event) {
    throwErrorResponse(400, "event is required!");
  }
  // if (Array.isArray(rooms) && !rooms.length) {
  //   throwErrorResponse(400, "At lease one room id is required to emit event!");
  // } else if (!rooms) {
  //   throwErrorResponse(400, "rooms is required!");
  // }
  const io = server.getIO();
  if (!io) {
    throwErrorResponse(500, "socket.io is not initialized!");
  }
  if (!rooms || (Array.isArray(rooms) && !rooms.length)) {
    if (payload) {
      io.emit(event, payload);
    } else {
      io.emit(event);
    }
  } else {
    if (payload) {
      io.to(rooms).emit(event, payload);
    } else {
      io.to(rooms).emit(event);
    }
  }

  await saveEventHistories(
    event,
    Array.isArray(rooms) ? rooms : [rooms],
    payload
  );
  res.json({
    code: 200,
    message: "Event emited successful.",
  });
});
