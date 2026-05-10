import * as React from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import { useEffect, useState } from "react";
import api from "../../api";

const query = { where: { archived: true } }

const TrashProperties = () => {
    const [APIData, setAPIData] = useState([]);

    const onDeleteHandler = async (key) => {
        const newData = APIData.filter(item => item.propertyId !== key)
        await setAPIData(newData)
    };

    useEffect(() => {
        api.post('/properties/query', {
            query
        }).then((response) => {
            setAPIData(response.data.properties);
        })
    }, [])

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Trash</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{APIData.length > 0 ? `${APIData.length} listings` : 'Archived properties'}</p>
            </div>
            <PropertiesGrid data={APIData} mode="trash" onDeleteHandler={onDeleteHandler} />
        </div>
    );
}

export default TrashProperties;
