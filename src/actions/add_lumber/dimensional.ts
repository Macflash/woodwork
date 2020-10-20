import { Operation } from "../operation";

export class AddDimensionalLumber implements Operation {
    readonly type = "ADD";
    constructor(private height: number, private width: number){}

    // needs a starting point
    step1_SetOriginPoint(){}

    // needs another point to set the orientation of the small face.
    step2_SetSecondPoint(){}

    // could possibly MOVE the board a fixed distance from here.
    
    // Sets the length of the board
    step3_SetLength(){}

    // Pick which scrap piece it comes from
}