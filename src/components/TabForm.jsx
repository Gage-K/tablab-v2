import React from "react";

export default function TabForm() {
  const strings = [1, 2, 3, 4, 5, 6]; // eventually this will be customizable
  const frets = [
    -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24,
  ];

  const allFields = (
    <>
      {strings.map((string) => (
        <fieldset key={string} className="form-string">
          <span className="legend">
            <legend>{`String ${string}`}</legend>
          </span>
          <div className="form-string-fret">
            {frets.map((fret) => (
              <label key={fret} className="form-fret">
                {string === 1 ? fret : null}

                <input
                  type="radio"
                  name={`string${string}`}
                  value={fret}
                  defaultChecked={fret === -2 ? true : false}
                />
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </>
  );

  return (
    <section className="tab-form-section">
      <form>{allFields}</form>
    </section>
  );
}
