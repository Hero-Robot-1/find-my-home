import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../index";

const ExploreProperties = () => {
    const [APIData, setAPIData] = useState(
        []);
    const onDeleteHandler = async (key) => {
        const newData = APIData.filter(item => item.propertyId !== key)
        await setAPIData(newData)
    };

    const query = { where: { archived: false, explore: true } }
    useEffect(() => {
        axios.post(`${ serverUrl() }/properties/query`, {
            query
        }).then((response) => {
            setAPIData(response.data.properties);
        })
    }, [])

    return (
        <PropertiesGrid data={ APIData } mode={ 'explore' } onDeleteHandler={ onDeleteHandler }></PropertiesGrid>
    );
}

export default ExploreProperties;
