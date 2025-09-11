import { Form } from "@inertiajs/react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { SaveButton, CancelButton } from "./components";

export function NewCard({
  boardId,
  columnId,
  nextOrder,
  onComplete,
  onAddCard,
}: {
  boardId: number;
  columnId: number;
  nextOrder: number;
  onComplete: () => void;
  onAddCard: () => void;
}) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Form
      method="post"
      action="/items"
      className="flex flex-col gap-2.5 p-2 pt-1"
      onSuccess={() => {
        invariant(textAreaRef.current);
        textAreaRef.current.value = "";
        onAddCard();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onComplete();
        }
      }}
    >
      <input
        type="hidden"
        name="board_id"
        value={boardId}
      />
      <input
        type="hidden"
        name="column_id"
        value={columnId}
      />
      <input
        type="hidden"
        name="order"
        value={nextOrder}
      />

      <textarea
        autoFocus
        required
        ref={textAreaRef}
        name="title"
        placeholder="Enter a title for this card"
        className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }
          if (event.key === "Escape") {
            onComplete();
          }
        }}
      />
      <div className="flex justify-between">
        <SaveButton ref={buttonRef}>Save Card</SaveButton>
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
      </div>
    </Form>
  );
}
