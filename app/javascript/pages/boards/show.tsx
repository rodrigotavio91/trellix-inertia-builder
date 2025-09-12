import { useRef } from "react";
import type { Board, BoardWithColumnsAndItems, Column as ColumnType, Item } from "../../types/board";
import invariant from "tiny-invariant";
import { EditableText } from "./components";
import { NewColumn } from "./new-column";
import { Column } from "./column";
import { Head } from "@inertiajs/react";

export const CONTENT_TYPES = {
  card: "application/remix-card",
  column: "application/remix-column",
};

export default function Board({ board }: { board: BoardWithColumnsAndItems }) {
  let columns = new Map<number, ColumnType & { items: Item[] }>();
  for (let column of board.columns) {
    columns.set(column.id, { ...column, items: [] });
  }

  // add items to their columns
  for (let item of board.items) {
    let columnId = parseInt(item.column_id.toString());
    let column = columns.get(columnId);
    invariant(column, "missing column");
    column.items.push(item);
  }

  // scroll right when new columns are added
  let scrollContainerRef = useRef<HTMLDivElement>(null);
  function scrollRight() {
    invariant(scrollContainerRef.current, "no scroll container");
    scrollContainerRef.current.scrollLeft =
      scrollContainerRef.current.scrollWidth;
  }

  return (
    <>
      <Head>
        <title>Trellix</title>
      </Head>
      <div
        className="h-full min-h-0 flex flex-col overflow-x-scroll"
        ref={scrollContainerRef}
        style={{ backgroundColor: board.color }}
      >
        <h1>
          <EditableText
            action={`/boards/${board.id}`}
            value={board.name}
            fieldName="name"
            inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
            buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
            buttonLabel={`Edit board "${board.name}" name`}
            inputLabel="Edit board name"
          />
        </h1>

        <div className="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
          {[...columns.values()].map((col) => {
            return (
              <Column
                key={col.id}
                name={col.name}
                boardId={board.id}
                columnId={col.id}
                items={col.items}
              />
            );
          })}

          <NewColumn
            boardId={board.id}
            onAdd={scrollRight}
            editInitially={board.columns.length === 0}
          />

          {/* trolling you to add some extra margin to the right of the container with a whole dang div */}
          <div data-lol className="w-8 h-1 flex-shrink-0" />
        </div>
      </div>
    </>
  );
}
