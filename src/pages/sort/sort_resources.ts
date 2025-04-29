
import utils, { CompOp } from "../../standard_ui/utils.ts";

import Elements, { SortElement } from './Elements.ts';

// The sorting algorithms.
function BubbleSort(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    // Determine the comparison operator to use.
    const lCompOp : CompOp = pAscending ? "G" : "L";

    for (let lIndexUnsortedUpper : number = pElements.elements.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
    {
        for (let i = 1; i <= lIndexUnsortedUpper; ++i)
        {
            if (pElements.compare(i - 1, lCompOp, i))
            {
                pElements.swap(i - 1, i);
            }
        }
    }

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function CocktailShakerSort(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    /* These two variables are the min and max indexes of the segment of pElements that is unsorted. Initially, the 
    entire array is unsorted. i.e. the unsorted segment ranges from index lIndexUnsortedLower to lIndexUnsortedUpper/
    */
    let lIndexUnsortedLower : number = 0; // The lowest index of the container's unsorted segment.
    let lIndexUnsortedUpper : number = pElements.length - 1; // The highest index of the container's unsorted segment.

    /* A flag that, when true, indicates that no swaps occurred during one iteration of the below while loop, 
    meaning that the array is sorted. 
    */
    let lNoSwaps : boolean;

    // The comparison operator that's used when going from low to high.
    const lCompOpLowToHigh : CompOp = pAscending ? "G" : "L";

    // The comparison operator that's used when going from low to high.
    const lCompOpHighToLow : CompOp = pAscending ? "L" : "G";

    /* Iterate until the unsorted segment has a size of zero. The size of the unsorted segment is 
    'lIndexUnsortedUpper - lIndexUnsortedLower + 1', meaning that if 
    lIndexUnsortedLower < lIndexUnsortedUpper, the size is 0 (or less).
    */
    while (lIndexUnsortedLower < lIndexUnsortedUpper)
    {
        // Reset the 'no swaps' flag to true; if a swap occurs, it's set to false.
        lNoSwaps = true;
        
        /* Get the highest value of the unsorted segment of the container and put it in the correct position 
        (index lIndexUnsortedUpper).
        */
        for (let i = lIndexUnsortedLower; i < lIndexUnsortedUpper; ++i) // Min to max (ascend).
        {
            if (pElements.compare(i, lCompOpLowToHigh, i + 1))
            {
                pElements.swap(i, i + 1);
                lNoSwaps = false;
            }
            
        }
        // pElements.SetElementSorted(lIndexUnsortedUpper, true);
        --lIndexUnsortedUpper; // Decrease the size of the unsorted segment by 1.

        /* Get the lowest value of the unsorted segment of the container and put it in the correct position 
        (index lIndexUnsortedLower).
        */
        for (let i = lIndexUnsortedUpper; i > lIndexUnsortedLower; --i) // Max to min (descend).
        {

            if (pElements.compare(i, lCompOpHighToLow, i - 1))
            { 
                pElements.swap(i, i - 1);
                lNoSwaps = false;
            }
            
        }
        // pElements.SetElementSorted(lIndexUnsortedLower, true);
        ++lIndexUnsortedLower; // Decrease the size of the unsorted segment by 1.
        
        // If no swaps occurred, the array is sorted; therefore, end the loop.
        if (lNoSwaps)
        { 
            // pElements.SetElementRangeColour(lIndexUnsortedLower - 1, lIndexUnsortedUpper + 1, pElements.colours.sorted, true);
            break; 
        }
        
    }

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function SelectionSort(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    // Determine the comparison operator to use.
    const lCompOp : CompOp = pAscending ? "G" : "L";

    let lIndexElementToSwap;

    for (let lIndexUnsortedUpper = pElements.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
    {
        lIndexElementToSwap = 0;

        for (let i = 1; i <= lIndexUnsortedUpper; ++i)
        {
            if (pElements.compare(i, lCompOp, lIndexElementToSwap))
            {
                lIndexElementToSwap = i;
            }
        }

        pElements.swap(lIndexElementToSwap, lIndexUnsortedUpper);

        // pElements.SetElementSorted(lIndexUnsortedUpper);
    }

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function InsertionSort(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    // The value to insert upon each iteration of the for-loop.
    let lValueToInsert : SortElement;
        
    // The number of values that are shifted in the while loop. This is only used to highlight the shifted elements.
    let lNumShifts : number = 0;
    
    // The operator to use in the while loop's condition.
    const lOperator : CompOp = pAscending ? "G" : "L";
    
    /* 
    * The segment of the array from index 'lIndexUnsortedMin' to 'pElements.length - 1' is the unsorted segment
    of the container. 
    * Initially, lIndexUnsortedMin is assigned the value 1, meaning that the value at index 0 is assumed to be sorted.
    * After each iteration of this for-loop, the size of the unsorted segment is reduced by 1.
    */
    for (let lIndexUnsortedMin : number = 1; lIndexUnsortedMin < pElements.length; ++lIndexUnsortedMin)
    {
        // The value to insert in this for-loop iteration is that at the lowest index of the array's unsorted segment.
        // lValueToInsert = pElements.GetClientHeight(lIndexUnsortedMin);
        lValueToInsert = pElements.elements[lIndexUnsortedMin];
        
        // Highlight the value that is to be inserted into the sorted segment.
        // pElements.SetElementColour(lIndexUnsortedMin, pElements.colours.compared, true);

        // Highlight the sorted segment.
        // pElements.SetElementRangeColour(0, lIndexUnsortedMin - 1, pElements.colours.swapped, true);

        // Remove colours.
        // pElements.SetElementRangeColour(0, lIndexUnsortedMin, pElements.colours.default);

        // The index of the (sorted) sublist at which lValueToInsert will be inserted.
        let lIndexOfInsert : number = lIndexUnsortedMin;

        for (; lIndexOfInsert > 0 && pElements.compareValue(lIndexOfInsert - 1, lOperator, lValueToInsert.value); 
            --lIndexOfInsert)
        {
            pElements.setValue(lIndexOfInsert, pElements.elements[lIndexOfInsert - 1].value);

            // Record the shift.
            ++lNumShifts;
        }

        pElements.setValue(lIndexOfInsert, lValueToInsert.value);

        // Highlight the value that was inserted.
        // pElements.SetElementColour(lIndexOfInsert, pElements.colours.compared, false);
        
        // Highlight the values that were shifted up to accomodate for the value that was inserted.
        // pElements.SetElementRangeColour(lIndexOfInsert + 1, lIndexOfInsert + lNumShifts, pElements.colours.swapped, true);
        
        // Remove the highlights.
        //pElements.SetBarColour(lIndexOfInsertM1 + 1, BarColourEnum.Standard, false);
        // pElements.SetElementRangeColour(lIndexOfInsert, lIndexOfInsert + lNumShifts, pElements.colours.default, false);

        // Clear the number of shifts.
        lNumShifts = 0;
    }

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function QuickSort(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    const lOperator : CompOp = pAscending ? "G" : "L";

    // const lColourSortIndex = "#0f5099";

    const SortValue = (pElements : Elements, pStart : number, pEnd : number) =>
    {
        // The index of the value that is to be placed into its sorted position.
        let lIndexPivot : number = pEnd;

        // The index at which lIndexPivot's value will ultimately be placed.
        let lIndexOfSort : number = pStart;

        // Highlight the segment from aStart to aEnd.
        // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.swapped, true);

        // Highlight the value that is to be placed into its sorted position.
        // pElements.SetElementColour(lIndexPivot, pElements.colours.compared, true);

        // Remove colours.
        // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default);
        
        // Highlight the index lIndexOfSort.
        // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);

        for (let i = pStart; i < pEnd; ++i)
        {
            if (pElements.compare(lIndexPivot, lOperator, i))
            {
                // Swap current value with the one at lIndexOfSort.
                if (i !== lIndexOfSort)
                    pElements.swap(i, lIndexOfSort);

                // pElements.SetElementColour(lIndexOfSort, pElements.colours.default);
                ++lIndexOfSort;
                // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);
            }
            else if (i === lIndexOfSort)
            {
                // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true); 
            }
    
        }

        // Move the pivot's value into its sorted position.
        if (lIndexOfSort !== lIndexPivot)
        { pElements.swap(lIndexOfSort, lIndexPivot); }

        // Indicate that the value at lIndexOfSort is in its sorted position.
        // pElements.SetElementSorted(lIndexOfSort, true);

        // Return the index of the value sorted by this algorithm.
        return lIndexOfSort;
    }

    const SplitElements = (pElements : Elements, pStart : number, pEnd : number) => 
    {
        if (pStart < pEnd)
        {
            const lIndexSortedValue = SortValue(pElements, pStart, pEnd);

            // Highlight the lower segment.
            // pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.compared, false);

            // if (pElements.stop) return;

            // Highlight the upper segment.
            // pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.swapped, true);

            // Remove colours.
            // pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.default);
            // pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.default);

            SplitElements(pElements, pStart, lIndexSortedValue - 1);

            SplitElements(pElements, lIndexSortedValue + 1, pEnd);
        }
        else if (pStart === pEnd)
        {
            // pElements.SetElementSorted(aStart, true);
        }
    }

    /* If isn't used here, the user can still interact with UI elements that they shouldn't be able to. This is
    because when an 'await' is encountered within SplitElements, SplitElements is removed from the call stack, 
    meaning that QuickSort can continue, which results in QuickSort ending prematurely, which causes gElements.Sort(...)
    to return, after which DisableUIForSorting is called with a false argument, which causes the UI elements to be 
    enabled before the sorting process has completed.  */
    SplitElements(pElements, 0, pElements.length - 1);

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function QuickSortRandomPivot(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    const lOperator : CompOp = pAscending ? "G" : "L";

    // const lColourSortIndex = "#0f5099";

    const SortValue = (pElements : Elements, pStart : number, pEnd : number) : number =>
    {
        // The index of the value that is to be placed into its sorted position.
        let lIndexPivot : number = utils.getRandomInt(pStart, pEnd);

        pElements.swap(lIndexPivot, pEnd);

        lIndexPivot = pEnd;

        // The index at which lIndexPivot's value will ultimately be placed.
        let lIndexOfSort : number = pStart;

        // Highlight the segment from aStart to aEnd.
        // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.swapped, true);

        // Highlight the value that is to be placed into its sorted position.
        // pElements.SetElementColour(lIndexPivot, pElements.colours.compared, true);

        // Remove colours.
        // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default);
        
        // Highlight the index lIndexOfSort.
        // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);

        for (let i : number = pStart; i < pEnd; ++i)
        {
            if (pElements.compare(lIndexPivot, lOperator, i))
            {
                // Swap current value with the one at lIndexOfSort.
                if (i != lIndexOfSort)
                    pElements.swap(i, lIndexOfSort);

                // pElements.SetElementColour(lIndexOfSort, pElements.colours.default);
                ++lIndexOfSort;
                // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);
            }
            else if (i == lIndexOfSort)
            {
                // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true); 
            }
    
        }

        // Move the pivot's value into its sorted position.
        if (lIndexOfSort != lIndexPivot)
        { pElements.swap(lIndexOfSort, lIndexPivot); }

        // Indicate that the value at lIndexOfSort is in its sorted position.
        // pElements.SetElementSorted(lIndexOfSort, true);

        // Return the index of the value sorted by this algorithm.
        return lIndexOfSort;
    }

    const SplitElements = (pElements : Elements, pStart : number, pEnd : number) => 
    {
        if (pStart < pEnd)
        {
            const lIndexSortedValue = SortValue(pElements, pStart, pEnd);

            // Highlight the lower segment.
            // pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.compared, false);

            // if (pElements.stop) return;

            // Highlight the upper segment.
            // pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.swapped, true);

            // Remove colours.
            // pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.default);
            // pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.default);

            SplitElements(pElements, pStart, lIndexSortedValue - 1);

            SplitElements(pElements, lIndexSortedValue + 1, pEnd);
        }
        else if (pStart === pEnd)
        {
            // pElements.SetElementSorted(aStart, true);
        }

    }

    SplitElements(pElements, 0, pElements.length - 1);

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function MergeSort(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    const lOperator = pAscending ? "LE" : "GE";

    // const lColourUpper = "#0f5099";
    // const lColourLower = "#cc241f";
    // const lColourMerged = "#5226a3";

    const Merge = (pElements : Elements, pStart : number, pMid : number, pEnd : number) =>
    {
        // Change the colours of the two segments.
        // pElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
        // pElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

        // Remove the colours.
        // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default, true);
        
        // Create a temporary container to house the merged segment.
        const lSizeOfMerger = pEnd - pStart + 1; // Size of merged segment.
        let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

        // (a). The current indexes of the lower and upper segments, respectively.
        let lIndexLowerSegment = pStart;
        let lIndexUpperSegment = pEnd + 1;

        // (b). The 'current' index of lMerger.
        let lMergerIndex = 0;
        
        // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
        while (true) // (c).
        {
            if (lIndexLowerSegment <= pMid && lIndexUpperSegment <= pEnd) // (d).
            {
                if (pElements.compare(lIndexLowerSegment, lOperator, lIndexUpperSegment, false, false)) // (e).
                {
                    lMerger[lMergerIndex++] = pElements.elements[lIndexLowerSegment++];
                }
                else // (f).
                {
                    lMerger[lMergerIndex++] = pElements.elements[lIndexUpperSegment++];;
                }
                
            }
            else if (lIndexLowerSegment <= pMid) // (g).-=
            {
                lMerger[lMergerIndex++] = pElements.elements[lIndexLowerSegment++];
            }
            else if (lIndexUpperSegment <= pEnd) // (h).
            {
                lMerger[lMergerIndex++] = pElements.elements[lIndexUpperSegment++];
            }
            else // (i).
            {
                break;
            }
        }

        // Change the colours of the two segments.
        // pElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
        // pElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

        // Copy the values from lMerger into the appropriate indexes of pElements.
        for (let i = pStart; i <= pEnd; ++i) 
        { 
            pElements.setValue(i, lMerger[i - pStart].value);
            // pElements.SetElementColour(i, lColourMerged, true);
        }
        
        // Remove the colours.
        // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default, false);
    }

    const SplitAndMerge = (pElements : Elements, pStart : number, pEnd : number) => 
    {
        if (pStart >= pEnd)
        { return; }

        // Calculate the middle index.
        let lMid : number = Math.floor((pStart + pEnd) / 2);

        // Split and merge the lower half of the current segment (aStart to lMid).
        // Once this returns, said lower half will have been sorted.
        SplitAndMerge(pElements, pStart, lMid);

        // Continue to split and merge the upper half of the current segment (lMid + 1 to aEnd).
        // Once this returns, said upper half will have been sorted.
        SplitAndMerge(pElements, lMid + 1, pEnd);

        // Combine the lower (aStart to lMid) and upper (lMid + 1 to aEnd) segments which, individually, are sorted.
        Merge(pElements, pStart, lMid, pEnd);
    }

    SplitAndMerge(pElements, 0, pElements.length - 1);

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function MergeSortIterative(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    const lOperator : CompOp = pAscending ? "LE" : "GE";

    const lColourUpper = "#0f5099";
    const lColourLower = "#cc241f";
    const lColourMerged = "#5226a3";

    const Merge = (pElements : Elements, pStart : number, pMid : number, pEnd : number) =>
    {
        // Change the colours of the two segments.
        // pElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
        // pElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

        // if (pElements.stop) return;

        // Remove the colours.
        // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default, true);
        
        // Create a temporary container to house the merged segment.
        const lSizeOfMerger : number = pEnd - pStart + 1; // Size of merged segment.
        let lMerger : SortElement[] = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

        // The current indexes of the lower and upper segments, respectively.
        let lIndexLowerSegment = pStart;
        let lIndexUpperSegment = pMid + 1;

        // The 'current' index of lMerger.
        let lMergerIndex : number = 0;
        
        // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
        while (true)
        {
            if (lIndexLowerSegment <= pMid && lIndexUpperSegment <= pEnd)
            {
                if (pElements.compare(lIndexLowerSegment, lOperator, lIndexUpperSegment))
                {
                    lMerger[lMergerIndex++] = pElements.elements[lIndexLowerSegment++];
                }
                else
                {
                    lMerger[lMergerIndex++] = pElements.elements[lIndexUpperSegment++];
                }
                
            }
            else if (lIndexLowerSegment <= pMid)
            {
                lMerger[lMergerIndex++] = pElements.elements[lIndexLowerSegment++];
            }
            else if (lIndexUpperSegment <= pEnd)
            {
                lMerger[lMergerIndex++] = pElements.elements[lIndexUpperSegment++];
            }
            else
            {
                break;
            }
            
        }

        // Change the colours of the two segments.
        // pElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
        // pElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

        // Copy the values from lMerger into the appropriate indexes of pElements.
        for (let i = pStart; i <= pEnd; ++i) 
        { 
            pElements.setValue(i, lMerger[i - pStart].value);
            // pElements.SetElementColour(i, lColourMerged, true);
        }
        
        // Remove the colours.
        // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default, false);
    }

    let lSegmentSize : number; // Current size of segment to split and merge (range: 2 to l_max_segment_size).
    let lStart : number; // First index of segment (first index of lower half).
    let lMid : number; // Middle index of segment (last index of lower half, first index of lower half).
    let lEnd : number; // Last index of segment (last index of upper half).

    // Not necessary to make these variables, but it does help with readability.
    let lContainerMaxIndex : number = pElements.length - 1;
    let lContainerSize : number = pElements.length;

    // Calculate and store the maximum length of a segment.
    let lMaxSegmentSize : number = 1;
    while (lMaxSegmentSize < lContainerSize)
    { lMaxSegmentSize *= 2; }

    for (lSegmentSize = 2; lSegmentSize <= lMaxSegmentSize; lSegmentSize *= 2) // (d).
    {
        for (lStart = 0; lStart <= lContainerMaxIndex - Math.floor(lSegmentSize / 2); lStart += lSegmentSize) // (e).
        {
            // (f). Calculate middle index of segment lStart to lEnd (max index of lower half).
            lMid = lStart + Math.floor((lSegmentSize / 2)) - 1;

            // (g). Calculate max index of segment lStart to lEnd (max index of upper half).
            let l_end_candidate : number = lStart + lSegmentSize - 1;
            if (l_end_candidate < lContainerMaxIndex)
            {
                lEnd = l_end_candidate;
            }
            else
            {
                lEnd = lContainerMaxIndex;
            }

            // Combine the lower (lStart to lMid) and upper (lMid + 1 to lEnd) halves of the current segment.
            Merge(pElements, lStart, lMid, lEnd);
        }
        
    }

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function HeapSort(pElements : Elements, pAscending : boolean, pSort = true)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();

    const MaxHeapify = (pElements : Elements, pIndexLastNode : number, pIndexParentNode : number) => 
    {
        let lIndexMaxValue : number = pIndexParentNode;

        let lIndexLeftChild : number = 2 * pIndexParentNode + 1;
        let lIndexRightChild : number = 2 * pIndexParentNode + 2;

        if (lIndexLeftChild <= pIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the left child's value is higher than that of its parent.
            if (pElements.compare(lIndexLeftChild, "G", lIndexMaxValue))
            {
                lIndexMaxValue = lIndexLeftChild;
            }

        }

        if (lIndexRightChild <= pIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the right child's value is higher than that of the current max.
            if (pElements.compare(lIndexRightChild, "G", lIndexMaxValue))
            {
                lIndexMaxValue = lIndexRightChild;
            }
        }

        if (lIndexMaxValue != pIndexParentNode) // (d).
        {
            // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
            pElements.swap(lIndexMaxValue, pIndexParentNode);

            MaxHeapify(pElements, pIndexLastNode, lIndexMaxValue); // (e).
        }

    }

    const MinHeapify = (pElements : Elements, pIndexLastNode : number, pIndexParentNode : number) => 
    {
        let lIndexMinValue : number = pIndexParentNode;

        let lIndexLeftChild : number = 2 * pIndexParentNode + 1;
        let lIndexRightChild : number = 2 * pIndexParentNode + 2;

        if (lIndexLeftChild <= pIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the left child's value is higher than that of its parent.
            if (pElements.compare(lIndexLeftChild, "L", lIndexMinValue))
            {
                lIndexMinValue = lIndexLeftChild;
            }

        }

        if (lIndexRightChild <= pIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the right child's value is higher than that of the current max.
            if (pElements.compare(lIndexRightChild, "L", lIndexMinValue))
            {
                lIndexMinValue = lIndexRightChild;
            }
            
        }

        if (lIndexMinValue != pIndexParentNode) // (d).
        {
            // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
            pElements.swap(lIndexMinValue, pIndexParentNode);

            MinHeapify(pElements, pIndexLastNode, lIndexMinValue); // (e).
        }

    }


    let lIndexLowestParentNode : number = Math.floor((pElements.length / 2) - 1);

    for (let i = lIndexLowestParentNode; i >= 0; --i)
    {
        pAscending ? MaxHeapify(pElements, pElements.length - 1, i) : 
                        MinHeapify(pElements, pElements.length - 1, i);
    }

    if (pSort)
    {
        for (let lIndexLastNode = pElements.length - 1; lIndexLastNode >= 0;)
        {
            pElements.swap(0, lIndexLastNode);

            pAscending ? MaxHeapify(pElements, --lIndexLastNode, 0) :
                            MinHeapify(pElements, --lIndexLastNode, 0);
        }
    }

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

function ShellSort(pElements : Elements, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pElements.saveSnapshot();
    // source: https://www.geeksforgeeks.org/shellsort/

    // The operator to use in the while loop's condition.
    const lOperator : CompOp = pAscending ? "G" : "L";

    let n : number = pElements.length;

    /*
    * Perform insertion sort on all sublists of pElements where each sublist is comprised of elements of pElements that
    are 'gap' indexes apart from each other.
    */
    for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap / 2))
    {
        // The maximum index (which is an index of pElements) of the current sublist.
        let lIndexMaxSubList = gap;

        /*
        * Each iteration of this for loop performs an insertion sort on one of the sublists. 
        * A sublist's size, given by lIndexMaxSubList, is increased by 1 every time it is iterated over.
        * Each successive iteration of the loop focuses on a different sublist. Each sublist is iterated over several 
        times (equal to its (final) length minus 1).
        * Each sublist mustn't contain the same element as another sublist.
        * The number of elements in a sublist is, at most, n / gap (s = n /gap); the number of sublists is n / s.
        */
        for (; lIndexMaxSubList < n; ++lIndexMaxSubList)
        {
            const lValueToInsert : SortElement = pElements.elements[lIndexMaxSubList]; //= arr[i];

            // The index of the sublist at which lValueToInsert will be inserted.
            let lIndexOfInsert : number = lIndexMaxSubList;

            // The lowest index of the sublist.
            let lIndexMinSublist : number = lIndexMaxSubList % gap;

            for (; lIndexOfInsert > lIndexMinSublist && pElements.compareValue(lIndexOfInsert - gap, lOperator, lValueToInsert.value); 
                lIndexOfInsert -= gap)
            {
                pElements.setValue(lIndexOfInsert, pElements.elements[lIndexOfInsert - gap].value);
            }

            pElements.setValue(lIndexOfInsert, lValueToInsert.value);
        }

    }

    // Load the snapshot to undo the changes.
    pElements.loadSnapshot();
}

// Add an algorithm which just gets the list into heap form (doesn't actually sort).
function Heapify(pElements : Elements, pAscending : boolean)
{
    HeapSort(pElements, pAscending, false);
};

// The names of the sorting algorithms.
const sortAlgoNames = [
    "BUBBLE",
    "COCKTAIL SHAKER",
    "SELECTION",
    "INSERTION",
    "QUICK",
    // "QUICK RANDOM",
    "MERGE",
    "MERGE ITERATIVE",
    "HEAP",
    "SHELL",
    "HEAPIFY"
];

const sortAlgos : { [key: string]: (pElements : Elements, pAscending : boolean) => void } = {
    "BUBBLE": BubbleSort,
    "COCKTAIL SHAKER": CocktailShakerSort,
    "SELECTION": SelectionSort,
    "INSERTION": InsertionSort,
    "QUICK": QuickSortRandomPivot,
    // "QUICK RANDOM": QuickSortRandomPivot,
    "MERGE": MergeSort,
    "MERGE ITERATIVE": MergeSortIterative,
    "HEAP": HeapSort,
    "SHELL": ShellSort,
    "HEAPIFY": Heapify
}


// The ranges used for the sliders.
const ranges = {
    speed:       { min: 1,  max: 1000 },
    numElements: { min: 10, max: 250 }
}

export { sortAlgoNames, sortAlgos, ranges };