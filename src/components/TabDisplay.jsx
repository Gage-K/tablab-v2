import PropTypes from "prop-types";
import { nanoid } from "nanoid";

export default function TabDisplay({
  tab,
  position,
  updatePosition,
  addNewTab,
}) {
  return (
    // maps over all of the tab and for each frane of tab:
    //      add an onClick that updates position
    //      if position = index of frame, add current class
    //      map over the array of notes in that frame
    //          display the fretted positions in notes array

    <section className="tab-display">
      <button className="button-plus" onClick={() => addNewTab(-1, true)}>
        +
      </button>
      <span>|</span>
      {tab.map((measure, measureIndex) => (
        <div key={measureIndex} className="tab-measure-container">
          {measure.map((frame, frameIndex) => (
            <div key={frameIndex} className="tab-frame-container">
              <div
                key={frame.id}
                className={
                  position.measure === measureIndex &&
                  position.index === frameIndex
                    ? "tab-frame tab-current-pos"
                    : "tab-frame"
                }
                onClick={() => updatePosition(measureIndex, frameIndex)}>
                {frame.notes.map((note) => (
                  <p key={frame.notes.indexOf(note)}>{note.fret}</p>
                ))}
              </div>
            </div>
          ))}
          <span>|</span>
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

/*
{tab.map((frame, index) => (
        <div key={nanoid()} className="tab-frame-container">
          <div
            key={frame.id}
            className={
              index === position ? "tab-current-pos tab-frame" : "tab-frame"
            }
            onClick={() => updatePosition(index)}>
            {frame.notes.map((note) => (
              <p key={frame.notes.indexOf(note)}>{note.fret}</p>
            ))}
          </div>
          <button
            className="button-plus"
            onClick={() => addNewTab(index, true)}>
            +
          </button>
        </div>
      ))}
*/
