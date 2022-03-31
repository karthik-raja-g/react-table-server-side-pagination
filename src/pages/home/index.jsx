import React, { useState, useEffect } from "react";
import { getData, columns, formatRowData, getDataFromSearch } from "./data";
import Table from "../../components/table";
import Pagination from "../../components/pagination";
import useDebounce from "./useDebounce";

const HomePage = () => {
  const [pageData, setPageData] = useState({
    rowData: [],
    isLoading: false,
    totalPages: 0,
    totalPassengers: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('',300)
  const showLoading = () => {
    setPageData((prevState) => ({
      ...prevState,
      rowData: [],
      isLoading: true,
    }));
  }
  // To handle page change
  useEffect(() => {
    if (!currentPage) return;
    showLoading();
    getData(currentPage).then((info) => {
      const { totalPages, totalPassengers, data } = info;
      setPageData({
        isLoading: false,
        rowData: formatRowData(data),
        totalPages,
        totalPassengers: 150,
      });
    });
  }, [currentPage]);

  // To handle search
  useEffect(() => {
    if (!search) {
      setCurrentPage(1);
      return;
    }
    setDebouncedSearch(search);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) return;
    showLoading();
    setCurrentPage(0);
    getDataFromSearch(debouncedSearch).then((info) => {
      const { totalPages, data } = info;
      setPageData({
        isLoading: false,
        rowData: formatRowData(data),
        totalPages,
        totalPassengers: 150,
      });
    });
  }, [debouncedSearch]);

  return (
    <div>
      <p>Total Passengers: {pageData.totalPassengers || "Loading..."}</p>
      <div>
        <label>Search Airline</label>
        <input value={search} onChange={e => setSearch(e.target.value.trim())}/>
      </div>
      <div style={{ height: "600px" }}>
        <Table
          columns={columns}
          data={pageData.rowData}
          isLoading={pageData.isLoading}
        />
      </div>
      <Pagination
        totalRows={pageData.totalPassengers}
        pageChangeHandler={setCurrentPage}
        rowsPerPage={15}
      />
    </div>
  );
};

export default HomePage;
