import { useContext } from "react";
import { Welcome } from "./sample/Welcome";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";

const showFunction = Boolean(config.apiName);

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <Welcome showFunction={showFunction} />
    </div>
  );
}
