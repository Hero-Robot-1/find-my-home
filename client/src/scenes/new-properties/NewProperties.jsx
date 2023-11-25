import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../index";

const NewProperties = () => {
    const [APIData, setAPIData] = useState([]);
    const onDeleteHandler = async (key) => {
        const newData = APIData.filter(item => item.propertyId !== key)
        await setAPIData(newData)
    };

    useEffect(() => {
        axios.get(`${ serverUrl() }/properties`)
            .then((response) => {
                setAPIData(response.data.properties);
            })
    }, [])

    return (
        <PropertiesGrid data={ APIData } mode={ 'new' } onDeleteHandler={ onDeleteHandler }></PropertiesGrid>
    );
}

export default NewProperties;
