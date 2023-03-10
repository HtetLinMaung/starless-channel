import httpClient from "starless-http";
import jwt from "jsonwebtoken";
import server from "starless-server";
import connectMongoose from "./utils/connect-mongoose";
import EventHistory from "./models/EventHistory";
import log from "./utils/log";

export const afterSocketIOStart = async (io: any) => {
  log("After socket io started");
  // await connectMongoose();
  // await EventHistory.deleteMany({});
  io.use(async (socket: any, next: any) => {
    try {
      console.log(socket.handshake);
      const token: string = socket.handshake.auth.token;
      log(`token: ${token}`);
      if (!token) {
        return next();
      }
      let userid: string = null;
      if (process.env.token_checker_api) {
        const [response, err] = await httpClient.post(
          `${process.env.token_checker_api}`,
          {
            accesskey: process.env.token_checker_api_key,
            token,
          }
        );
        if (err || !response || response.status != 200 || !response.data) {
          let message = "Something went wrong!";
          if (response && response.data) {
            message = response.data.message;
          } else if (err) {
            message = err.message;
          }
          throw new Error(message);
        }
        userid = response.data;
        log(JSON.stringify(userid, null, 2));
      } else if (process.env.jwt_secret) {
        const payload: any = jwt.verify(token, process.env.jwt_secret);
        log(JSON.stringify(payload, null, 2));
        userid = payload.userid;
      }
      if (userid) {
        log(`Join user ${userid}`);
        socket.join(userid);
        server.sharedMemory.set(socket.id, userid);
        setTimeout(() => {
          io.emit("joined-user", Object.values(server.sharedMemory.getAll()));
        }, 3000);
      }
    } catch (err) {
      socket.emit("error", err.message);
      console.error(err.message);
      socket.disconnect();
    }
    next();
  });
};

// export const afterSocketConnected = async (io: any, socket: any) => {
//   try {
//     log(`Socket ID ${socket.id} connected`);
//     if (process.env.after_connected_api) {
//       const userid = server.sharedMemory.get(socket.id);
//       const [response, err] = await httpClient.post(
//         `${process.env.after_connected_api}`,
//         {
//           accesskey: process.env.after_connected_api_key,
//           socketId: socket.id,
//           userid,
//         }
//       );
//       if (err || !response || response.status != 200 || !response.data) {
//         let message = "Something went wrong!";
//         if (response && response.data) {
//           message = response.data.message;
//         } else if (err) {
//           message = err.message;
//         }
//         throw new Error(message);
//       }
//     }
//   } catch (err) {
//     socket.emit("error", err.message);
//     console.error(err.message);
//   }
// };
