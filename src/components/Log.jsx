const Log = ({
  currentCardId,
  cards,
  to,
  from,
  points,
  status,
  rejectReason,
}) => {
  const isRequester = from === currentCardId;
  const otherCardName =
    cards.byId[isRequester ? to : from]?.name || "Deleted User";
  const otherCardShortId = cards.byId[isRequester ? to : from]?.shortId;

  const capitilize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <li>
      <div className="flex flex-col gap-1 bg-blue-50 rounded-lg px-4 py-2 shadow-sm border border-blue-100">
        <div className="flex items-center gap-3">
          <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded w-[70px] text-center break-words inline-block">
            {status !== "accepted" ? "" : isRequester ? "+" : "-"}
            {points} pts
          </span>
          <span className="text-gray-600 flex-1">
            {isRequester ? (
              <div className="break-word inline-block">
                requested from{" "}
                <span className="font-semibold text-gray-700 ">
                  {otherCardName}
                  <span className="text-gray-400 ms-2 inline-block">
                    {otherCardShortId}
                  </span>
                </span>
              </div>
            ) : (
              <div className="break-word inline-block">
                {" "}
                requested by{" "}
                <span className="font-semibold text-gray-700">
                  {otherCardName}
                </span>
                <span className="text-gray-400 ms-2">{otherCardShortId}</span>
              </div>
            )}
          </span>
          <span
            className={`font-semibold px-2 py-1 rounded ${
              status === "accepted"
                ? "text-green-600 bg-green-50"
                : status === "rejected"
                ? "text-red-600 bg-red-50"
                : "text-gray-400 bg-gray-100"
            }`}
          >
            {capitilize(status)}
          </span>
        </div>
        {status === "rejected" && isRequester && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-red-100 border border-red-200">
            <p className="font-semibold text-red-700 text-center">Reason</p>
            <p className="ml-1 text-red-600">{rejectReason}</p>
          </div>
        )}
      </div>
    </li>
  );
};

export default Log;
