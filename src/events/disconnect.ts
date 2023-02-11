import server from "starless-server";

export default (io: any, socket: any) => async (reason: any) => {
  console.log(reason);
  server.sharedMemory.set(socket.id, null);
};
