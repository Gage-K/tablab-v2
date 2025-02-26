import { useState, useContext } from "react";

import { TabContext } from "../App";

import PropTypes from "prop-types";

import { CaretCircleDown, CaretCircleUp } from "@phosphor-icons/react";

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

  const { details, setDetails } = useContext(TabContext);

  console.log("in details");
  console.log(details);

  return (
    <section className="tab-details tab-header">
      <div className="tab-details-header">
        <h1>Song: {details.song}</h1>
        <button onClick={() => setIsShown((prev) => !prev)}>
          {isShown ? <CaretCircleUp /> : <CaretCircleDown />}
        </button>
      </div>
      {isShown ? (
        <form>
          <label htmlFor="song">Song name</label>
          <input
            name="song"
            type="text"
            value={details.song}
            onChange={(event) =>
              setDetails((prev) => ({ ...prev, song: event.target.value }))
            }
          />

          <label htmlFor="artist">Artist</label>
          <input
            name="artist"
            type="text"
            value={details.artist}
            onChange={(event) =>
              setDetails((prev) => ({ ...prev, artist: event.target.value }))
            }></input>

          <fieldset>
            <legend>Tuning</legend>
            {strings.map((string) => (
              <label key={string}>
                {`String ${string}`}
                <select
                  value={details.tuning[string - 1]}
                  onChange={(event) =>
                    setDetails((prev) => ({
                      ...prev,
                      tuning: prev.tuning.map((note, index) =>
                        index === string - 1 ? event.target.value : note
                      ),
                    }))
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
