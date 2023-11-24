import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../index";

const TrashProperties = () => {
    const [APIData, setAPIData] = useState([]);
    const query = { where: { archived: true } }
    useEffect(() => {
        axios.post(`${ serverUrl() }/properties/query`, {
            query
        }).then((response) => {
            setAPIData(response.data.properties);
        })
    }, [])

    return (
        <PropertiesGrid data={ APIData } mode={ 'trash' }></PropertiesGrid>
    );
}

export default TrashProperties;
