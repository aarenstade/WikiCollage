import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";

interface SelectedVal {
  id: number;
  editing: boolean;
}

interface UseSelectedElementValue {
  selected: boolean;
  editing: boolean;
  setId: (val: SelectedVal | null) => void;
}

const useSelectedElement = (id: number): UseSelectedElementValue => {
  const [selectedId, setSelectedId] = useRecoilState(SelectedElementIdState);

  const isSelected = () => (selectedId?.id === id ? true : false);
  const isEditing = () => (selectedId?.id === id && selectedId?.editing ? true : false);

  const [selected, setSelected] = useState(isSelected());
  const [editing, setEditing] = useState(isEditing());

  const setId = (e: SelectedVal | null) => (e ? setSelectedId({ id: e.id, editing: e.editing }) : setSelectedId(null));

  useEffect(() => {
    setSelected(isSelected());
    setEditing(isEditing());
  }, [selectedId]);

  return {
    selected,
    editing,
    setId,
  };
};

export default useSelectedElement;
