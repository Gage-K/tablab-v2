import React from "react";
import { useState } from "react";

import PropTypes from "prop-types";

export default function TabDetails({
  song,
  artist,
  creator,
  dateCreated,
  dateModified,
  tuning,
}) {
  const [isShown, setIsShown] = useState(false);

  return (
    <section>
      <h1>Song: {song}</h1>
      <button onClick={() => setIsShown((prev) => !prev)}>
        {isShown ? "Hide" : "Show"} details
      </button>
      {isShown ? (
        <>
          <p>Artist: {artist}</p>
          <p>Creator: {creator}</p>
          <p>Date created: {dateCreated}</p>
          <p>Date modified: {dateModified}</p>
          <p>Tuning: {tuning}</p>
        </>
      ) : null}
    </section>
  );
}

TabDetails.propTypes = {
  song: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  dateCreated: PropTypes.number.isRequired,
  dateModified: PropTypes.number.isRequired,
  tuning: PropTypes.string.isRequired,
};
