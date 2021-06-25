import { Router } from "../game-server";
const router = new Router();

const UserInfo = async (packet: any, client: any) => {
  console.log(`Recieved${packet} from ${client}`);
};

router.register("user-info", UserInfo);

export default router;
