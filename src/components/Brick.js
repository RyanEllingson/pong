import React from "react";

export default function Brick({ style }) {
    return (
        <div
            style={{
                position: "absolute",
                width: "25px",
                height: "100px",
                background: "salmon",
                border: "2px solid #333",
                ...style
            }}
        />
    );
}