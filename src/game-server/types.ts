import net from "net";
import dgram from "dgram";

export type RouteMap = { field: string; callback: RouteCallback };

export type SocketInfo = { ip: string; port: string };

export type Server = net.Server | dgram.Socket;

export type RouteCallback = (
  packet: any,
  client: SocketInfo
) => any | Promise<any>;

export type ShareCallback = (routes: Array<RouteMap>) => void;

export interface IHandler {
  register(type: string, callback: RouteCallback): void;
  _share(callback: ShareCallback): void;
}

export interface IComposite extends IHandler {
  compose(router: IHandler): IHandler;
  _inject(routes: Array<RouteMap>): void;
}

export function isIHandler(object: any): object is IComposite {
  if ("register" in object && "_share" in object) return true;
  return false;
}

export function isIComposite(object: any): object is IComposite {
  if ("compose" in object && "_inject" in object && isIHandler(object))
    return true;
  return false;
}
