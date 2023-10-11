import React, { useContext, useEffect, useState, useRef } from 'react'
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { Button, Input, Skeleton } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import ClearIcon from '@mui/icons-material/Clear';
import TableDataSkelaton from '../components/TableRowsSkelaton';
import axios from 'axios'
import { TableDataContext } from '../context/TableDataContext';
import { useTable } from '../hooks/useTable';

const TablePage = ({ title, dataSourceUrl, columns_to_display }) => {

  const recordsPerPage_list = [5, 10, 20, 50];
  const recordsPerPage = useRef(recordsPerPage_list[0]); // initial value

  const [searchTerm, setSearchTerm] = useState("");

  const styles = {
    btn: 'border border-gray-400 px-3 hover:bg-astudio-Yellow'
  }

  const { state, dispatch } = useContext(TableDataContext);

  const { initTableFn, nextPageFn, previousPageFn, goToPageFn, sortFn, currentPageNum, numbersArray, sortingBy, sortingTypes, selectedSortType, error, isLoading } = useTable({ dataSourceUrl, columns_to_display });

  const [initFnRunning, setInitFnRunning] = useState(true);

  const initFn = async () => {
    if (!initFnRunning) {
      setInitFnRunning(true);
    }
    await initTableFn(recordsPerPage.current);
    const updatedSearchTerm = "";
    setSearchTerm(updatedSearchTerm);
    setInitFnRunning(false);
  }

  useEffect(() => {
    initFn();
  }, []);

  return (
    <div className='m-5 flex flex-col p-3 border border-zinc-700 w-min'>
      <h1 className='mb-3 text-3xl font-bold'>{title}</h1>

      <div className='flex flex-wrap gap-x-5 gap-y-2 mb-5'>
        <div className='flex items-center gap-2'>
          <p >Records/Page:</p>
          <Dropdown>
            <MenuButton size="sm" disabled={initFnRunning || isLoading || (error) ? true : false}>{recordsPerPage.current}</MenuButton>
            <Menu size="sm">
              {recordsPerPage_list.map((rpp, i) => (
                <MenuItem key={i} onClick={async () => {
                  // setRecordsPerPage(rpp);
                  recordsPerPage.current = rpp;
                  await initFn();
                }}>{rpp}</MenuItem>
              ))}
            </Menu>
          </Dropdown>
        </div>
        <div className='flex items-center gap-2'>
          <p >Search Records:</p>
          <Input size='sm'
            placeholder="Enter keywords…"
            startDecorator={<SearchIcon />}
            endDecorator={(searchTerm.length > 0) && <ClearIcon onClick={() => {
              // console.log('clearing search..');
              const updatedSearchTerm = "";
              setSearchTerm(updatedSearchTerm);
              dispatch({ type: "TABLE_SEARCH_RECORDS", payload: { searchTerm: updatedSearchTerm } });
              // and apply existing sorting criteria
              dispatch({
                type: 'TABLE_SORT_RECORDS',
                payload: {
                  sortBy: sortingBy,
                  sortType: selectedSortType,
                }
              })
            }} />}
            value={searchTerm}
            onChange={(event) => {
              const updatedSearchTerm = event.target.value.toString();
              // console.log('updated searchTerm: ', updatedSearchTerm);
              setSearchTerm(updatedSearchTerm);
              dispatch({ type: "TABLE_SEARCH_RECORDS", payload: { searchTerm: updatedSearchTerm.trim() } });
              // and apply existing sorting criteria
              dispatch({
                type: 'TABLE_SORT_RECORDS',
                payload: {
                  sortBy: sortingBy,
                  sortType: selectedSortType,
                }
              })
            }}
            disabled={initFnRunning || isLoading || (error) ? true : false}
          />
        </div>
        <div className='flex gap-2 items-center'>
          <p >Sorting By:</p>
          <Dropdown>
            <MenuButton size="sm" disabled={initFnRunning || isLoading || (error) ? true : false}>{(error) ? "Table error" : sortingBy.toUpperCase() || 'loading..'}</MenuButton>
            {(!initFnRunning && !isLoading) && <Menu size="sm">
              {columns_to_display.map((sKey, i) => (
                <MenuItem key={i} onClick={() => { sortFn(sKey) }}>{sKey.toUpperCase()}</MenuItem>
              ))}
            </Menu>}
          </Dropdown>
          <Button
            color="neutral"
            onClick={() => {
              const desiredSortingType = (selectedSortType == sortingTypes[0]) ? sortingTypes[1] : sortingTypes[0];
              sortFn(sortingBy, desiredSortingType);
            }}
            size="sm"
            variant="outlined"
            disabled={initFnRunning || isLoading || (error) ? true : false}
          >
            {selectedSortType.toUpperCase()}
            {selectedSortType.toUpperCase() == sortingTypes[0] ? <NorthIcon fontSize='small' className="scale-75" /> : <SouthIcon fontSize='small' className="scale-75" />}
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-3 items-center'>
        <div className='border border-astudio-Grey'>
          <table >
            <thead>
              <tr className="bg-astudio-Blue">
                {columns_to_display.map((col, i) => (
                  <th key={i} className='px-3 py-1 border-b-2 border-r-2 border-astudio-Grey'>{col.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(isLoading) ?
                <TableDataSkelaton colsNum={columns_to_display.length} rowsNum={recordsPerPage.current} row_tailwindCSS='px-3 py-1 border-b-2 border-r-2' /> :
                (error != null) ?
                  <tr>
                    <td className='px-3 py-1'>{error}</td>
                  </tr> :
                  (state && state.displayRecords.length > 0) ?
                    state.displayRecords.map((d, i) => (
                      <tr key={i} className='hover:bg-astudio-Grey'>
                        {columns_to_display.map((col, i) => (
                          <th key={i} className='px-3 py-1 border-b-2 border-r-2'>{d[Object.keys(d).find((k) => k == col)]}</th>
                        ))}
                      </tr>
                    )) :
                    <tr>
                      {/* <div>No koko</div> */}
                      <td className='px-3 py-1'>No Data</td>
                    </tr>
              }
            </tbody>
          </table>
        </div>

        {isLoading ?
          <Skeleton variant="rectangular" animation="wave" width={200} height={25} /> :
          // ((error == null) && state && state.displayRecords.length < 1 && )
          (error == null) && (<ul className='flex gap-2 items-center'>
            <a href="#" onClick={async () => {
              await previousPageFn(recordsPerPage.current);
              const updatedSearchTerm = "";
              setSearchTerm(updatedSearchTerm);
            }} className={styles.btn}>Prev</a>
            <div className='flex flex-wrap justify-center'>
              {numbersArray.map((pageNum, i) => (
                <a key={i} href="#" onClick={async () => {
                  await goToPageFn(recordsPerPage.current, pageNum);
                  const updatedSearchTerm = "";
                  setSearchTerm(updatedSearchTerm);
                }} className={`${styles.btn} ${currentPageNum == pageNum ? 'bg-astudio-Yellow' : ''}`}>
                  {pageNum}
                </a>
              ))}
            </div>
            <a href="#" onClick={async () => {
              await nextPageFn(recordsPerPage.current);
              const updatedSearchTerm = "";
              setSearchTerm(updatedSearchTerm);
            }} className={styles.btn}>Next</a>
          </ul>)
        }
      </div>

    </div >
  )
}
export default TablePage