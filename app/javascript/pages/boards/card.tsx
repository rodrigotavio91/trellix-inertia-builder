import { useState } from "react";
import invariant from "tiny-invariant";
import { Icon } from "../../icons/icons";
import { CONTENT_TYPES } from "./show";
import { Form, router } from "@inertiajs/react";
import { BoardWithColumnsAndItems } from "../../types/board";

interface CardProps {
  title: string;
  content: string | null;
  id: number;
  columnId: number;
  order: number;
  nextOrder: number;
  previousOrder: number;
}

export function Card({
  title,
  content,
  id,
  columnId,
  order,
  nextOrder,
  previousOrder,
}: CardProps) {
  const [deleted, setDeleted] = useState(false);

  let [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">("none");

  return deleted ? null : (
    <li
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
          event.preventDefault();
          event.stopPropagation();
          let rect = event.currentTarget.getBoundingClientRect();
          let midpoint = (rect.top + rect.bottom) / 2;
          setAcceptDrop(event.clientY <= midpoint ? "top" : "bottom");
        }
      }}
      onDragLeave={() => {
        setAcceptDrop("none");
      }}
      onDrop={(event) => {
        event.stopPropagation();

        let transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card),
        );
        invariant(transfer.id, "missing cardId");
        invariant(transfer.title, "missing title");

        let droppedOrder = acceptDrop === "top" ? previousOrder : nextOrder;
        let moveOrder = (droppedOrder + order) / 2;

        router.put(`/items/${transfer.id}`, {
          column_id: columnId,
          order: moveOrder,
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
                    return { ...item, column_id: columnId, order: moveOrder };
                  } else {
                    return item
                  }
                })
              }
            }
          ),
          onFinish: () => {
            setAcceptDrop("none");
          }
        })

      }}
      className={
        "border-t-2 border-b-2 -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 " +
        (acceptDrop === "top"
          ? "border-t-brand-red border-b-transparent"
          : acceptDrop === "bottom"
            ? "border-b-brand-red border-t-transparent"
            : "border-t-transparent border-b-transparent")
      }
    >
      <div
        draggable={!!id}
        className="bg-white shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative"
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(
            CONTENT_TYPES.card,
            JSON.stringify({ id, title }),
          );
        }}
      >
        <h3>{title}</h3>
        <div className="mt-2">{content || <>&nbsp;</>}</div>
        <Form method="delete" action={`/items/${id}`} onStart={() => setDeleted(true)} showProgress={false}>
          <button
            aria-label="Delete card"
            className="absolute top-4 right-4 hover:text-brand-red disabled:opacity-50"
            type="submit"
            disabled={!id}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Icon name="trash" />
          </button>
        </Form>
      </div>
    </li>
  );
}
