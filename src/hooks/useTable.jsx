import { useContext, useRef, useState } from "react";
import { TableDataContext } from "../context/TableDataContext";
import axios from "axios";

export const useTable = ({ dataSourceUrl, columns_to_display }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const currentPageNum = useRef(1);
    const totalPages = useRef(0);
    const numbersArray = useRef([]);

    const sortingBy = useRef("");
    const sortingTypes = ["ASC", "DES"];
    const selectedSortTypeRef = useRef(sortingTypes[0]); // initial value

    const { dispatch } = useContext(TableDataContext);

    const initTableFn = async (recordsPerPage) => {

        if (!isLoading) {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await axios.get(`${dataSourceUrl}/?limit=${recordsPerPage}`);
            // console.log('response is: ', response);

            if (response.status == 200) {

                // init currentPageNum
                currentPageNum.current = 1;

                totalPages.current = Math.ceil(response.data.total / recordsPerPage);

                numbersArray.current = [...Array(totalPages.current + 1).keys()].slice(1); // ex. [1,2,3,4]

                // check if columns_to_display are valid
                // and corresponds to the keys of a recored
                // on the returned records list
                let records_list = Object.values(response.data)[0] || [];
                let record_keys = Object.keys(records_list[0]); // represents the first object in records list

                const bigArray = record_keys.map(k => k.toLowerCase());
                const smallArray = columns_to_display.map(k => k.toLowerCase());
                const keysMatch = smallArray.every(r => bigArray.includes(r))
                // console.log('birArray: ', bigArray);
                // console.log('smallArray: ', smallArray);
                // console.log('keysMatch: ', keysMatch);
                if (!keysMatch) {
                    let msg = `columns_to_display is invalid`;
                    throw (msg);
                }
                // init sortingBy and selectedSortTypeRef
                sortingBy.current = columns_to_display[0];
                selectedSortTypeRef.current = sortingTypes[0];

                dispatch({
                    type: 'TABLE_INIT',
                    payload: {
                        pageSize: recordsPerPage,
                        recordsToAdd: Object.values(response.data)[0], // <-- represents the first property in the response object. ex. (products: [...]). 
                        totalRecords: response.data.total,
                    }
                });
            } else {
                throw (response.statusText);
            }
        } catch (error) {
            let msg = `initTableFn Error: ${error}`;
            console.log(msg);
            setError(msg);
        }

        // await new Promise((resolve) => setTimeout(resolve, 3000));
        setIsLoading(false);
    }

    const nextPageFn = async (recordsPerPage) => {
        console.log('nextPageFn..');

        // ------TO BE IMPLEMENTED ------------------
        // here we will try to look the page 
        // in the catched context.
        // if found - return the catched page
        // if not - contact the server to get the page
        // -----------------------------------------

        const newPageNum = currentPageNum.current + 1;

        if (newPageNum > totalPages.current) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${dataSourceUrl}/?limit=${recordsPerPage}&skip=${(newPageNum - 1) * recordsPerPage}`);
            // console.log('response is: ', response);

            if (response.status == 200) {

                currentPageNum.current = newPageNum; // <-- very important

                dispatch({
                    // type: 'TABLE_ADD_RECORDS',
                    type: 'TABLE_REPLACE_RECORDS',
                    payload: {
                        recordsToAdd: Object.values(response.data)[0], // <-- represents the first property in the response object. ex. (products: [...]). 
                    }
                });
                // and apply existing sorting criteria
                dispatch({
                    type: 'TABLE_SORT_RECORDS',
                    payload: {
                        sortBy: sortingBy.current,
                        sortType: selectedSortTypeRef.current
                    }
                })
            } else {
                throw (response.statusText);
            }
        } catch (error) {
            let msg = `fetchData Error: ${error}`;
            console.log(msg);
            setError(msg);
        }

        setIsLoading(false);
    }

    const previousPageFn = async (recordsPerPage) => {
        console.log('previousPageFn..');

        // ------TO BE IMPLEMENTED ------------------
        // here we will try to look the page 
        // in the catched context.
        // if found - return the catched page
        // if not - contact the server to get the page
        // -----------------------------------------

        const newPageNum = currentPageNum.current - 1;

        if (newPageNum < 1) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${dataSourceUrl}/?limit=${recordsPerPage}&skip=${(newPageNum - 1) * recordsPerPage}`);
            // console.log('response is: ', response);

            if (response.status == 200) {

                currentPageNum.current = newPageNum; // <-- very important

                dispatch({
                    // type: 'TABLE_ADD_RECORDS',
                    type: 'TABLE_REPLACE_RECORDS',
                    payload: {
                        recordsToAdd: Object.values(response.data)[0], // <-- represents the first property in the response object. ex. (products: [...]). 
                    }
                });
                // and apply existing sorting criteria
                dispatch({
                    type: 'TABLE_SORT_RECORDS',
                    payload: {
                        sortBy: sortingBy.current,
                        sortType: selectedSortTypeRef.current
                    }
                })
            } else {
                throw (response.statusText);
            }
        } catch (error) {
            let msg = `fetchData Error: ${error}`;
            console.log(msg);
            setError(msg);
        }

        setIsLoading(false);
    }
    const goToPageFn = async (recordsPerPage, pageNum) => {
        console.log('goToPageFn..');

        const newPageNum = pageNum;

        if (!numbersArray.current.includes(pageNum)) {
            console.log('goToPageFn error: pageNum is invalid');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${dataSourceUrl}/?limit=${recordsPerPage}&skip=${(newPageNum - 1) * recordsPerPage}`);
            // console.log('response is: ', response);

            if (response.status == 200) {

                currentPageNum.current = newPageNum; // <-- very important

                dispatch({
                    // type: 'TABLE_ADD_RECORDS',
                    type: 'TABLE_REPLACE_RECORDS',
                    payload: {
                        recordsToAdd: Object.values(response.data)[0], // <-- represents the first property in the response object. ex. (products: [...]). 
                    }
                });
                // and apply existing sorting criteria
                dispatch({
                    type: 'TABLE_SORT_RECORDS',
                    payload: {
                        sortBy: sortingBy.current,
                        sortType: selectedSortTypeRef.current
                    }
                })
            } else {
                throw (response.statusText);
            }
        } catch (error) {
            let msg = `fetchData Error: ${error}`;
            console.log(msg);
            setError(msg);
        }

        setIsLoading(false);
    }

    const sortFn = async (sortBy, desiredSortingType = selectedSortTypeRef.current) => {
        // console.log('sortFn..');

        sortingBy.current = sortBy; // <-- IMPORTANT
        selectedSortTypeRef.current = desiredSortingType;

        // console.log(`sortingBy: ${sortBy}, sortType: ${selectedSortTypeRef.current}`);

        // rearrange catched records according to 'sortBy' and 'sortType'
        dispatch({ type: 'TABLE_SORT_RECORDS', payload: { sortBy, sortType: selectedSortTypeRef.current } })
    }


    return {
        initTableFn,
        nextPageFn,
        previousPageFn,
        goToPageFn,
        sortFn,
        currentPageNum: currentPageNum.current,
        numbersArray: numbersArray.current,
        sortingBy: sortingBy.current,
        sortingTypes,
        selectedSortType: selectedSortTypeRef.current.toString(),
        error,
        isLoading
    }
}