import { useMemo, CSSProperties, memo } from "react";
import  { useTheme } from "../standard_ui/standard_ui";
import { SortElement } from "../pages/sort/Elements";

interface PropsElementView
{
    prElement: SortElement;
    prLengthOuter: number;
    prLengthOuterStatic: number | string;
    prLengthInnerStatic: number | string;
    prIsColumn?: boolean;
    prIsLastElement?: boolean;
    prUpdater?: object;
}

/**
* The view for the Element class. This is designed to be used to display an element in the graph.

* @param {React.ReactNode} prIcon The icon.
*/
const ElementView = memo(

    function ElementView({ prElement, prLengthOuter, prLengthOuterStatic,  prLengthInnerStatic, prIsColumn = true, 
                           prIsLastElement = false, prUpdater } : PropsElementView)
    {
        const { theme } = useTheme();

        const lStyleOuter = useMemo<CSSProperties>(
            () =>
            {;
                if (prIsColumn)
                {
                    return { 
                        height: `${prLengthOuter}%`, width: prLengthOuterStatic, 
                        borderLeft: `1px solid ${theme?.cst.elementView.border}`, justifyContent: "end",
                    };
                }
                else
                {
                    return { 
                        width: `${prLengthOuter}%`, height: prLengthOuterStatic, 
                        borderTop: `1px solid ${theme?.cst.elementView.border}`, justifyContent: "start", flexDirection: "row",
                    };
                }
            },
            [ prLengthOuter, prLengthOuterStatic, theme, prIsColumn ]
        );

        const lStyleInner = useMemo<CSSProperties>(
            () =>
            {
                let lStyleBorders : CSSProperties = { };

                if (prIsColumn)
                {
                    lStyleBorders = {
                        border: `1px solid ${theme?.cst.elementView.border}`,
                        borderRight: `1px solid ${theme?.cst.elementView.border}`,
                        borderLeft: "none",
                        borderRadius: 3
                    };
                }
                else
                {
                    lStyleBorders ={
                        border: `1px solid ${theme?.cst.elementView.border}`,
                        borderBottom: `1px solid ${theme?.cst.elementView.border}`,
                        borderTop: "none",
                        borderRadius: 3
                    };
                }

                if (!prIsLastElement)
                {
                    if (prIsColumn)
                        lStyleBorders.borderRight = "none";
                    else
                        lStyleBorders.borderBottom = "none"; 
                }

                let lLengthInner = `${100.0 * (prElement.value / prLengthOuter)}%`;

                let lBackground = theme?.cst.elementView.background;
                if (prElement.state == "C")
                    lBackground = theme?.cst.elementView.backgroundComp;
                else if (prElement.state == "SW")
                    lBackground = theme?.cst.elementView.backgroundSwap;
                else if (prElement.state == "ST")
                    lBackground = theme?.cst.elementView.backgroundSet;

                if (prIsColumn)
                {
                    return {
                        height: lLengthInner, width: prLengthInnerStatic, 
                        backgroundColor: lBackground,
                        ...lStyleBorders,
                    };
                }
                else
                {
                    return {
                        height: prLengthInnerStatic, width: lLengthInner,
                        backgroundColor: lBackground,
                        ...lStyleBorders,
                    };
                }

            },
            [ prIsColumn, prElement, prLengthOuter, prLengthInnerStatic, prIsLastElement, theme ]
        );

        return (
            <div 
                style = { lStyleOuter }
            >
                <div
                    style = { lStyleInner }
                >
                </div>
            </div>
        );
    }

)

export default ElementView;