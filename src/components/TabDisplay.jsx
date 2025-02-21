import PropTypes from "prop-types";
import { nanoid } from "nanoid";

export default function TabDisplay({
  tab,
  position,
  tuning,
  updatePosition,
  addNewFrame,
  addNewMeasure,
}) {
  const renderTuning = (
    <div className="td-tuning">
      {tuning.toReversed().map((note, index) => (
        <p className="td-tuning-note" key={index}>
          {note}
        </p>
      ))}
    </div>
  );

  function interpretNote(note) {
    return note === -2 ? "\u00A0\u00A0" : note === -1 ? "X" : note;
  }

  // TAB CHUNKING
  const flattenedTab = tab.flatMap((measure, measureIndex) =>
    measure.map((frame, frameIndex) => ({
      frame,
      measureIndex,
      frameIndex,
    }))
  );

  const chunkSize = 10;

  const chunkedTab = [];
  for (let i = 0; i < flattenedTab.length; i += chunkSize) {
    console.log(i);
    chunkedTab.push(flattenedTab.slice(i, i + chunkSize));
  }

  return (
    <section className="td-display">
      {chunkedTab.map((chunk, chunkIndex) => (
        <div className="td-row" key={chunkIndex}>
          {renderTuning}
          {chunkIndex === 0 && (
            <>
              <button
                className="button-plus first"
                onClick={() => addNewMeasure(-1)}>
                + Insert measure
              </button>
            </>
          )}
          {chunk.map((frameData) => (
            <div className="td-pre-frame" key={nanoid()}>
              {frameData.frameIndex === 0 && (
                <>
                  <div className="td-measure-bar"></div>
                  <button
                    className="button-plus"
                    onClick={() =>
                      addNewFrame(frameData.measureIndex, -1, true)
                    }>
                    +
                  </button>
                </>
              )}
              <div
                className={
                  position.measure === frameData.measureIndex &&
                  position.frame === frameData.frameIndex
                    ? "td-frame td-current-pos"
                    : "td-frame"
                }
                onClick={() =>
                  updatePosition(frameData.measureIndex, frameData.frameIndex)
                }>
                {frameData.frame.notes.map((note, noteIndex) => (
                  <p key={noteIndex}>{interpretNote(note.fret)}</p>
                ))}
              </div>
              <button
                className="button-plus"
                onClick={() =>
                  addNewFrame(
                    frameData.measureIndex,
                    frameData.frameIndex,
                    true
                  )
                }>
                +
              </button>
            </div>
          ))}
          {chunkIndex === chunkedTab.length - 1 && (
            <>
              <div className="td-measure-bar"></div>
              <button
                className="button-plus last"
                onClick={() => addNewMeasure(tab.length)}>
                + Insert measure
              </button>
            </>
          )}
        </div>
      ))}
    </section>
  );
}

TabDisplay.propTypes = {
  tab: PropTypes.array.isRequired,
  position: PropTypes.number.isRequired,
  tuning: PropTypes.array.isRequired,
  updatePosition: PropTypes.func.isRequired,
  addNewFrame: PropTypes.func.isRequired,
  addNewMeasure: PropTypes.func.isRequired,
};
