import { useState } from "react";
import { nanoid } from "nanoid";

import "./App.css";

import TabDetails from "./components/TabDetails";

function App() {
  const tabDetails = {
    song: "Leave Them All Behind",
    artist: "Ride",
    creator: "Gage",
    dateCreated: 20250214,
    dateModified: 20250215,
    tuning: "EADGBE",
  };

  const tab = [];

  return (
    <>
      <TabDetails
        song={tabDetails.song}
        artist={tabDetails.artist}
        creator={tabDetails.creator}
        dateCreated={tabDetails.dateCreated}
        dateModified={tabDetails.dateModified}
        tuning={tabDetails.tuning}
      />
    </>
  );
}

export default App;
