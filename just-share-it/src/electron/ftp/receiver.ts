import { startControlServer } from "./receiverControl.js";
import { startDataServer } from "./receiverData.js";

export function startReceiver(basePort: number) {
  startControlServer(basePort);
  startDataServer(basePort + 1);
}
