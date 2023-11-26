import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../index";
import Pagination from '@mui/material/Pagination';

const NewProperties = () => {
    const [APIData, setAPIData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const onDeleteHandler = async (key) => {
        const newData = APIData.filter(item => item.propertyId !== key)
        await setAPIData(newData)
    };

    const handlePageChange = () => {
        setPage(page + 1);
    }

    useEffect(() => {
        axios.get(`${ serverUrl() }/properties?page=${ page }`)
            .then((response) => {
                setAPIData(response.data.properties);
                setPageCount(Math.ceil(response.data.pagination.count / 30));
            })
    }, [page])

    return (
        <div>
            {pageCount > 1 ? <Pagination count={ pageCount }
                        size="large"
                        page={ page }
                        variant="outlined"
                        shape="rounded"
                        onChange={handlePageChange}
                        style={ { justifyContent: "center", display: "flex" } }/> : null }

            <PropertiesGrid data={ APIData } mode={ 'new' } onDeleteHandler={ onDeleteHandler } />
        </div>
    );
}

export default NewProperties;
