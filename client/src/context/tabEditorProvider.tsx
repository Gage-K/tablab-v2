import { createContext, useState, useEffect, useContext } from "react";
import { nanoid } from "nanoid";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { tabService } from "../api/services/tabService";
import type {
  EditorTabBodyType,
  EditorDetailsType,
  EditorFrameType,
  NoteFretType,
  TuningType,
} from "../shared/types/tab.types";
import type { TabPositionType } from "../shared/types/utilities.types";

interface TabEditorContextType {
  tab: EditorTabBodyType;
  details: EditorDetailsType;
  isLoading: boolean;
  position: TabPositionType;
  editorIsOpen: boolean;
  isEditing: boolean;
  isSaving: boolean;
  updateDetails: (name: string, value: string | TuningType) => void;
  saveChanges: () => Promise<void>;
  handleOpeningEditor: () => void;
  updatePosition: (measure: number, frame: number) => void;
  getEmptyFrame: () => EditorFrameType;
  addNewMeasure: (measure: number) => void;
  addNewFrame: (measure: number, frame: number, isEmpty: boolean) => void;
  addFrameAndAdvance: (measure: number, frame: number, isEmpty: boolean) => void;
  deleteMeasure: (measure: number) => void;
  deleteFrame: (frame: number, measure: number) => void;
  updateTabData: (measure: number, index: number, formData: NoteFretType[]) => void;
}

const TabEditorContext = createContext<TabEditorContextType | null>(null);

export function TabEditorProvider({
  tabId,
  children,
}: {
  tabId: string;
  children: React.ReactNode;
}) {
  const axiosPrivate = useAxiosPrivate();

  const [tab, setTab] = useState<EditorTabBodyType>([]);
  const [details, setDetails] = useState<EditorDetailsType>({
    id: "",
    artist: "",
    song: "",
    tuning: ["E", "B", "G", "D", "A", "E"],
  });
  const isLoading = tab.length === 0;
  const [position, setPosition] = useState<TabPositionType>({ measure: 0, frame: 0 });
  const [editorIsOpen, setEditorIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function updateDetails(name: string, value: string | TuningType) {
    setDetails((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
  }

  useEffect(() => {
    const controller = new AbortController();

    const getTab = async () => {
      try {
        const response = await tabService.getById(axiosPrivate, tabId, controller.signal);
        const data = response.data.data;
        setDetails({
          id: data.id,
          artist: data.details.artist,
          song: data.details.song,
          tuning: data.details.tuning,
        });
        setTab(data.body);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
        }
      }
    };

    getTab();

    return () => {
      controller.abort();
    };
  }, [tabId]);

  async function saveChanges() {
    setIsSaving(true);
    const data = {
      tab_name: details.song,
      tab_artist: details.artist,
      tuning: details.tuning,
      tab_data: tab,
    };

    try {
      await tabService.update(axiosPrivate, tabId, data);
      setIsSaving(false);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }

    setIsEditing(false);
  }

  function handleOpeningEditor() {
    setEditorIsOpen((prev) => !prev);
  }

  function isExistingPosition(measure: number, frame: number) {
    return tab[measure] != undefined ? tab[measure][frame] != undefined : false;
  }

  function isOnlyFrame(measure: number) {
    return tab[measure].length === 1;
  }

  function isOnlyMeasure() {
    return tab.length === 1;
  }

  function updatePosition(measure: number, frame: number) {
    if (isExistingPosition(measure, frame)) {
      setPosition({ measure, frame });
      return;
    }

    if (frame >= tab[measure]?.length) {
      const nextMeasure = measure + 1;
      if (nextMeasure < tab.length) {
        setPosition({ measure: nextMeasure, frame: 0 });
      }
      return;
    }

    if (frame < 0) {
      const prevMeasure = measure - 1;
      if (prevMeasure >= 0) {
        setPosition({
          measure: prevMeasure,
          frame: tab[prevMeasure]?.length - 1 || 0,
        });
      }
      return;
    }
  }

  function getEmptyFrame(): EditorFrameType {
    return {
      id: nanoid(),
      notes: [
        { fret: -2, style: "none" },
        { fret: -2, style: "none" },
        { fret: -2, style: "none" },
        { fret: -2, style: "none" },
        { fret: -2, style: "none" },
        { fret: -2, style: "none" },
      ],
    };
  }

  function getTabByLocation(measure: number, frame: number) {
    return tab[measure][frame];
  }

  function addNewMeasure(measure: number) {
    const newMeasure = [getEmptyFrame()];
    const updatedTab =
      measure === -1
        ? [newMeasure, ...tab]
        : [...tab.slice(0, measure), newMeasure, ...tab.slice(measure)];

    setTab(updatedTab);
    measure === -1 ? updatePosition(0, 0) : updatePosition(measure, 0);
    setIsEditing(true);
  }

  function addNewFrame(measure: number, frame: number, isEmpty: boolean) {
    const newTab = isEmpty
      ? getEmptyFrame()
      : { ...getTabByLocation(measure, frame), id: nanoid() };

    const updatedTab = tab.map((prevMeasure, i) =>
      i === measure
        ? [
            ...prevMeasure.slice(0, frame + 1),
            newTab,
            ...prevMeasure.slice(frame + 1),
          ]
        : prevMeasure
    );

    setTab(updatedTab);
    setIsEditing(true);
  }

  function addFrameAndAdvance(measure: number, frame: number, isEmpty: boolean) {
    addNewFrame(measure, frame, isEmpty);
    updatePosition(measure, frame + 1);
  }

  function deleteMeasure(measure: number) {
    if (isOnlyMeasure()) {
      return;
    }
    setTab((prev) => prev.filter((_prevMeasure, index) => index != measure));
    updatePosition(measure - 1, tab[measure - 1]?.length - 1);
    setIsEditing(true);
  }

  function deleteFrame(frame: number, measure: number) {
    if (isOnlyFrame(measure)) {
      if (isOnlyMeasure()) {
        return;
      } else {
        deleteMeasure(measure);
        return;
      }
    }

    setTab((prev) =>
      prev.map((prevMeasure, i) =>
        i === measure
          ? prevMeasure.filter((_prevFrame, j) => j != frame)
          : prevMeasure
      )
    );

    isExistingPosition(measure, frame + 1)
      ? updatePosition(measure, frame)
      : isExistingPosition(measure + 1, 0)
      ? updatePosition(measure + 1, 0)
      : updatePosition(measure, frame - 1);

    setIsEditing(true);
  }

  function updateTabData(measure: number, index: number, formData: NoteFretType[]) {
    setTab(
      tab.map((prevMeasure, measureIndex) =>
        prevMeasure.map((frame, frameIndex) =>
          frameIndex === index && measureIndex === measure
            ? { id: nanoid(), notes: formData }
            : frame
        )
      )
    );
    setIsEditing(true);
  }

  return (
    <TabEditorContext.Provider
      value={{
        tab,
        details,
        isLoading,
        position,
        editorIsOpen,
        isEditing,
        isSaving,
        updateDetails,
        saveChanges,
        handleOpeningEditor,
        updatePosition,
        getEmptyFrame,
        addNewMeasure,
        addNewFrame,
        addFrameAndAdvance,
        deleteMeasure,
        deleteFrame,
        updateTabData,
      }}>
      {children}
    </TabEditorContext.Provider>
  );
}

export function useTabEditor() {
  const context = useContext(TabEditorContext);
  if (!context) {
    throw new Error("useTabEditor must be used within a TabEditorProvider");
  }
  return context;
}

export default TabEditorContext;
