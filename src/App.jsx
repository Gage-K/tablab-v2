// REACT IMPORTS
import { useState, useEffect } from "react";
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
  const [position, setPosition] = useState({ measure: 0, index: 0 });

  // FUNCTIONS
  function checkIfPositionExists(measure, index) {
    const requestedTab = tab[measure];
    return requestedTab != undefined ? requestedTab[index] != undefined : false;
  }

  function updatePosition(measure, index) {
    const nextMeasure = measure + 1;
    const prevMeasure = measure - 1;
    const firstIndex = 0;
    const prevLastIndex = tab[prevMeasure]?.length - 1;

    if (checkIfPositionExists(measure, index)) {
      setPosition({ measure, index });
      return;
    }

    if (index >= tab[measure]?.length && nextMeasure < tab.length) {
      if (checkIfPositionExists(nextMeasure, firstIndex)) {
        setPosition({ measure: nextMeasure, index: firstIndex });
      }
      return;
    }

    if (index < 0 && prevMeasure >= 0) {
      if (checkIfPositionExists(prevMeasure, prevLastIndex)) {
        setPosition({ measure: prevMeasure, index: prevLastIndex });
      }
      return;
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

  function getTabByLocation(measure, index) {
    return tab[measure][index];
  }

  function addNewTab(measure, index, isEmptyTab) {
    // accepts a position and whether the tab to be added should be empty
    // position where new tab is added is always tab[pos + 1]
    // if tab should be empty, call getEmptyTab()
    // if tab should not be empty, call getExistingTab(pos) and update its id
    // add new tab to tab
    const newTab = isEmptyTab
      ? getEmptyTab()
      : { ...getTabByLocation(measure, index), id: nanoid() };

    const updatedTab = tab.map((prevMeasure, i) =>
      i === measure
        ? [
            ...prevMeasure.slice(0, index + 1),
            newTab,
            ...prevMeasure.slice(index + 1),
          ]
        : prevMeasure
    );

    setTab(updatedTab);

    updatePosition(measure, index + 1);
  }

  function addNewMeasure(measure) {
    const newMeasure = [getEmptyTab()];
    const updatedTab = [
      ...tab.slice(0, measure),
      newMeasure,
      ...tab.slice(measure + 1),
    ];

    setTab(updatedTab);
    updatePosition(measure, 0);
  }

  function deleteTab(id) {
    tab.length === 1
      ? null
      : setTab((prev) => prev.filter((frame) => frame.id != id));

    position === 0
      ? setPosition(position)
      : position === tab.length - 1
      ? setPosition((prev) => prev - 1)
      : setPosition(position);
  }

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

        <button
          onClick={() => updatePosition(position.measure, position.index - 1)}>
          Previous position
        </button>
        <button
          onClick={() => updatePosition(position.measure, position.index + 1)}>
          Next position
        </button>

        <TabDisplay
          tab={tab}
          position={position}
          updatePosition={updatePosition}
          addNewTab={addNewTab}
          addNewMeasure={addNewMeasure}
          tuning={tabDetails.tuning}
        />
      </main>
    </>
  );
}

/*
<TabForm
          tab={tab}
          updateTabData={updateTabData}
          position={position}
          getEmptyTab={getEmptyTab}
          addNewTab={addNewTab}
          deleteTab={deleteTab}
        />
*/

export default App;
