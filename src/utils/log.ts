import moment from "moment";

export default function log(msg: string) {
  console.log(`[${moment().format("DD/MM/YYYY h:mm:ss a")}] ${msg}`);
}
