import {Box, useTheme} from "@mui/material";
import Header from "../global/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from "../../index";

const Transaction = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        { field: "id", headerName: "ID" },
        {
            field: "benefit",
            headerName: "Benefit",
            flex: 1
        },
        {
            field: "businessName",
            headerName: "Business Name",
            flex: 1
        },
        {
            field: "clientName",
            headerName: "Client Name",
            flex: 1
        }];
    const [APIData, setAPIData] = useState([]);
    useEffect(() => {
        axios.get(`${serverUrl()}/transactions`)
            .then((response) => {
                setAPIData(response.data.transactions);
            })
    }, [])
    const navigate = useNavigate();
    const handleCreateClick = () => navigate('/create-form');
    const handleDeleteClick = () => navigate('/delete-form');
    const handleUpdateClick = () => navigate('/update-form');

    return (
        <Box m="20px">
            <Header title="Transactions" subtitle="Transactions List" />
            {isConnected ? <div>Hello , This is your wallet address: {address}</div> : null}

            <Button onClick={handleCreateClick} type='submit'>Create Transaction</Button>
            <Button onClick={handleUpdateClick} type='submit'>Update Transaction</Button>
            <Button onClick={handleDeleteClick} type='submit'>Delete Transaction</Button>
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid checkboxSelection rows={APIData} columns={columns} />
            </Box>
        </Box>
    );
};

export default Transaction;
