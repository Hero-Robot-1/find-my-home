import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import PropertyCard from "./PropertiesCard";

const PropertiesGrid = ({ mode, data }) => {
    return (
        <Grid container disableEqualOverflow={ "true" } padding={ 5 } spacing={ 10 } columns={ 9 }>
            { data.map(item => (
                <Grid key={ item.id } { ...{ md: 3 } } minHeight={ 100 }>
                    <PropertyCard item={ item }/>
                </Grid>
            )) }
        </Grid>
    );
}

export default PropertiesGrid;
