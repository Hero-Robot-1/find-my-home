import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../index";

const query = { where: { archived: false, liked: true, call: false } }

const LikedProperties = () => {
    const [APIData, setAPIData] = useState(
        []);
    const onDeleteHandler = async (key) => {
        const newData = APIData.filter(item => item.propertyId !== key)
        await setAPIData(newData)
    };

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
                <h1 className="text-2xl font-bold text-foreground">Liked</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{APIData.length > 0 ? `${APIData.length} listings` : 'Properties you liked'}</p>
            </div>
            <PropertiesGrid data={APIData} mode="liked" onDeleteHandler={onDeleteHandler} />
        </div>
    );
}

export default LikedProperties;
