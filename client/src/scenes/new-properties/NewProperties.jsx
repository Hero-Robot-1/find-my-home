import * as React from 'react';
import { useEffect, useState } from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import axios from "axios";
import { serverUrl } from "../../index";
import Pagination from '@mui/material/Pagination';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { neighborhoods } from "../../consts/neighborhoods";

const NewProperties = () => {
    const [APIData, setAPIData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [neighborhood, setNeighborhood] = useState('');
    const onDeleteHandler = async (key) => {
        const newData = APIData.filter(item => item.propertyId !== key)
        await setAPIData(newData)
    };

    const handlePageChange = (e, p) => {
        setPage(p);
    }

    const handleNeighborhoodChange = (event: SelectChangeEvent) => {
        setPage(1);
        setNeighborhood(event.target.value);
    };

    useEffect(() => {
        let url = `${ serverUrl() }/properties?page=${ page }`;
        if (!!neighborhood) {
            url += `&neighborhood=${neighborhood}`
        }
        axios.get(url)
            .then((response) => {
                setAPIData(response.data.properties);
                setPageCount(Math.ceil(response.data.pagination.count / 30));
            })
    }, [page, neighborhood])

    return (
        <div>

            {pageCount > 1 ? <Pagination count={ pageCount }
                        size="large"
                        page={ page }
                        variant="outlined"
                        shape="rounded"
                        onChange={handlePageChange}
                        style={ { justifyContent: "center", display: "flex" } }/> : null }

            <FormControl sx={{width: "200px", left: "50px"}} variant={"outlined"}>
                <InputLabel id="demo-simple-select-label">Neighborhood</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={neighborhood}
                    label="Age"
                    onChange={handleNeighborhoodChange}
                >
                    <MenuItem value={''}>כל תל אביב</MenuItem>

                    { neighborhoods.map(item => (
                        <MenuItem value={item}>{ item }</MenuItem>
                    )) }
                </Select>
            </FormControl>

            <PropertiesGrid data={ APIData } mode={ 'new' } onDeleteHandler={ onDeleteHandler } />
        </div>
    );
}

export default NewProperties;
