import { encode, decode } from "@msgpack/msgpack";
import net from "net";
import dgram from "dgram";
import { AbstractServer } from "./AbstractServer";
import { Server, RouteMap } from "./types";

export class UDPServer extends AbstractServer {
  protected server: dgram.Socket;
  protected ip: string;
  protected port: number;

  public constructor(port: number, ip?: string, searchField: string = "type") {
    super(searchField);
    this.field = searchField;
    this.server = dgram.createSocket("udp4");
    this.port = port;
    this.ip = ip || null;
  }

  public override listen(callback: () => void): void {
    console.log("Bindings =", this.callbacks);
    this.acceptPackets(this.server);
    this.server.on("listening", callback);
    this.server.bind(this.port, this.ip);
  }

  protected acceptPackets(server: dgram.Socket) {
    server.on("error", function (err) {
      console.log("server error:\n" + err.stack);
      server.close();
    });

    server.on("message", async (data, rinfo) => {
      const packet: any = this.formPacket(data);

      if (!packet[this.field]) return;

      const cb = this.callbacks.find(
        (a: RouteMap) => a.field === packet[this.field]
      );
      const sendPacket = await cb.callback(packet, {
        ip: rinfo.address,
        port: rinfo.port.toString(),
      });

      if (sendPacket != null)
        server.send(encode(sendPacket), rinfo.port, rinfo.address);
    });
  }

  private formPacket(data: Buffer): any {
    return decode(Buffer.from(data));
  }
}
