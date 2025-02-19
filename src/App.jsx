// REACT IMPORTS
import { useState } from "react";
import { nanoid } from "nanoid";

// STYLE IMPORTS
import "./App.css";

// COMPONENTS IMPORTS
import TabDetails from "./components/TabDetails";
import TabDisplay from "./components/TabDisplay";
import TabForm from "./components/TabForm";

// DATA IMPORTS
import defaultTab from "./data/defaultTab.json";

function App() {
  // CONSTANTS (FOR TESTING)
  const tabDetails = defaultTab.tabDetails; // general details about tab
  const initTab = defaultTab.tab; // init testing notes for tab --> change later to empty init

  // STATES
  const [tab, setTab] = useState(initTab);
  const [position, setPosition] = useState(0); // position indicates place in array of tab, like a timestamp

  // FUNCTIONS
  function tabPositionExists(pos) {
    // checks if requested position in tab exists
    return pos < tab.length && pos >= 0;
  }

  function updatePosition(pos) {
    if (tabPositionExists(pos)) {
      setPosition(pos);
    }
  }

  function updateTabData(pos, formData) {
    setTab((prev) =>
      prev.map((tabItem, index) =>
        index === pos ? { id: nanoid(), notes: formData } : tabItem
      )
    );
  }

  function getEmptyTab() {
    return {
      id: nanoid(),
      notes: [
        {
          fret: -2,
          style: "none",
        },
        {
          fret: -2,
          style: "none",
        },
        {
          fret: -2,
          style: "none",
        },
        {
          fret: -2,
          style: "none",
        },
        {
          fret: -2,
          style: "none",
        },
        {
          fret: -2,
          style: "none",
        },
      ],
    };
  }

  function getTabByLocation(pos) {
    return tab[pos];
  }

  function addNewTab(pos, isEmptyTab) {
    // accepts a position and whether the tab to be added should be empty
    // position where new tab is added is always tab[pos + 1]
    // if tab should be empty, call getEmptyTab()
    // if tab should not be empty, call getExistingTab(pos) and update its id
    // add new tab to tab
    const newTab = isEmptyTab
      ? getEmptyTab()
      : { ...getTabByLocation(pos), id: nanoid() };

    setTab((prev) => prev.toSpliced(pos + 1, 0, newTab));
    setPosition(pos + 1);
    console.log(newTab);
    console.log("new tab ran");
    console.log(pos);
    console.log(isEmptyTab);
  }

  function deleteTab(id) {
    console.log("delete ran");
    tab.length === 1
      ? null
      : setTab((prev) => prev.filter((moment) => moment.id != id));

    position === 0
      ? setPosition(position)
      : position === tab.length - 1
      ? setPosition((prev) => prev - 1)
      : setPosition(position);
  }

  //addNewTab(1, true);
  console.log(tab);

  return (
    <>
      <main>
        <TabDetails
          song={tabDetails.song}
          artist={tabDetails.artist}
          creator={tabDetails.creator}
          dateCreated={tabDetails.dateCreated}
          dateModified={tabDetails.dateModified}
          tuning={tabDetails.tuning}
        />
        <TabForm
          tab={tab}
          updateTabData={updateTabData}
          position={position}
          getEmptyTab={getEmptyTab}
          addNewTab={addNewTab}
          deleteTab={deleteTab}
        />
        <button onClick={() => updatePosition(position - 1)}>
          Previous position
        </button>
        <button onClick={() => updatePosition(position + 1)}>
          Next position
        </button>
        <TabDisplay
          tab={tab}
          position={position}
          updatePosition={updatePosition}
          addNewTab={addNewTab}
        />
      </main>
    </>
  );
}

export default App;
