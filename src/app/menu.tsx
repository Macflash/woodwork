import React from 'react';
import { border } from './styles';

export const menuStyle: React.CSSProperties = {
    border,
    position: "absolute",
    color: "#00FF88",
    fontFamily: `"Lucida Console", Monaco, monospace`,
    fontSize: 14,
    padding: 10,
};

export const Menu: React.FC<{ title?: string, top?: number | string, bottom?: number | string, right?: number | string, left?: number | string }> = props => {
    const { top, left, right, bottom, title } = props;
    return <div style={{ ...menuStyle, top, left, right, bottom }}>
        {title ? <div>{title}</div> : null}
        {props.children}
    </div>;
}
