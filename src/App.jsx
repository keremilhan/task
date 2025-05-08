import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { CardTree, CardForm } from "./components";
import { addCard } from "./redux/slices/cards";
import { nanoid } from "@reduxjs/toolkit";

function App() {
  const cards = useAppSelector((state) => state.cards);
  const requests = useAppSelector((state) => state.requests);
  const [showSaved, setShowSaved] = useState(false);

  const dispatch = useAppDispatch();
  const [showCardForm, setShowCardForm] = useState(false);

  const rootIds = cards?.allIds?.filter((id) => !cards.byId[id]?.parentId);

  const handleAddTree = () => {
    setShowCardForm(true);
  };

  const handleSubmit = ({ name, selfValue }) => {
    setShowCardForm(false);
    dispatch(
      addCard({
        name,
        selfValue: Number(selfValue),
        totalValue: Number(selfValue),
        parentId: null,
      })
    );
  };

  const handleSave = () => {
    localStorage.setItem("appState", JSON.stringify({ cards, requests }));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1500);
  };

  return (
    <div className="h-screen overflow-auto w-full">
      <div className="fixed top-4 left-4 flex flex-col gap-4 z-10">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded shadow cursor-pointer hover:bg-red-700 transition"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow cursor-pointer hover:bg-blue-700 transition"
          onClick={handleAddTree}
        >
          Add
        </button>
      </div>
      {showSaved && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow z-50 transition">
          Data Saved Successfully!
        </div>
      )}
      <div className="mt-16 h-screen">
        <div className="flex flex-row gap-20 justify-center items-start overflow-x-auto w-full min-w-0 px-8 h-screen">
          {rootIds?.length === 0 && !showCardForm ? (
            <p className="w-full text-center text-gray-400 mt-10">
              No trees yet. Click "Add" to start!
            </p>
          ) : (
            rootIds?.map((id) => (
              <div key={id} className="flex-shrink-0">
                <CardTree cardId={id} />
              </div>
            ))
          )}
          {showCardForm && (
            <div className="flex justify-center items-start">
              <CardForm
                onSubmit={handleSubmit}
                onCancel={() => setShowCardForm(false)}
                treeId={nanoid()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
