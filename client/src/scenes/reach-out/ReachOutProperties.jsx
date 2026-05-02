import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../index";

const ReachOutProperties = () => {
    const [APIData, setAPIData] = useState(
        []);
    const onDeleteHandler = async (key) => {
        const newData = APIData.filter(item => item.propertyId !== key)
        await setAPIData(newData)
    };

    const query = { where: { archived: false, call: true, explore: false } }
    useEffect(() => {
        axios.post(`${ serverUrl() }/properties/query`, {
            query
        }).then((response) => {
            setAPIData(response.data.properties);
        })
    }, [])

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Reach Out</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{APIData.length > 0 ? `${APIData.length} listings` : 'Properties to call about'}</p>
            </div>
            <PropertiesGrid data={APIData} mode="reach-out" onDeleteHandler={onDeleteHandler} />
        </div>
    );
}

export default ReachOutProperties;
