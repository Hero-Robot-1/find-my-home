import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import PropertyCard from "./PropertiesCard";

const PropertiesGrid = ({ mode, data }) => {
    return (
        <Grid container   alignContent="center"
              alignItems="center"
              wrap="wrap" disableEqualOverflow={ "true" } padding={ 6 } spacing={ 7 } columns={ 9 }>
            { data.map(item => (
                <Grid key={ item.id } { ...{ sm: 6, md: 3 } } minHeight={ 100 }>
                    <PropertyCard item={ item }/>
                </Grid>
            )) }
        </Grid>
    );
}

export default PropertiesGrid;
