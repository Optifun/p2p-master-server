//@ts-check
import net from "net";
import dgram from "dgram";
import { encode, decode } from "@msgpack/msgpack";
import {
  IHandler,
  RouteMap,
  RouteCallback,
  Server,
  IComposite,
  ShareCallback,
  isIComposite,
  isIHandler,
} from "./types";

export abstract class AbstractServer implements IComposite {
  protected field: string;
  protected callbacks: Array<RouteMap>;

  protected constructor(field: string) {
    this.callbacks = [];
    this.field = field;
  }

  public abstract listen(callback: () => void): void;

  public register(type: string, callback: RouteCallback): void {
    if (this.callbacks.find((a: RouteMap) => a.field === type))
      throw new Error(
        "Argument exception: Two routers found with same packet type"
      );

    this.callbacks.push({ field: type, callback });
  }

  public compose(router: IHandler): IHandler {
    if (isIComposite(router)) throw new Error("Cant compose servers");
    if (!isIHandler(router)) return;

    router._share((routes) => this._inject(routes));
    return this;
  }

  public _share(callback: ShareCallback): void {
    throw new Error("Cant share callback from server");
  }

  public _inject(routes: RouteMap[]): void {
    routes.forEach((r) => {
      if (this.callbacks.length > 0)
        if (this.callbacks.find((cb) => cb.field === r.field))
          throw new Error(
            "Argument exception: Found route existed on server when composing"
          );
    });
    this.callbacks = [...this.callbacks, ...routes];
  }
}
