import React, { useCallback } from 'react';
import './App.css';
import { Board, clearSelection, getBoards, getPendingBoard, getSelectionLength, setPendingBoard } from './board';
import { Vector3 } from 'three';
import { getControlsState, GetMode, SetMode, setupThreeScene } from './threetest';
import { registerAppRender } from './renderHelper';


const twoByFour = new Board(2, 4, 48, new Vector3(-12, 0, -15));
const twoByFour2 = new Board(2, 4, 24, twoByFour.vertices[1]).rotateY();
const twoByFour3 = new Board(2, 4, 48, twoByFour2.vertices[4]);
setupThreeScene();
twoByFour.drawToScene().fix();
twoByFour2.drawToScene().fix();
twoByFour3.drawToScene().fix();

function App() {
  const [_, setState] = React.useState(0);


  const rerender = useCallback(() => {
    setState(Math.random());
  }, [setState]);

  React.useEffect(() => {
    registerAppRender(rerender);
  }, [rerender]);

  const color = "#00FF88";
  const border = `1px solid ${color}`;

  const buttonStyle: React.CSSProperties = {
    cursor: "pointer",
    width: 50,
    height: 50,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border,
    margin: 10,
    backgroundColor: "black",
    color,
  };

  const enabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: "black",
    backgroundColor: color,
  };

  return (
    <div className="App">
      {
        // <canvas id="canvas" width="600" height="600" />
      }
      <div style={{
        position: "absolute",
        color,
        top: 10,
        left: 10,
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 32
      }}>
        WoodWork
      </div>

      {GetMode() === "ADD" ?

        <div style={{
          border,
          position: "absolute",
          color: "#00FF88",
          right: 10,
          bottom: 10,
          fontFamily: `"Lucida Console", Monaco, monospace`,
          fontSize: 12,
          padding: 10,
        }}>
          Items
        <br />

          {getPendingBoard()
            ? <button style={enabledButtonStyle} onClick={() => {
              setPendingBoard(null);
              rerender();
            }}>
              Cancel
            </button>

            : <button style={buttonStyle} onClick={() => {
              setPendingBoard(new Board(2, 4, 12, undefined, true));
              rerender();
            }}>
              2x4
        </button>
          }
        </div>
        : null}

      <div style={{
        border,
        position: "absolute",
        color: "#00FF88",
        right: 10,
        top: 10,
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 14,
        padding: 10,
      }}>
        Boards
        <br />

        {getBoards().map(b => <div
          style={{ cursor: "pointer", margin: 2, padding: 2, border: b.selected ? border : '1px solid black', color: b.selected ? "#FF0066" : (b.hovered ? "#00FFFF" : undefined) }}
          onMouseEnter={() => { b.hover(); rerender(); }}
          onMouseLeave={() => { b.unhover(); rerender(); }}
          onClick={() => { if (b.selected) { b.unselect() } else { b.select(); } rerender(); console.log("clicked", b); }}
        >{b.name}
        </div>
        )}

      </div>

      <div style={{
        border,
        position: "absolute",
        color: "#00FF88",
        left: 10,
        bottom: 10,
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
        padding: 10,
      }}>
        Actions
        <br />

        <div style={{ display: "flex", flexDirection: 'row' }}>
          <button style={GetMode() === "MOVE" ? enabledButtonStyle : buttonStyle} onClick={() => {
            SetMode("MOVE");
            rerender();
          }}>
            Move
          </button>

          <button style={GetMode() === "SELECT" ? enabledButtonStyle : buttonStyle} onClick={() => {
            SetMode("SELECT");
            rerender();
          }}>
            Select
          </button>

          <button style={GetMode() === "ADD" ? enabledButtonStyle : buttonStyle} onClick={() => {
            SetMode("ADD");
            rerender();
          }}>
            Add
          </button>
        </div>

      </div>

      {GetMode() === "SELECT" ?
        <div style={{
          border,
          position: "absolute",
          color: "#00FF88",
          right: 10,
          bottom: 10,
          fontFamily: `"Lucida Console", Monaco, monospace`,
          fontSize: 12,
          padding: 10,
        }}>
          Selection
        <br />

          <div style={{ display: "flex", flexDirection: 'row' }}>
            <button
              style={getSelectionLength() > 0 ? enabledButtonStyle : buttonStyle} onClick={() => {
                clearSelection();
                rerender();
              }}>
              Clear
          </button>
          </div>

        </div>
        : null
      }



    </div>
  );
}

export default App;
