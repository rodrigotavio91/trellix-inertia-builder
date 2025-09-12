import { Link, Form } from "@inertiajs/react";
import { Button } from "../../components/button";
import { LabeledInput, Label } from "../../components/input";
import { Icon } from "../../icons/icons";
import type { Board } from "../../types/board";
import { useState } from "react";

export default function Projects({ boards }: { boards: Board[] }) {
  return (
    <div className="h-full">
      <NewBoard />
      <Boards boards={boards} />
    </div>
  );
}

function Boards({ boards }: { boards: Board[] }) {
  return (
    <div className="p-8">
      <h2 className="font-bold mb-2 text-xl">Boards</h2>
      <nav className="flex flex-wrap gap-8">
        {boards.map((board) => (
          <Board
            key={board.id}
            name={board.name}
            id={board.id}
            color={board.color}
          />
        ))}
      </nav>
    </div>
  );
}

function Board({
  name,
  id,
  color,
}: {
  name: string;
  id: number;
  color: string;
}) {
  const [deleted, setDeleted] = useState(false);

  return deleted ? null : (
    <Link
      href={`/boards/${id}`}
      className="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white relative"
      style={{ borderColor: color }}
    >
      <div className="font-bold">{name}</div>
      <Form method="delete" action={`/boards/${id}`} showProgress={false} onStart={() => setDeleted(true)}>
        <button
          aria-label="Delete board"
          className="absolute top-4 right-4 hover:text-brand-red"
          type="submit"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Icon name="trash" />
        </button>
      </Form>
    </Link>
  );
}

function NewBoard() {
  return (
    <Form method="post" action="/boards" className="p-8 max-w-md">
      {({ processing }) => (
        <>
          <input type="hidden" name="intent" value="createBoard" />
          <div>
            <h2 className="font-bold mb-2 text-xl">New Board</h2>
            <LabeledInput label="Name" name="name" type="text" required />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Label htmlFor="board-color">Color</Label>
              <input
                id="board-color"
                name="color"
                type="color"
                defaultValue="#cbd5e1"
                className="bg-transparent"
              />
            </div>
            <Button type="submit">{processing ? "Creating..." : "Create"}</Button>
          </div>
        </>
      )}
    </Form>
  );
}
