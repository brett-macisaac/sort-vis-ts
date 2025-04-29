/*
* Global styling for the app's components.
*/

// The width of the screen.
const gWidthScreen = window.innerWidth;

// The maximum width of a container
const gMaxWidthContainer = 350;

// The width of a container.
const gWidthCon = gWidthScreen * 0.9 > gMaxWidthContainer ? gMaxWidthContainer : gWidthScreen * 0.9;

/*
* Global styling properties that are used to style components throughout the app.
* These values aim to ensure that styling is consistent.
*/
const globalProps = 
{
    fontSizeStandard: 15,

    spacingStandard: 30,

    widthCon: gWidthCon,

    borderRadiusStandard: 10,

    colourSelected: "#B89F11",

    fontFamilyMono: "Courier New",

    // The default theme.
    themeDefault: "dark",

    /*
    * The 'standard' fontSize value of Text elements.
    * The fontSize of a Text element should equal this value, or this value multiplied by a multiple of 
        fontSizeMultiplier.
    */
    fontSizeBase: 16,

    /*
    * The multiplier of fontSizeBase.
    * If you want the fontSize of a Text element to be higher than fontSizeBase, you multiply fontSizeBase by 
      fontSizeMultiplier; likewise, if you want the fontSize of a Text element to be lower than fontSize, you divide it
      by fontSizeMultiplier.
    * If you want a Text element's fontSize to be even higher, you multiply fontSizeBase by a multiple of 
      fontSizeMultiplier: i.e. fontSize = fontSizeBase * (fontSizeMultiplier)^n.
    * The point of having fontSizeBase and fontSizeMultiplier is to ensure that font sizes are standardised across the 
      application.
    */
    fontSizeMultiplier: 1.25,

    /*
    * The 'standard' value of spacing between elements.
    */
    spacingBase: 30,

    /*
    * The multiplier of spacingVertBase.
    * If you want the vertical distance between two elements to be higher than spacingVertBase, you multiply 
    spacingVertBase by spacingVertMultiplier; likewise, if you want two elements to be spaced less than 
    spacingVertBase, you divide spacingVertBase by spacingVertMultiplier.
    * If you want the vertical distance between two elements to be even higher, you multiply spacingVertBase by a 
    multiple of spacingVertMultiplier: i.e. verticalDistance = spacingVertBase * (spacingVertMultiplier)^n.
    * The point of having spacingVertBase and spacingVertMultiplier is to ensure that vertical spacing between elements
    is standardised across the application.
    */
    spacingMultiplier: 1.5,

    // The fontWeight of bold text.
    fontWeightBold: 700,

    // The height of the header.
    heightHeader: 60,

    // The height of the footer.
    heightNavBar: 90,

    sizeIconHeaderFooter: 35
};


/*
* Returns the 'nth' biggest fontSize.
* When n is 0, the returned value is simply globalProps.fontSizeBase.
* If n < 0, the returned value will be less than globalProps.fontSizeBase.
* If n > 0, the returned value will be greater than globalProps.fontSizeBase.

* Parameters:
    > n: the 'rank' of the returned value.
*/
function fontSizeN(n = 0)
{
    return globalProps.fontSizeBase * Math.pow(globalProps.fontSizeMultiplier, n);
}

/*
* Returns the 'nth' biggest vertical spacing.
* The returned value is intended to be used as a marginTop/marginBottom value of an element.
* When n is 0, the returned value is simply globalProps.spacingVertBase.
* If n < 0, the returned value will be less than globalProps.spacingVertBase.
* If n > 0, the returned value will be greater than globalProps.spacingVertBase.

* Parameters:
    > n: the 'rank' of the returned value.
*/
function spacingN(n = 0)
{
    return globalProps.spacingBase * Math.pow(globalProps.spacingMultiplier, n);
}

/*
* Utility functions used throughout the application to assist with styling.
*/
const utilsGlobalStyles = 
{
    fontSizeN: fontSizeN, 
    spacingN: spacingN,
};


/*
* Style objects for the components used throughout the app.
*/
const globalStyles = 
{
    pageContainerDefault: 
    {
        paddingTop: utilsGlobalStyles.spacingN(-1),
        paddingBottom: utilsGlobalStyles.spacingN(-1),
        paddingLeft: utilsGlobalStyles.spacingN(-2),
        paddingRight: utilsGlobalStyles.spacingN(-2),
        rowGap: utilsGlobalStyles.spacingN(-1)
    },

    textStandardDefault: 
    {
        fontSize: utilsGlobalStyles.fontSizeN(),
    },

    buttonStandardDefault:
    {
        borderRadius: globalProps.borderRadiusStandard,
        padding: 10,
    },

    container:
    {
        width: globalProps.widthCon,
        padding: utilsGlobalStyles.spacingN(-1),
        borderRadius: 2 * globalProps.borderRadiusStandard,
    },

    checkBoxDefault:
    {
        con:
        {
            fontSize: utilsGlobalStyles.fontSizeN(1),
            minWidth: 200, maxWidth: 300
        },
    },

    countLabelDefault:
    {
        con:
        {
            minWidth: 200,
            maxWidth: 300,
            borderRadius: 1000
        },
        label:
        {
            padding: "0.75em"
        }
    },

    textInputStdDefault:
    {
        minWidth: 300,
        borderRadius: 1000
    },
    textInputMultiline:
    {
        minWidth: 300,
        borderRadius: globalProps.borderRadiusStandard,
    },

    containerStdDefault:
    {
        width: gWidthCon,
        fontSize: utilsGlobalStyles.fontSizeN(1),
        padding: "1em",
        alignItems: "center"
    },

    tableStdDefault:
    {
        cellHeader:
        {
            minWidth: 50
        },
        cellContent: 
        {
            backgroundColor: "transparent"
        }
    },

    sliderStd:
    {
        con:
        {
            border: "none"
        }
    }
};


export { globalProps as default, utilsGlobalStyles, globalStyles };