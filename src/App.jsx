import { useState } from "react";
import { nanoid } from "nanoid";

import "./App.css";

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

  const renderDetails = (
    <section>
      <h1>Song: {tabDetails.song}</h1>
      <p>Artist: {tabDetails.artist}</p>
      <p>Creator: {tabDetails.creator}</p>
      <p>Date created: {tabDetails.dateCreated}</p>
      <p>Date modified: {tabDetails.dateModified}</p>
      <p>Tuning: {tabDetails.tuning}</p>
    </section>
  );

  return <>{renderDetails}</>;
}

export default App;
