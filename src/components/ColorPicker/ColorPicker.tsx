import React, {
    ChangeEvent,
    Dispatch,
    FC,
    SetStateAction,
    useMemo,
    useState,
    useEffect,
} from "react";
import { Color, FreeColor, FreeColorMap, PaidColor, PaidColorMap } from "../../colorMap";
import { formatString } from "../../utils/formatString";
import { ColorCheckbox } from "../ColorCheckbox/ColorCheckbox";

export const ColorPicker: FC<{
    colorList?: Color[];
    setSelectedColorState: Dispatch<SetStateAction<Color[]>>;
    selectedColorState: Color[];
    defaultAllFree?: boolean;
    defaultAllPaid?: boolean;
}> = ({ colorList, selectedColorState, setSelectedColorState, defaultAllFree, defaultAllPaid }) => {
    const [search, setSearch] = useState<string>("");
    const [allFree, setAllFree] = useState<boolean>(defaultAllFree ?? true);
    const [allPaid, setAllPaid] = useState<boolean>(defaultAllPaid ?? true);

    const colorCheckboxOnchange = (event: ChangeEvent<HTMLInputElement>, key: Color) => {
        if (event.target.checked) {
            setSelectedColorState((prev) => [...prev, key]);
        } else {
            setSelectedColorState((prev) => prev.filter((color) => color !== key));
        }
    };

    useEffect(() => {
        const freeColors = Array.from(FreeColorMap.keys()).filter((key) =>
            colorList?.length ? colorList.includes(key) : true,
        );

        setSelectedColorState((prev) => {
            const withoutFree = prev.filter(
                (color) => !FreeColorMap.has(color as keyof typeof FreeColor),
            );
            return allFree ? [...withoutFree, ...freeColors] : withoutFree;
        });
    }, [allFree, colorList]);

    useEffect(() => {
        const paidColors = Array.from(PaidColorMap.keys()).filter((key) =>
            colorList?.length ? colorList.includes(key) : true,
        );

        setSelectedColorState((prev) => {
            const withoutPaid = prev.filter(
                (color) => !PaidColorMap.has(color as keyof typeof PaidColor),
            );
            return allPaid ? [...withoutPaid, ...paidColors] : withoutPaid;
        });
    }, [allPaid, colorList]);

    const createColorCheckRenderer = (input: IterableIterator<any>) => {
        return Array.from(input)
            .filter(([key]: any) => {
                return colorList?.length ? colorList.includes(key) : true;
            })
            .filter(([key]: any) => formatString(key).toLowerCase().includes(search.toLowerCase()))
            .map(([key, value]: any) => {
                return (
                    <ColorCheckbox
                        key={key + "-" + value}
                        onChange={(event) => colorCheckboxOnchange(event, key)}
                        color={value}
                        name={key}
                        checked={selectedColorState.includes(key)}
                    />
                );
            });
    };

    const ColorCheckRenderer = useMemo(() => {
        return createColorCheckRenderer(FreeColorMap.entries());
    }, [FreeColorMap, search, selectedColorState]);

    const PaidColorCheckRenderer = useMemo(() => {
        return createColorCheckRenderer(PaidColorMap.entries());
    }, [FreeColorMap, search, selectedColorState]);

    return (
        <>
            <input
                type={"search"}
                onChange={(event) => setSearch(event.target.value)}
                className={"btn btn-sm"}
                placeholder={"Search"}
                onKeyDown={(event) => {
                    event.stopPropagation();
                }}
                style={{ width: "100%" }}
            />
            <label>
                <input
                    type={"checkbox"}
                    style={{ marginRight: "10px" }}
                    checked={allFree}
                    onChange={(event) => setAllFree(event.target.checked)}
                />
                Free Colors
            </label>
            <div className={"Grid"}>{ColorCheckRenderer}</div>
            <label>
                <input
                    type={"checkbox"}
                    style={{ marginRight: "10px" }}
                    checked={allPaid}
                    onChange={(event) => setAllPaid(event.target.checked)}
                />
                Paid colors
            </label>
            <div className={"Grid"}>{PaidColorCheckRenderer}</div>
        </>
    );
};
