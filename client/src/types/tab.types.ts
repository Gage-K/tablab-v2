export type Id = string;
export type TuningNote =
  | "A"
  | "A#"
  | "Ab"
  | "B"
  | "Bb"
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "Db"
  | "E"
  | "Eb"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "Gb";
export type Tuning = [
  TuningNote,
  TuningNote,
  TuningNote,
  TuningNote,
  TuningNote,
  TuningNote
];

type NoteStyle =
  | "none"
  | "hammerOn"
  | "pullOff"
  | "bend"
  | "slide"
  | "harmonic"
  | "tap";

export type NoteFret = {
  fret: number;
  style: NoteStyle;
};
export type Frame = [
  NoteFret,
  NoteFret,
  NoteFret,
  NoteFret,
  NoteFret,
  NoteFret
];

export type Measure = Frame[];

export type TabBody = Measure[];

export type TabDetails = {
  song: string;
  artist: string;
  creator: string;
  dateCreated: string;
  dateModified: string;
  tuning: Tuning;
};

export type Tab = {
  id: Id;
  details: TabDetails;
  body: TabBody;
};
