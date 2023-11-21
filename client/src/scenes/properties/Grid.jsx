import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import PropertyCard from "./Card";

const FullBorderedGrid = ({ items }) => {
    console.log("@@@@@@@ + " + JSON.stringify(items))
    return (
        <Grid container disableEqualOverflow={"true"} padding={5} spacing={10} columns={9}>
            { items.map(item => (
                <Grid key={item.id} {...{ md: 3 }} minHeight={100} >
                    <PropertyCard item={item}/>
                </Grid>
            ))}
        </Grid>
    );
}

export default FullBorderedGrid;
