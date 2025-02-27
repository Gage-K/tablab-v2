import { Outlet } from "react-router";
import { useState, useContext, createContext, useEffect } from "react";

import defaultTab from "../data/defaultTab.json";

import { nanoid } from "nanoid";

const TablabContext = createContext();

export default function TablabContextLayout() {
  console.log(localStorage.getItem("allTabs"));
  const [tabs, setTabs] = useState(
    () => JSON.parse(localStorage.getItem("allTabs")) || []
  );

  console.log(tabs);
  useEffect(() => {
    if (tabs.length === 0) {
      console.log("ran");
      setTabs(defaultTab.allTabs); // Update state instead of just localStorage
    }
  }, []);

  function updateDetails(id, name, value) {
    console.log("updating tab details...");

    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id
          ? { ...tab, details: { ...tab.details, [name]: value } }
          : tab
      )
    );
  }

  function updateTab(id, newTab) {
    console.log("tabs");
    console.log(tabs);
    console.log("default");
    console.log(defaultTab.allTabs);
    console.log("updating tab...");
    console.log(id);
    console.log(newTab);

    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, tab: newTab } : tab))
    );
  }

  function createNewTab() {
    const newTab = {
      id: nanoid(),
      details: {
        song: "Untitled",
        artist: "Artist",
        creator: "",
        dateCreated: 20250101,
        dateModified: 20250101,
        tuning: ["E", "B", "G", "D", "A", "E"],
      },
      tab: [
        [
          {
            id: 1,
            notes: [
              {
                fret: 0,
                style: "none",
              },
              {
                fret: 0,
                style: "none",
              },
              {
                fret: 0,
                style: "none",
              },
              {
                fret: 0,
                style: "none",
              },
              {
                fret: 0,
                style: "none",
              },
              {
                fret: 0,
                style: "none",
              },
            ],
          },
        ],
      ],
    };

    setTabs((prevTabs) => [...prevTabs, newTab]);
  }

  function deleteTab(id) {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id != id));
  }

  useEffect(() => {
    localStorage.setItem("allTabs", JSON.stringify(tabs));
  }, [tabs]);

  console.log(tabs);

  return (
    <TablabContext.Provider
      value={{ tabs, updateDetails, updateTab, createNewTab, deleteTab }}>
      <button onClick={() => localStorage.clear()}>Reset</button>
      <Outlet />
    </TablabContext.Provider>
  );
}

export { TablabContext };
