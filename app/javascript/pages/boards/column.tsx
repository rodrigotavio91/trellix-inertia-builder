import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import invariant from "tiny-invariant";
import { Icon } from "../../icons/icons";
import { EditableText } from "./components";
import { NewCard } from "./new-card";
import { Board, BoardWithColumnsAndItems, Item } from "../../types/board";
import { CONTENT_TYPES } from "./show";
import { Card } from "./card";
import { router, usePage } from '@inertiajs/react'

interface ColumnProps {
  name: string;
  boardId: number;
  columnId: number;
  items: Item[];
}

export function Column({ name, boardId, columnId, items }: ColumnProps) {
  let [acceptDrop, setAcceptDrop] = useState(false);
  let [edit, setEdit] = useState(false);
  let listRef = useRef<HTMLUListElement>(null);

  function scrollList() {
    invariant(listRef.current);
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }

  return (
    <div
      className={
        "flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100 " +
        (acceptDrop ? `outline outline-2 outline-brand-red` : ``)
      }
      onDragOver={(event) => {
        if (
          items.length === 0 &&
          event.dataTransfer.types.includes(CONTENT_TYPES.card)
        ) {
          event.preventDefault();
          setAcceptDrop(true);
        }
      }}
      onDragLeave={() => {
        setAcceptDrop(false);
      }}
      onDrop={(event) => {
        let transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card),
        );
        invariant(transfer.id, "missing transfer.id");
        invariant(transfer.title, "missing transfer.title");

        router.put(`/items/${transfer.id}`, {
          column_id: columnId,
          order: 1,
        }, {
          showProgress: false,
        })

        router.replace({
          preserveState: true,
          props: (current: { board: BoardWithColumnsAndItems }) => (
            {
              ...current,
              board: {
                ...current.board,
                items: current.board.items.map(item => {
                  if (item.id === transfer.id) {
                    return { ...item, column_id: columnId, order: 1 };
                  } else {
                    return item
                  }
                })
              }
            }
          ),
          onFinish: () => {
            setAcceptDrop(false);
          }
        })
      }}
    >
      <div className="p-2">
        <EditableText
          action={`/columns/${columnId}`}
          fieldName="name"
          value={name}
          inputLabel="Edit column name"
          buttonLabel={`Edit column "${name}" name`}
          inputClassName="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
          buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
        />
      </div>

      <ul ref={listRef} className="flex-grow overflow-auto min-h-[2px]">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, index, items) => (
            <Card
              key={item.id}
              title={item.title}
              content={item.content}
              id={item.id}
              order={item.order}
              columnId={columnId}
              previousOrder={items[index - 1] ? items[index - 1].order : 0}
              nextOrder={
                items[index + 1] ? items[index + 1].order : item.order + 1
              }
            />
          ))}
      </ul>
      {edit ? (
        <NewCard
          boardId={boardId}
          columnId={columnId}
          nextOrder={items.length === 0 ? 1 : items[items.length - 1].order + 1}
          onAddCard={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <div className="p-2 pt-1">
          <button
            type="button"
            onClick={() => {
              flushSync(() => {
                setEdit(true);
              });
              scrollList();
            }}
            className="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200"
          >
            <Icon name="plus" /> Add a card
          </button>
        </div>
      )}
    </div>
  );
}
