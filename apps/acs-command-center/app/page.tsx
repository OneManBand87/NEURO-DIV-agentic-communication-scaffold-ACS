import { CommandCenter } from "./CommandCenter";
import { initialCommandCenterState } from "../lib/seed-state";

export default function Home() {
  return <CommandCenter initialState={initialCommandCenterState} />;
}
