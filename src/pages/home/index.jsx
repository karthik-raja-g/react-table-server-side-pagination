import React, { useState, useEffect } from "react";
import { getData, columns, formatRowData } from "./data";
import Table from "../../components/table";
import Pagination from "../../components/pagination";

const HomePage = () => {
  const [pageData, setPageData] = useState({
    rowData: [],
    isLoading: false,
    totalPages: 0,
    totalPassengers: 150,
  });
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setPageData((prevState) => ({
      ...prevState,
      rowData: [],
      isLoading: true,
    }));
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
  return (
    <div>
      <p>Total Passengers: {pageData.totalPassengers || "Loading..."}</p>
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
