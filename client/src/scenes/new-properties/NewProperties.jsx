import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../index";

const NewProperties = () => {
    const [APIData, setAPIData] = useState([]);
    useEffect(() => {
        axios.get(`${ serverUrl() }/properties`)
            .then((response) => {
                setAPIData(response.data.properties);
            })
    }, [])

    return (
        <PropertiesGrid data={ APIData } mode={ 'new' }></PropertiesGrid>
    );
}

export default NewProperties;
