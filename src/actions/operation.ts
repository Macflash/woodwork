import { Vector3 } from "three";
import { Board } from "../lumber/board";

// Each board can have a series of operations performed once it is created.
export type OperationType = "MOVE" | "ADD";

// UX Operation also has some Menus or other things associated with it.
export interface Operation {
    type: OperationType;
}

export interface Step {
    // Needs some MENU

    // and probably some rendering logic
}

export interface Move extends Operation {
    getMove(): Vector3;
}

export class Translate implements Move {
    readonly type = "MOVE";
    constructor(private vector: Vector3) { }
    getMove() {
        return this.vector;
    }
}

export class Attach implements Move {
    readonly type = "MOVE";
    constructor(private board: Board, private vertex: number) { }
    getMove() {
        return this.board.vertices[this.vertex];
    }
}