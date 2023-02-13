import server from "starless-server";
import log from "../utils/log";

export default (io: any, socket: any) => async (reason: any) => {
  log(reason);
  const userid = server.sharedMemory.get(socket.id);
  log(`Disconnect user ${userid}`);
  server.sharedMemory.set(socket.id, null);
};
