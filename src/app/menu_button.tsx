import React from 'react';
import { ActionMode, GetMode, SetMode } from '../3d/threetest';
import { border, color } from './styles';
import { renderApp } from '../renderHelper';

export const buttonStyle: React.CSSProperties = {
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

export const enabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: "black",
    backgroundColor: color,
};

export const MenuButton: React.FC<{ mode: ActionMode, text: string }> = props =>
    <button style={GetMode() === props.mode ? enabledButtonStyle : buttonStyle} onClick={() => {
        SetMode(props.mode);
        renderApp();
    }}>
        {props.text}
    </button>;