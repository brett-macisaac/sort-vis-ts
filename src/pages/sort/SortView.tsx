import React, { useMemo, CSSProperties } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PaletteIcon from '@mui/icons-material/Palette';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { ButtonStd, PageContainerStd, useTheme, useWindowSize, SliderStd, ComboBoxStd, 
         StylesPageContainerStd, StylesButtonStd, StylesComboBoxStd, StylesSliderStd } from "../../standard_ui/standard_ui";

import ElementView from '../../components/ElementView';

import { SortElement } from './Elements';

import { sortAlgoNames, ranges } from './sort_resources';

import { IconFunc } from '../../standard_ui/types';

interface PropsSortView
{
    prElements: SortElement[];
    prNumElements: number;
    prIndexSelectedSortAlgo: number;
    prSpeed: number;
    prOnChangeSliderSpeed: (pSpeed: number) => void;
    prOnPlayPause: (pSorting?: boolean) => Promise<void>;
    prOnChangeSliderNumEls : React.Dispatch<React.SetStateAction<number>>;
    prOnPressBtnSortDir: () => Promise<void>;
    prOnPressCmbSortAlgo: React.Dispatch<React.SetStateAction<number>>;
    prOnPressBtnShuffle: () => Promise<void>;
    prOnPressBtnStop: () => void;
    prOnPressBtnVolume: () => Promise<void>;
    prOnPressChangeDirection: () => Promise<void>;
    prUpdater: object;
    prRefBtnStop: React.RefObject<HTMLDivElement | null>;
    prRefBtnSkipNext: React.RefObject<HTMLDivElement | null>;
    prRefBtnSkipPrev: React.RefObject<HTMLDivElement | null>;
    prRefBtnPlayPause: React.RefObject<HTMLDivElement | null>;
    prIsSorting: boolean;
    prIsPaused: boolean;
    prIsAscending: boolean;
    prIsVolumeOn: boolean;
}

function SortView({ prElements, prNumElements, prIndexSelectedSortAlgo, prSpeed, prOnChangeSliderSpeed, 
                    prOnPlayPause, prOnChangeSliderNumEls, prOnPressBtnSortDir, prOnPressCmbSortAlgo, 
                    prOnPressBtnShuffle, prOnPressBtnStop, prOnPressBtnVolume, prOnPressChangeDirection, prUpdater,
                    prRefBtnStop, prRefBtnSkipNext, prRefBtnSkipPrev, prRefBtnPlayPause, prIsSorting, prIsPaused, 
                    prIsAscending, prIsVolumeOn } : PropsSortView) 
{

    // Acquire global theme.
    const { theme } = useTheme();

    const windowSize = useWindowSize();

    // Whether to display the app in 'landscape' orientation.
    const lIsLandScape = useMemo<boolean>(
        () =>
        {
            if (windowSize.isLandscape)
            {
                return !windowSize.isBigScreen;//windowSize.height < 1000 || windowSize.width < 500;
            }
            else
            {
                return false;
            }
        },
        [ windowSize ]
    );

    const lStyleCon = useMemo<StylesPageContainerStd>(
        () =>
        {
            return lIsLandScape ? styleConLandscape : styleConPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConComboBox = useMemo<CSSProperties>(
        () =>
        {
            return lIsLandScape ? styleConComboBoxLandscape : styleConComboBoxPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConElements = useMemo<CSSProperties>(
        () =>
        {
            return lIsLandScape ? styleConElementsLandscape : styleConElementsPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConSliders = useMemo<CSSProperties>(
        () =>
        {
            return lIsLandScape ? { ...styleConSliders, ...styleConSlidersLandscape } : 
                                  { ...styleConSliders, ...styleConSlidersPortrait };
        },
        [ lIsLandScape ]
    );

    const lStyleBtnSortDirection = useMemo<StylesButtonStd>(
        () =>
        {
            return {
                con:
                {
                    height: 60, //!lIsLandScape ? "100%" : "",
                    width: 60, //lIsLandScape ? "100%" : "",
                    padding: 5,
                    borderRadius: gBorderRadiusGeneral,
                }
            }
        },
        [ lIsLandScape ]
    );

    const lStyleBtnAction = useMemo<StylesButtonStd>(
        () =>
        {
            return { 
                    con: { 
                    padding: gPaddingBtnAction,
                    flexShrink: 0,
                    borderRadius: gBorderRadiusGeneral
                } 
            };
        },
        []
    );

    // Props related to the buttons.
    let lButtonProps = useMemo<ButtonProps>(
        () => 
        { 
            // The total available space along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lSpaceAvailable = lIsLandScape ? windowSize.height : windowSize.width;

            // The size of the gap between the buttons along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lGap = lSpaceAvailable * 0.04;

            // The size of each button along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lSize = (lSpaceAvailable - 2 * gPaddingConButtonsOuter - 5 * lGap - 12 * gPaddingBtnAction) / 6;

            // Make sure the size is between the min and max.
            lSize = lSize > 150 ? 150 : lSize;
            lSize = lSize < 40 ? 40 : lSize;

            return { size: lSize * 0.98, gap: lGap }; 
        },
        [ windowSize, lIsLandScape ]
    );

    // The total space available for the elements (in the direction in which they're displayed.).
    const lSpaceForElements = useMemo<number>(
        () => 
            { 
                let lSpaceAvailable : number = lIsLandScape ? windowSize.width : windowSize.height;

                lSpaceAvailable -= gSizeComboBox + // combobox
                                   2 * gSizeSlider + // sliders
                                   lButtonProps.size + // button icon height.
                                   2 * gPaddingBtnAction + // padding applied to the buttons.
                                   1 * gPaddingConButtonsOuter + // padding applied to the buttons' container;
                                   4 * gColRowGap +
                                   2 * gPaddingCon + // outer container padding
                                   1; // sometimes it can be a little off.

                return Math.floor(lSpaceAvailable * 0.98);
            }, 
        [ windowSize, lButtonProps, lIsLandScape ]
    ); 

    // The width of each element (%). This is the size measured along the direction in which the elements are displayed.
    const lWidthElement = useMemo<string>(
        () => 
        { 
            return `${100.0 / prElements.length}%`; 
        },
        [ prElements ] 
    );

    const lStyleConButtonsOuter = useMemo<CSSProperties>(
        () =>
        {
            if (lIsLandScape)
            {
                return {
                    ...styleConButtonsOuter, ...styleConButtonsLandscapeOuter, overflowY: "scroll"
                };
            }
            else
            {
                return {
                    ...styleConButtonsOuter, ...styleConButtonsPortraitOuter, overflowX: "scroll"
                };
            }
        },
        [ theme, lIsLandScape ]
    );

    const lStyleConButtonsInner = useMemo<CSSProperties>(
        () =>
        {
            if (lIsLandScape)
            {
                return {
                    ...styleConButtonsInner, ...styleConButtonsLandscapeInner, rowGap: lButtonProps.gap
                };
            }
            else
            {
                return {
                    ...styleConButtonsInner, ...styleConButtonsPortraitInner, columnGap: lButtonProps.gap
                };
            }
        },
        [ theme, lButtonProps, lIsLandScape ]
    );

    const lStyleSlider = useMemo<StylesSliderStd>(
        () =>
        {
            return { 
                con: {
                    borderRadius: gBorderRadiusGeneral,
                }
            };
        },
        []
    );

    const lStyleComboBox = useMemo<StylesComboBoxStd>(
        () =>
        {
            return { 
                con: { 
                    borderRadius: gBorderRadiusGeneral,
                    flexGrow: 1, 
                    width: lIsLandScape ? gSizeSlider : 1, // The '1' is required to be set so that flexGrow works.
                    height: !lIsLandScape ? gSizeSlider : 1, // The '1' is required to be set so that flexGrow works.
                    maxWidth: 600
                },
                conItems: {
                    border: `1px solid ${theme.cst.sortView.border}`, 
                    borderRadius: gBorderRadiusGeneral,
                    marginTop: !lIsLandScape ? 7 : 0,
                    marginLeft: lIsLandScape ? 7 : 0,
                    // backgroundColor: "#000000BC"
                    // border: "none", 
                    // borderRight: lIsLandScape ? `1px solid ${theme.cst.sortView.border}` : "none", 
                    // borderTop: lIsLandScape ? `1px solid ${theme.cst.sortView.border}` : "none", 
                    // borderLeft: !lIsLandScape ? `1px solid ${theme.cst.sortView.border}` : "none", 
                    // borderBottom: !lIsLandScape ? `1px solid ${theme.cst.sortView.border}` : "none"
                }
            };
        },
        [ theme, lIsLandScape ]
    );

    const lIconBtnSortDir = useMemo<IconFunc>(
        () =>
        {
            if (lIsLandScape)
            {
                return prIsAscending ? (pSize : number, pColour : string) => { return <ArrowForwardIcon sx = {{ color: pColour, fontSize: pSize }} /> } :
                                       (pSize : number, pColour : string) => { return <ArrowBackIcon sx = {{ color: pColour, fontSize: pSize }} /> };
            }
            else
            {
                return prIsAscending ? (pSize : number, pColour : string) => { return <ArrowDownwardIcon sx = {{ color: pColour, fontSize: pSize }} /> } :
                                       (pSize : number, pColour : string) => { return <ArrowUpwardIcon sx = {{ color: pColour, fontSize: pSize }} /> };
            }
        },
        [ prIsAscending, lIsLandScape ]
    );

    const lIconBtnPlayPause = useMemo<IconFunc>(
        () =>
        {
            return (!prIsSorting || prIsPaused) ? (pSize : number, pColour : string) => { return <PlayArrowIcon sx = {{ color: pColour, fontSize: pSize }} /> } :
                                                  (pSize : number, pColour : string) => { return <PauseIcon sx = {{ color: pColour, fontSize: pSize }} /> };
        },
        [ prIsPaused, prIsSorting ]
    );

    const lIconBtnStop = useMemo<IconFunc>(
        () =>
        {
            return prIsSorting ? (pSize : number, pColour : string) => { return <StopIcon sx = {{ color: pColour, fontSize: pSize }} /> } :
                                 (pSize : number, pColour : string) => { return <PaletteIcon sx = {{ color: pColour, fontSize: pSize }} /> };
        },
        [ prIsSorting ]
    );

    const lIconBtnVolume = useMemo<IconFunc>(
        () =>
        {
            return prIsVolumeOn ? (pSize : number, pColour : string) => { return <VolumeUpIcon sx = {{ color: pColour, fontSize: pSize }} /> } :
                                  (pSize : number, pColour : string) => { return <VolumeOffIcon sx = {{ color: pColour, fontSize: pSize }} /> };
        },
        [ prIsVolumeOn ]
    );

    return ( 
        <PageContainerStd
            prShowHeader = { false }
            prStyles = { lStyleCon }
        >

            <div style = { lStyleConComboBox }>
                <ComboBoxStd
                    prItems = { sortAlgoNames } prIndexSelected = { prIndexSelectedSortAlgo }
                    prDirection = { lIsLandScape ? "R" : "D" } 
                    prLength = { lIsLandScape ? undefined : "100%" } 
                    prOnPress = { prOnPressCmbSortAlgo }
                    prHideScrollBar = { false }
                    prMaxLengthItemBox = { lIsLandScape ? Math.min(windowSize.width * 0.4, 400) : Math.min(windowSize.height * 0.4, 400) }
                    prStyles = { lStyleComboBox }
                    prIsActive = { !prIsSorting }
                />
                <ButtonStd 
                    prIcon = { lIconBtnSortDir }
                    prIconSize = { 35 } prIconColour = { theme.cst.sortView.iconButton }
                    prStyles = { lStyleBtnSortDirection } prIsBorderDisabled = { false }
                    prOnPress = { prOnPressBtnSortDir }
                    prIsActive = { !prIsSorting }
                />
            </div>

            {/* Render elements */}
            <div style = { lStyleConElements } className = "hideScrollBar" onClick = { prOnPressChangeDirection }>
                {
                    prElements.map(
                        (element : SortElement, index : number) =>
                        {
                            let lWidthOuter = (index == 0 || element.value > prElements[index - 1].value) ? 
                                                element.value : prElements[index - 1].value;

                            return (
                                <ElementView
                                    key = { index } 
                                    prElement = { element }
                                    prLengthOuter = { lWidthOuter }
                                    prLengthOuterStatic = { lWidthElement }
                                    prLengthInnerStatic = "100%"
                                    prIsColumn = { lIsLandScape }
                                    prIsLastElement = { index == prElements.length - 1 }
                                    // prTheme = { lTheme?.element }
                                    prUpdater = { prUpdater }
                                />
                            );
                        }
                    )
                }
            </div>

            <div style = { lStyleConSliders }>
                <SliderStd 
                    prIsVertical = { lIsLandScape } prIsVerticalTopDown = { false }
                    prMin = { 1 } prMax = { ranges.speed.max } prValue = { ranges.speed.max - prSpeed + 1 } prStep = { 1 }
                    prMinAllowed = { ranges.speed.min }
                    prOnChange = { prOnChangeSliderSpeed }
                    prLabel = "SPEED"
                    prHeight = { lIsLandScape ? "100%" : gSizeSlider }
                    prWidth = { lIsLandScape ? gSizeSlider : undefined }
                    prStyles = { lStyleSlider }
                /> 

                <SliderStd 
                    prIsVertical = { lIsLandScape } prIsVerticalTopDown = { false }
                    prMin = { 1 } prMax = { Math.min(ranges.numElements.max, lSpaceForElements)} prValue = { prNumElements } prStep = { 1 }
                    prMinAllowed = { ranges.numElements.min }
                    prOnChange = { prOnChangeSliderNumEls }
                    prLabel = "LENGTH"
                    prHeight = { lIsLandScape ? "100%" : gSizeSlider }
                    prWidth = { lIsLandScape ? gSizeSlider : undefined }
                    prStyles = { lStyleSlider } 
                    prIsActive = { !prIsSorting }
                />
            </div>

            {/* Render buttons */}
            <div style = { lStyleConButtonsOuter } className = "hideScrollBar"> 
                <div style = { lStyleConButtonsInner }>
                    <ButtonStd 
                        prIcon = { lIconBtnPlayPause }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prRef = { prRefBtnPlayPause }
                        prOnPress = { prOnPlayPause }
                    />
                    <ButtonStd 
                        prIcon = { iconSkipPrev }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prRef = { prRefBtnSkipPrev }
                        prIsActive = { !prIsSorting || prIsPaused }
                    />
                    <ButtonStd 
                        prIcon = { iconSkipNext }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prRef = { prRefBtnSkipNext }
                        prIsActive = { !prIsSorting || prIsPaused }
                    />
                    <ButtonStd 
                        prIcon = { lIconBtnStop }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prRef = { prRefBtnStop }
                        prOnPress = { prOnPressBtnStop }
                    />
                    <ButtonStd 
                        prIcon = { iconShuffle }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prOnPress = { prOnPressBtnShuffle }
                        prIsActive = { !prIsSorting }
                    />
                    <ButtonStd 
                        prIcon = { lIconBtnVolume }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prOnPress = { prOnPressBtnVolume }
                    />
                </div>
            </div>

        </PageContainerStd>
    );
}

const gPaddingCon : number = 0;
const gColRowGap : number = 15;

// The 'size' (i.e. width or height, depending on screen orientation) of the combobox.
const gSizeComboBox : number = 60;

// The 'size' (i.e. width or height, depending on screen orientation) of the slider.
const gSizeSlider : number = 60;

const gPaddingBtnAction : number = 3;

const gPaddingGeneral : number = 10;

const gBorderRadiusGeneral : number = 10;

const styleConLandscape : StylesPageContainerStd =
{
    con:
    {
        alignItems: "center",
        flexDirection: "row",
        padding: gPaddingGeneral,
        columnGap: gColRowGap,
    }
};

const styleConPortrait : StylesPageContainerStd =
{
    con:
    {
        alignSelf: "center",
        maxWidth: 1350,
        alignItems: "center",
        flexDirection: "column",
        padding: gPaddingGeneral,
        rowGap: gColRowGap,
    }
};

const styleConSliders : CSSProperties =
{
    // alignSelf: "flex-start",
    flexShrink: 0,
    flexGrow: 0,
};

const styleConSlidersLandscape : CSSProperties =
{
    // alignSelf: "flex-start",
    height: "100%", // "100%" on FireFox this didn't work sometimes for some reason.
    // minHeight: "100%",
    flexDirection: "row",
    flexShrink: 0,
    flexGrow: 0,
    columnGap: gColRowGap,
    // paddingTop: gPaddingGeneral,
    // paddingBottom: gPaddingGeneral,
};

const styleConSlidersPortrait : CSSProperties =
{
    // alignSelf: "flex-start",
    width: "100%",
    flexDirection: "column",
    flexShrink: 0,
    flexGrow: 0,
    rowGap: gColRowGap,
    // paddingLeft: gPaddingGeneral,
    // paddingRight: gPaddingGeneral,
    alignItems: "center"
};

const styleConComboBoxLandscape : CSSProperties =
{
    flexDirection: "column-reverse",
    height: "100%", // todo: was using 100%, but there was an issue where the height would collapse to contents.
    flexShrink: 0,
    rowGap: 10
};

const styleConComboBoxPortrait : CSSProperties =
{
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexShrink: 0,
    columnGap: 10
    // paddingTop: gPaddingGeneral,
    // paddingLeft: gPaddingGeneral,
    // paddingRight: gPaddingGeneral
};

const styleConElementsLandscape : CSSProperties =
{
    flexGrow: 1, 
    height: "100%", // todo: was using 100%, but there was an issue where the height would collapse to 0.
    flexDirection: "row", 
    alignItems: "flex-end", justifyContent: "center", 
    overflowX: "scroll",
    // paddingTop: gPaddingGeneral,
    // paddingBottom: gPaddingGeneral,
};

const styleConElementsPortrait : CSSProperties =
{
    flexGrow: 1, 
    width: "100%", 
    flexDirection: "column", 
    alignItems: "start", justifyContent: "start", 
    // paddingLeft: gPaddingGeneral,
    // paddingRight: gPaddingGeneral,
    overflowY: "scroll",
};

const gPaddingConButtonsOuter = 10;

const styleConButtonsOuter : CSSProperties =
{
    // alignItems: "center"
    // padding: gPaddingConButtonsOuter
};

const styleConButtonsInner : CSSProperties =
{
    // margin: "auto"
};

const styleConButtonsLandscapeOuter : CSSProperties =
{
    height: "100%",
    // paddingTop: gPaddingGeneral,
    // paddingBottom: gPaddingGeneral,
    // paddingRight: gPaddingGeneral,
};
const styleConButtonsLandscapeInner : CSSProperties =
{
    flexDirection: "column",
    // margin: "auto"
};

const styleConButtonsPortraitOuter : CSSProperties =
{
    width: "100%",
    // paddingLeft: gPaddingGeneral,
    // paddingRight: gPaddingGeneral,
    // paddingBottom: gPaddingGeneral,
};
const styleConButtonsPortraitInner : CSSProperties =
{
    flexDirection: "row",
    // margin: "auto"
};

const iconShuffle : IconFunc = (pSize : number, pColour : string) =>
{
    return <ShuffleIcon sx = {{ color: pColour, fontSize: pSize }} />
};

const iconSkipNext : IconFunc = (pSize : number, pColour : string) =>
{
    return <SkipNextIcon sx = {{ color: pColour, fontSize: pSize }} />
};

const iconSkipPrev : IconFunc = (pSize : number, pColour : string) =>
{
    return <SkipPreviousIcon sx = {{ color: pColour, fontSize: pSize }} />
};

type ButtonProps = 
{
    size: number;
    gap: number;
}

export default SortView;