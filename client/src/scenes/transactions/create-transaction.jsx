import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react'
import axios from 'axios';
import { serverUrl } from "../../index";

const CreateTransaction = () => {
    const [benefit, setBenefit] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [clientName, setClientName] = useState('');
    const postData = () => {
        axios.post(`${serverUrl()}/transactions`, {
            benefit,
            businessName,
            clientName
        });
    }
    return (
        <div>
            <Form className="create-form">
                <Form.Field>
                    <label>Benefit</label>
                    <input placeholder='Benefit' onChange={(e) => setBenefit(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Business Name</label>
                    <input placeholder='Business Name' onChange={(e) => setBusinessName(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Client Name</label>
                    <input placeholder='Client Name' onChange={(e) => setClientName(e.target.value)}/>
                </Form.Field>

                <Button onClick={postData} type='submit'>Submit</Button>
            </Form>
        </div>
    )
}

export default CreateTransaction;
