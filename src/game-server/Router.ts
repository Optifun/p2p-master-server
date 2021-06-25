import { IHandler, RouteCallback, RouteMap, ShareCallback } from "./types";
import { AbstractServer } from "./AbstractServer";

export class Router implements IHandler {
  protected callbacks: Array<RouteMap> = [];
  register(type: string, callback: RouteCallback): void {
    if (this.callbacks.find((a: RouteMap) => a.field === type))
      throw new Error(
        "Argument exception: Two routers found with same packet type"
      );
    console.log(`Callback ${type} registered`);
    this.callbacks.push({ field: type, callback });
  }

  public _share(callback: ShareCallback): void {
    if (callback) callback(this.callbacks);
  }
}
