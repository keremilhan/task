import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { addCard } from "../redux/slices/cards";

const CardForm = ({ onCancel, parentId, treeId }) => {
  const [name, setName] = useState("Test");
  const [value, setValue] = useState(100);

  const dispatch = useAppDispatch();

  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      formRef.current.focus();
    }
  }, []);
  return (
    <div
      ref={formRef}
      tabIndex={-1}
      className="w-80 max-w-xs rounded-xl shadow-lg p-2 pt-3 bg-white border-dashed border-2 border-gray-300"
    >
      <div className="flex justify-between items-center mx-3">
        <img
          className="w-16 h-16 rounded-full"
          src={`https://i.pravatar.cc/300?u=${parentId + treeId}`}
          alt="Profile Picture"
        />
        <input
          className="w-full border-gray-300 outline-none px-2 py-1 text-lg font-semibold placeholder:italic placeholder:text-gray-400"
          placeholder="Name"
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <hr className="h-0.5 border-0 w-full mt-3 bg-gray-300" />
      <div className="px-6 py-3 flex items-center justify-between">
        <span className="text-gray-500 font-medium">Self:</span>
        <input
          className="text-lg font-semibold text-gray-800 border-gray-200 outline-none px-2 py-1 w-20 placeholder:italic placeholder:text-gray-400"
          placeholder="Value"
          type="number"
          min={0}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val < 0) {
              setValue(0);
            } else {
              setValue(val);
            }
          }}
        />
      </div>
      <div className="flex justify-end gap-2 px-6 pb-2">
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer"
          onClick={() => {
            dispatch(
              addCard({
                name,
                selfValue: value,
                totalValue: value,
                parentId,
                treeId: treeId ? treeId : null,
              })
            );
            onCancel();
          }}
        >
          Save
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-4 py-1 rounded cursor-pointer"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CardForm;
