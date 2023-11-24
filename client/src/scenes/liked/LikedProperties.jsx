import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../index";

const LikedProperties = () => {
    const [APIData, setAPIData] = useState([]);
    const query = { where: { archived: false, liked: true } }
    useEffect(() => {
        axios.post(`${ serverUrl() }/properties/query`, {
            query
        }).then((response) => {
            setAPIData(response.data.properties);
        })
    }, [])

    return (
        <PropertiesGrid data={ APIData } mode={ 'liked' }></PropertiesGrid>
    );
}

export default LikedProperties;
