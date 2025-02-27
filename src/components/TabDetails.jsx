import { useState, useContext } from "react";

import { TabContext } from "./MainTabEditor";

import PropTypes from "prop-types";

import { PencilSimple, XCircle } from "@phosphor-icons/react";
import { TablabContext } from "../layouts/TablabContextLayout";

export default function TabDetails() {
  const notes = [
    "A",
    "Bb",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];
  const strings = [1, 2, 3, 4, 5, 6];

  const [isShown, setIsShown] = useState(true);

  const { id } = useContext(TabContext);
  const { tabs, updateDetails } = useContext(TablabContext);

  const currentTab = tabs.find((tab) => tab.id === id);

  function handleTuning(event, string, value) {
    const newTuning = currentTab.details.tuning.map((note, index) =>
      index === string ? value : note
    );
    updateDetails(id, event.target.name, newTuning);
  }

  return (
    <section className="tab-details tab-header">
      <div className="tab-details-header">
        <div className="tab-details-container">
          <div className="tab-details-top-wrapper">
            <h1>{currentTab.details.song}</h1>
            <button onClick={() => setIsShown((prev) => !prev)}>
              {isShown ? <XCircle size={20} /> : <PencilSimple size={20} />}
            </button>
          </div>

          <div className="tab-details-sub-container">
            <p>By {currentTab.details.artist}</p>
            <p>Tuning: {currentTab.details.tuning.toReversed().join("")}</p>
          </div>
        </div>
      </div>
      {isShown ? (
        <form>
          <label htmlFor="song">Song name</label>
          <input
            name="song"
            type="text"
            value={currentTab.details.song}
            onChange={(event) =>
              updateDetails(id, event.target.name, event.target.value)
            }
          />

          <label htmlFor="artist">Artist</label>
          <input
            name="artist"
            type="text"
            value={currentTab.details.artist}
            onChange={(event) =>
              updateDetails(id, event.target.name, event.target.value)
            }></input>

          <fieldset>
            <legend>Tuning</legend>
            {strings.map((string) => (
              <label key={string}>
                {`String ${string}`}
                <select
                  name="tuning"
                  value={currentTab.details.tuning[string - 1]}
                  onChange={(event) =>
                    handleTuning(event, string - 1, event.target.value)
                  }>
                  {notes.map((note) => (
                    <option value={note} key={note}>
                      {note}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </fieldset>
        </form>
      ) : null}
    </section>
  );
}

TabDetails.propTypes = {
  details: PropTypes.object.isRequired,
  setDetials: PropTypes.func.isRequired,
};
