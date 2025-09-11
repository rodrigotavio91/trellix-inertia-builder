import type { Board } from "../../types/board";

export default function Board({ board }: { board: Board }) {
  return <h1>{board.name}</h1>
}
