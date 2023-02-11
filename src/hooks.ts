import httpClient from "starless-http";
import jwt from "jsonwebtoken";
import connectMongoose from "./utils/connect-mongoose";
import EventHistory from "./models/EventHistory";

export const afterSocketIOStart = async (io: any) => {
  console.log("After socket io started");
  // await connectMongoose();
  // await EventHistory.deleteMany({});
  io.use(async (socket: any, next: any) => {
    try {
      const token: string = socket.handshake.auth.token;
      console.log(`token: ${token}`);
      if (!token) {
        socket.disconnect();
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
          socket.disconnect();
        }
        userid = response.data;
      } else if (process.env.jwt_secret) {
        const payload: any = jwt.verify(token, process.env.jwt_secret);
        userid = payload.userid;
      }
      if (userid) {
        console.log(`Join user ${userid}`);
        socket.join(userid);
      }
    } catch (err) {
      console.error(err.message);
      socket.disconnect();
    }
    next();
  });
};
