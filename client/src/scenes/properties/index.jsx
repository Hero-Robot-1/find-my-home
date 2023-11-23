import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import { serverUrl } from "../../index";
import Grid from "@mui/material/Unstable_Grid2";
import PropertyCard from "./PropertiesCard";

const PropertiesGrid = () => {
    const [APIData, setAPIData] = useState([]);
    useEffect(() => {
        axios.get(`${ serverUrl() }/properties`)
            .then((response) => {
                setAPIData(response.data.properties);
            })
    }, [])

    return (
        <Grid container disableEqualOverflow={ "true" } padding={ 5 } spacing={ 10 } columns={ 9 }>
            { APIData.map(item => (
                <Grid key={ item.id } { ...{ md: 3 } } minHeight={ 100 }>
                    <PropertyCard item={ item }/>
                </Grid>
            )) }
        </Grid>
    );
}

export default PropertiesGrid;
