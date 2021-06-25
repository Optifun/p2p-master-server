import net from "net";
import dgram from "dgram";
import { decode, encode } from "@msgpack/msgpack";
import { UDPServer } from "./game-server/UDPServer";
const server = new UDPServer(23434, null, "type");

server.listen(() => {
  console.log("opened server");
});
