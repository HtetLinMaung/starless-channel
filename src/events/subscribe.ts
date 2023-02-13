import httpClient from "starless-http";
import jwt from "jsonwebtoken";
import server from "starless-server";
import log from "../utils/log";

export default (io: any, socket: any) => async (token: string) => {
  try {
    log(`token: ${token}`);
    if (!token) {
      throw new Error("Token is required!");
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
};
