import PropTypes from "prop-types";
import { nanoid } from "nanoid";

export default function TabDisplay({
  tab,
  position,
  updatePosition,
  addNewTab,
}) {
  return (
    // maps over all of the tab and for each moment of tab:
    //      add an onClick that updates position
    //      if position = index of moment, add current class
    //      map over the array of notes in that moment
    //          display the fretted positions in notes array

    <section className="tab-display">
      <button className="button-plus" onClick={() => addNewTab(-1, true)}>
        +
      </button>
      {tab.map((moment, index) => (
        <div key={nanoid()} className="tab-moment-container">
          <div
            key={moment.id}
            className={
              index === position ? "tab-current-pos tab-moment" : "tab-moment"
            }
            onClick={() => updatePosition(index)}>
            {moment.notes.map((note) => (
              <p key={moment.notes.indexOf(note)}>{note.fret}</p>
            ))}
          </div>
          <button
            className="button-plus"
            onClick={() => addNewTab(index, true)}>
            +
          </button>
        </div>
      ))}
    </section>
  );
}

TabDisplay.propTypes = {
  tab: PropTypes.array.isRequired,
  position: PropTypes.number.isRequired,
  updatePosition: PropTypes.func.isRequired,
  addNewTab: PropTypes.func.isRequired,
};
