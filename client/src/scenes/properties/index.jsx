import * as React from 'react';
import {useEffect, useState} from 'react';
import axios from "axios";
import {serverUrl} from "../../index";
import FullBorderedGrid from "./Grid";
import './Property.scss';

export default function AlignItemsList() {
    const [APIData, setAPIData] = useState([]);
    useEffect(() => {
        axios.get(`${serverUrl()}/properties`)
            .then((response) => {
                setAPIData(response.data.properties);
            })
    }, [])

    return (
        <FullBorderedGrid items={APIData}/>

    );
}
