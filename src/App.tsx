import React, { useCallback } from 'react';
import './App.css';
import { Board, clearSelection, getBoards, getPendingBoard, getSelectionLength, setPendingBoard } from './lumber/board';
import { Vector3 } from 'three';
import { GetMode, setupThreeScene } from './3d/threetest';
import { registerAppRender } from './renderHelper';
import {border, color, rowStyle} from './app/styles';
import { Menu } from './app/menu';
import { enabledButtonStyle, buttonStyle, MenuButton } from './app/menu_button';


const twoByFour = new Board(2, 4, 48, new Vector3(-12, 0, -15));
const twoByFour2 = new Board(2, 4, 24, twoByFour.vertices[1]).rotateY();
const twoByFour3 = new Board(2, 4, 48, twoByFour2.vertices[4]);
setupThreeScene();
twoByFour.drawToScene().fix();
twoByFour2.drawToScene().fix();
twoByFour3.drawToScene().fix();

function App() {
  const [, setState] = React.useState(0);


  const rerender = useCallback(() => {
    setState(Math.random());
  }, [setState]);

  React.useEffect(() => {
    registerAppRender(rerender);
  }, [rerender]);

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

      {GetMode() === "ADD"  && getPendingBoard() ?
        <Menu bottom={150} right={10}>
          <div>
          1. Set attachment point
          </div>
          <div>
            2. set length
          </div>
        </Menu>
      : null}

      {GetMode() === "ADD" ?

        <Menu right={10}
          bottom={10}>
          Items
        <br />

          {getPendingBoard()
            ? <button style={enabledButtonStyle} onClick={() => {
              setPendingBoard(null);
              rerender();
            }}>
              Cancel
            </button>

            : <>
              <button style={buttonStyle} onClick={() => {
                setPendingBoard(new Board(2, 4, 12, undefined, true));
                rerender();
              }}>
                2x4
        </button>

              <button style={buttonStyle} onClick={() => {
                setPendingBoard(new Board(12, .75, 12, undefined, true));
                rerender();
              }}>
                Plywood
        </button>
            </>
          }
        </Menu>
        : null}

      <Menu title="Boards" right={10} top={10} >
        {getBoards().map(b => <div
          style={{ cursor: "pointer", margin: 2, padding: 2, border: b.selected ? border : '1px solid black', color: b.selected ? "#FF0066" : (b.hovered ? "#00FFFF" : undefined) }}
          onMouseEnter={() => { b.hover(); rerender(); }}
          onMouseLeave={() => { b.unhover(); rerender(); }}
          onClick={() => { if (b.selected) { b.unselect() } else { b.select(); } rerender(); console.log("clicked", b); }}
        >{b.name}
        </div>
        )}

      </Menu>

      <Menu title="Actions" left={10} bottom={10}>
        <div style={rowStyle}>
          <MenuButton mode="MOVE" text="Move" />
          <MenuButton mode="SELECT" text="Select" />
          <MenuButton mode="ADD" text="Add" />
        </div>
      </Menu>

      {GetMode() === "SELECT" ?
        <Menu title="Selection" right={10} bottom={10} >
          <div style={rowStyle}>
            <button
              style={getSelectionLength() > 0 ? enabledButtonStyle : buttonStyle} onClick={() => {
                clearSelection();
                rerender();
              }}>
              Clear
          </button>
          </div>

        </Menu>
        : null
      }

    </div>
  ); 
}

export default App;
