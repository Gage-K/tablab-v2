import PropTypes from "prop-types";

export default function TabDetails({
  song,
  artist,
  creator,
  dateCreated,
  dateModified,
  tuning,
}) {
  return (
    <section>
      <h1>Song: {song}</h1>
      <p>Artist: {artist}</p>
      <p>Creator: {creator}</p>
      <p>Date created: {dateCreated}</p>
      <p>Date modified: {dateModified}</p>
      <p>Tuning: {tuning}</p>
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
