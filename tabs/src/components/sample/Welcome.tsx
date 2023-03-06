import { useContext, useState } from "react";
import { Image, Menu } from "@fluentui/react-northstar";
import "./Welcome.css";
import { EditCode } from "./EditCode";
import { AzureFunctions } from "./AzureFunctions";
import { Graph } from "./Graph";
import { CurrentUser } from "./CurrentUser";
import { useData } from "@microsoft/teamsfx-react";
import { Deploy } from "./Deploy";
import { Publish } from "./Publish";
import { TeamsFxContext } from "../Context";
import { people, app } from "@microsoft/teams-js";
import { AdaptiveCard } from "adaptivecards-react";

var card = {
  "type": "AdaptiveCard",
  "body": [
   {
    "type": "TextBlock",
    "size": "Medium",
    "weight": "Bolder",
    "text": "People Picker with Org search enabled"
   },
   {
    "type": "Input.ChoiceSet",
    "choices": [],
    "choices.data": {
     "type": "Data.Query",
     "dataset": "graph.microsoft.com/users?scope=currentContext"
    },
    "id": "people-picker",
    "isMultiSelect": false
   }
  ],
  "actions": [
   {
    "type": "Action.Submit",
    "title": "Submit"
   }
  ],
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.2"
};

var hostConfig = {
  fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
};

export function Welcome(props: { showFunction?: boolean; environment?: string }) {
  const { showFunction, environment } = {
    showFunction: true,
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      local: "local environment",
      azure: "Azure environment",
    }[environment] || "local environment";

  const steps = ["local", "azure", "publish"];
  const friendlyStepsName: { [key: string]: string } = {
    local: "1. Build your app locally",
    azure: "2. Provision and Deploy to the Cloud",
    publish: "3. Publish to Teams",
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState("local");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => setSelectedMenuItem(step),
    };
  });

  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
  const userName = (loading || error) ? "": data!.displayName;
  return (
    <div className="welcome page">
      {/* <button onClick={async () => {
        const context = await app.getContext()
        if (!context.user) {
          console.log("No user context")
          return
        }

        const aadId = context.user.id

        const selectedPeople = await people.selectPeople({
          setSelected: [aadId],
          openOrgWideSearchInChatOrChannel: false,
          singleSelect: false,
        })

        console.log({ selectedPeople, context })
      }}>Select people</button> */}

      <AdaptiveCard payload={card} hostConfig={hostConfig} />

      <div className="narrow page-padding">
        <Image src="hello.png" />
        <h1 className="center">Congratulations{userName ? ", " + userName : ""}!</h1>
        <p className="center">Your app is running in your {friendlyEnvironmentName}</p>
        <Menu defaultActiveIndex={0} items={items} underlined secondary />
        <div className="sections">
          {selectedMenuItem === "local" && (
            <div>
              <EditCode showFunction={showFunction} />
              <CurrentUser userName={userName} />
              <Graph />
              {showFunction && <AzureFunctions />}
            </div>
          )}
          {selectedMenuItem === "azure" && (
            <div>
              <Deploy />
            </div>
          )}
          {selectedMenuItem === "publish" && (
            <div>
              <Publish />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
