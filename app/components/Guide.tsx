"use client";

const Guide = ({ activeModelId }: { activeModelId: string | null }) => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");

  return (
    <div className="fixed select-none bottom-10 left-10 flex flex-col space-y-2 text-xs text-neutral-500 pointer-events-none">
      {activeModelId && (
        <>
          <div>
            Press the{" "}
            <span className="px-[2px] bg-neutral-900 border border-neutral-800 p-[1px] text-[10px] rounded">
              M
            </span>{" "}
            key to move.
          </div>
          <div>
            Press the{" "}
            <span className="px-[2px] bg-neutral-900 border border-neutral-800 p-[1px] text-[10px] rounded">
              R
            </span>{" "}
            key to rotate.
          </div>
          <div>
            Press the{" "}
            <span className="px-[2px] bg-neutral-900 border border-neutral-800 p-[1px] text-[10px] rounded">
              S
            </span>{" "}
            key to change size.
          </div>
          <div>
            Press the{" "}
            <span className="px-[2px] bg-neutral-900 border border-neutral-800 p-[1px] text-[10px] rounded">
              Backspace
            </span>{" "}
            key to delete.
          </div>
        </>
      )}
      <div>
        Hold down the{" "}
        <span className="px-[2px] bg-neutral-900 border border-neutral-800 p-[1px] text-[10px] rounded">
          ALT
        </span>{" "}
        key to rotate the screen.
      </div>
      <div>
        Hold down the{" "}
        <span className="px-[2px] bg-neutral-900 border border-neutral-800 p-[1px] text-[10px] rounded">
          {isMac ? "CMD" : "CTRL"}
        </span>{" "}
        key to scroll the screen.{" "}
      </div>
    </div>
  );
};

export default Guide;
