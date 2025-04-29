
import utils, { CompOp } from "../../standard_ui/utils";

/**
* The sort action type. 

* Definitions:
    > sw: swap.
    > st: set.
    > c: compare
*/
type SortActionType = "SW" | "ST" | "C";

/*
* A class to represent sort actions.
*/
class SortAction
{
    // The type of action (should be a value of SortAction.Type)
    #fType : SortActionType;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - The index to swap/compare to the other index (#fValueB).
      else if #fType is Type.Set
        - The index at which to store the given value (#fValueB).
    */
    #fValueA : number;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - The index to swap/compare to the other index (#fValueA).
      else if #fType is Type.Set
        - The value to set at the given index (#fValueA).
    */
    #fValueB : number;

    /*
    * The comparison operator to use (if #fType Type.Compare).
    */
    #fCompOp : CompOp;

    constructor(pType : SortActionType, pValueA : number, pValueB : number, pCompOp : CompOp = "E")
    {
        this.#fType = pType;
        this.#fValueA = pValueA;
        this.#fValueB = pValueB;
        this.#fCompOp = pCompOp;
    }

    get type() { return this.#fType; }

    get valueA() { return this.#fValueA; }
    set valueA(pValueA) { this.#fValueA = pValueA; }

    get valueB() { return this.#fValueB; }
    set valueB(pValueB) { this.#fValueB = pValueB; }

    get compOp() { return this.#fCompOp; }
}

/**
* The states that an element can be in.
* 
* Definitions:
    > n: normal.
    > c: compared.
    > sw: swapped.
    > st: set.
*/
type SortElementState = "N" | "C" | "SW" | "ST";

/**
* A class to represent a sort element (i.e. a column in the graph).
*/
class SortElement
{
    // The element's value (0-100).
    #fValue : number;

    // The element's state.
    #fState : SortElementState;

    constructor(pValue : number, pState : SortElementState)
    {
        this.#fValue = pValue;

        this.#fState = pState;
    }

    get value() { return this.#fValue; }
    set value(pValue) { this.#fValue = pValue; }

    get state() { return this.#fState; }
    set state(pState) { this.#fState = pState; }
}

/**
* A class to represent thea group of elements (i.e. the collection of Element objects that are displayed on the screen). 
*/
class SortElements
{
    #fElements : SortElement[];

    #fElementsSnapshot : SortElement[];

    #fSortActions : SortAction[];

    constructor(pNumElements : number)
    {
        // this.#fElements = Array.from(
        this.#fElements = Array.from(
            { length: pNumElements }, 
            () => 
            { 
                return new SortElement(utils.getRandomInt(1, 100), "N");
            }
        );

        this.#fElementsSnapshot = [];
        this.#fSortActions = [];
    }

    swap(pIndexA : number, pIndexB : number, pRecordSortAction : boolean = true, pSetState : boolean = false)
    {
        let lTemp = this.#fElements[pIndexA];
        this.#fElements[pIndexA] = this.#fElements[pIndexB];
        this.#fElements[pIndexB] = lTemp;

        if (pRecordSortAction)
        {
            this.#fSortActions.push(new SortAction("SW", pIndexA, pIndexB));
        }

        if (pSetState)
        {
            this.#fElements[pIndexA].state = "SW";
            this.#fElements[pIndexB].state = "SW";
        }
    }

    setValue(pIndex : number, pValue : number, pRecordSortAction : boolean = true, pSetState : boolean = false)
    {
        this.#fElements[pIndex] = new SortElement(pValue, this.#fElements[pIndex].state);

        if (pRecordSortAction)
        {
            this.#fSortActions.push(new SortAction("ST", pIndex, pValue));
        }

        if (pSetState)
        {
            this.#fElements[pIndex].state = "ST";
        }
    }

    compare(pIndexA : number, pCompOp : CompOp, pIndexB : number, pRecordSortAction : boolean = true, 
            pSetState : boolean = false)
    {
        let lReturnVal : boolean = utils.compare(this.#fElements[pIndexA].value, pCompOp, this.#fElements[pIndexB].value);

        if (pRecordSortAction)
        {
            this.#fSortActions.push(new SortAction("C", pIndexA, pIndexB, pCompOp));
        }

        if (pSetState)
        {
            this.#fElements[pIndexA] = new SortElement(this.#fElements[pIndexA].value, "C");
            this.#fElements[pIndexB] = new SortElement(this.#fElements[pIndexB].value, "C");
        }

        return lReturnVal;
    }

    compareValue(pIndexA : number, pCompOp : CompOp, pValue : number, pRecordSortAction : boolean = true, 
                 pSetState : boolean = false)
    {
        let lReturnVal : boolean = utils.compare(this.#fElements[pIndexA].value, pCompOp, pValue);

        if (pSetState)
        {
            this.#fElements[pIndexA].state = "C";
        }

        return lReturnVal;
    }

    /*
    * Populates the sort actions array with actions that result in the elements being shuffled.
    */
    async shuffleSnapshot()
    {
        this.saveSnapshot();

        for (let i = this.#fElements.length - 1; i > 0; --i)
        {
            const lIndexRandom : number = utils.getRandomInt(0, i);

            this.swap(i, lIndexRandom, true);
        }

        console.log(this.sortActions);

        this.loadSnapshot();
    }

    reset()
    {
        this.#fSortActions = [];
    }

    resetElementColour(pIndex : number)
    {
        this.#fElements[pIndex] = new SortElement(this.#fElements[pIndex].value, 'N');
    }

    /**
    * Saves the current values of into this.#fElementsSnapshot.
    */
    saveSnapshot()
    {
        this.#fElementsSnapshot = Array.from({ length: this.#fElements.length });

        for (let i = 0; i < this.#fElements.length; ++i)
        {
            this.#fElementsSnapshot[i] = new SortElement(this.#fElements[i].value, this.#fElements[i].state);
        }
    }

    /**
    * Loads the values of this.#fElementsSnapshot into this.#fElements.
    * Note: this.#fElementsSnapshot and this.#fElements must have the same length.
    */
    loadSnapshot()
    {
        if (this.#fElementsSnapshot && this.#fElementsSnapshot.length != this.#fElements.length)
            return;

        for (let i = 0; i < this.#fElementsSnapshot.length; ++i)
        {
            this.#fElements[i] = this.#fElementsSnapshot[i];
        }
    }

    resize(pSize : number)
    {
        this.#fElements = Array.from(
            { length: pSize }, 
            () => 
            { 
                return new SortElement(utils.getRandomInt(1, 100), "N");
            }
        );
    }

    async applySortActions()
    {
        for (const sa of this.#fSortActions)
        {
            // Apply action.
            this.applySortAction(sa);
        }
    }

    /**
    * Applies a given sort action to the elements.
    * Do note that if a given action A, is applied to the elements, if this same action A is applied again, the elements 
      must return to their original form prior to the first application of A. For swaps and comparisons, the sort action
      won't be modified to achieve this; however, for sets, the value that is set must be changed each time the action 
      is applied.

    * Parameters: 
        * @param {SortAction} pSortAction 
        * @param {boolean} pRecordSortAction 
        * @param {boolean} pSetState 
    */
    applySortAction(pSortAction : SortAction, pRecordSortAction : boolean = false, pSetState : boolean = true)
    {
        // Apply action.
        if (pSortAction.type == "SW")
        {
            if ((pSortAction.valueA >= 0 && pSortAction.valueA < this.#fElements.length) &&
                (pSortAction.valueB >= 0 && pSortAction.valueB < this.#fElements.length))
            {
                this.swap(pSortAction.valueA, pSortAction.valueB, pRecordSortAction, pSetState);
            }
        }
        else if (pSortAction.type == "C")
        {
            // if (pSortAction.compOp in utils.compOps)
            // {
                this.compare(pSortAction.valueA, pSortAction.compOp, pSortAction.valueB, pRecordSortAction, pSetState);
            // }
        }
        else
        {
            if (pSortAction.valueA >= 0 && pSortAction.valueA < this.#fElements.length)
            {
                // The value that was at the given index prior to the set.
                const lValAtIndex : number = this.#fElements[pSortAction.valueA].value;

                this.setValue(pSortAction.valueA, pSortAction.valueB, pRecordSortAction, pSetState);

                // Set value B to lValAtIndex so that if the action is applied again it undoes the effect. 
                pSortAction.valueB = lValAtIndex;
            }
        }
    }

    get elements()
    {
        return this.#fElements;
    }

    get length()
    {
        return this.#fElements.length;
    }

    set elements(pElements)
    {
        this.#fElements = pElements;
    }

    get sortActions()
    {
        return this.#fSortActions;
    }

    get lengthSortActions()
    {
        return this.#fSortActions.length;
    }
}

export { SortElements as default, SortElement, SortAction};

export type { SortActionType, SortElementState };