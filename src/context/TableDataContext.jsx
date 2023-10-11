import { createContext, useReducer } from "react";
import { isNumeric } from '../methods'

const initialState = {
    pageSize: 0,
    catchedRecords: [],
    totalRecords: 0,
    displayRecords: []

};

export const TableDataContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "TABLE_INIT":
            {
                // here we init local/catched state object
                // the expected payload should look 
                // like: { pageSize: xxx, recordsToAdd: [list of objects], totalRecords: num  }
                const { pageSize, recordsToAdd, totalRecords } = action.payload;

                const updatedState = {
                    pageSize: pageSize,
                    catchedRecords: [...recordsToAdd],
                    totalRecords: totalRecords,
                    displayRecords: [...recordsToAdd],
                }
                return updatedState;
            }

        case "TABLE_REPLACE_RECORDS": { // <-- temp
            // the payload should look like { recordsToAdd: [...] }
            const { recordsToAdd } = action.payload;
            // console.log('updatedState: ', updatedState);

            const updatedState = {
                ...state,
                catchedRecords: recordsToAdd,
                displayRecords: recordsToAdd,
            };
            return updatedState;
        }

        case "TABLE_SORT_RECORDS": {
            // here the payload should look like {sortBy: xxx, sortType}
            // console.log('payload is: ', action.payload);
            const { sortBy, sortType } = action.payload;
            const updatedDisplayRecords = [...state.displayRecords];
            const compareFn = (a, b) => {
                // check if properties to compare is numeric
                // if so - do a numeric comparison. 
                // otherwise do a string comparison.
                if (isNumeric(a[sortBy])) {
                    if (sortType == "ASC") { return (a[sortBy] - b[sortBy]) };
                    return (b[sortBy] - a[sortBy]);
                } else {
                    // do string (case-insensitive) comparison here..
                    const A_upper = a[sortBy].toString().toUpperCase(); // ignore upper and lowercase
                    const B_upper = b[sortBy].toString().toUpperCase(); // ignore upper and lowercase
                    if (A_upper < B_upper) {
                        // return -1;
                        if (sortType == "ASC") { return -1 } else { return 1 };
                    } else if (A_upper > B_upper) {
                        //   return 1;
                        if (sortType == "ASC") { return 1 } else { return -1 };
                    }
                    return 0;
                }
            }
            updatedDisplayRecords.sort(compareFn); // <-- here records array will be sorted in place
            const updatedState = {
                ...state,
                displayRecords: updatedDisplayRecords
            };
            // console.log('updatedState: ', updatedState);
            return updatedState;
        }

        case "TABLE_SEARCH_RECORDS": {
            // here we filter catched records using given keyword/searchTerm
            // the filtered list will be placed in displayRecords object
            // the payload should look like { searchTerm: "John" }
            // the search should be case-insensitive
            const { searchTerm } = action.payload;
            const catchedRecords = state.catchedRecords;
            const filteredRecords = catchedRecords.filter((obj) => {
                // console.log('obj string: ', JSON.stringify(obj));
                return JSON.stringify(obj).toLowerCase().includes(searchTerm.toLowerCase());
            });
            const updatedState = {
                ...state,
                displayRecords: filteredRecords
            };
            // console.log('updatedState: ', updatedState);
            return updatedState;
        }
        default:
            return state;
    }
};

export const TableDataContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    // console.log('TableDataContext state is : ', state);

    return <TableDataContext.Provider value={{ state, dispatch }}>
        {children}
    </TableDataContext.Provider>
}