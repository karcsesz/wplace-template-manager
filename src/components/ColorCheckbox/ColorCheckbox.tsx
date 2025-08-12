import "./ColorCheckbox.css";
import { formatString } from "../../utils/formatString";
import React, { ChangeEvent, FC } from "react";

export const ColorCheckbox: FC<{
    checked?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    color: string;
}> = ({ checked, onChange, name, color }) => {
    return (
        <label className={"ColorCheckbox"}>
            <input
                type={"checkbox"}
                checked={checked}
                onChange={onChange}
                style={{ backgroundColor: color }}
            />
            <span>{formatString(name)}</span>
        </label>
    );
};
