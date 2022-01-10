import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import {
        List, ListItemAvatar, ListItem, 
        ListItemText, ListItemSecondaryAction, ListItemIcon,
        Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography
        } from '@material-ui/core';
import { useFailedMessageContext, useSetEmailListOpenContext } from "../../libs/contextLib";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Alert from '@material-ui/lab/Alert';
import AuthService from "../../services/auth.services";
import './MyOrganization.css';


export default function EmailList() {
        const JWTtoken = AuthService.getCurrentUsertoken();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [emailList, setEmailList] = useState(new Array);
        const [retrieveFailed, setRetrieveFailed] = useState(false);
        const [createListFailed, setCreateListFailed] = useState(false);
        const [createListOpen, setCreateListOpen] = useState(false);

        const { emailListOpen, setEmailListOpen } = useSetEmailListOpenContext();
        const { failedMessage, setFailedMessage } = useFailedMessageContext();

        async function retrieveEmailList() {
                fetch("/email-lists/retrieve-all", {
                        method: 'GET',
                        port: 3080,
                        headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${JWTtoken}` 
                        }
                })
                .then(async res => {
                        const data = await res.json();
                        console.log("-- data:", data);
                        console.log("-- res.status:", res.status);
                        setRetrieveFailed(false);
                        if(!res.ok){
                                setFailedMessage(data.message);
                                console.log("something went wrong", res.status);
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                        } else{
                                setEmailList(data.data);
                                console.log(res.status, '[OK]');
                                        
                        }
                })
                .catch((err) => {
                        setRetrieveFailed(true);
                        console.error("-- error:", err);
                })
                console.log("end fetch call");
        }

        useEffect(() => {
                const fetchData = async () => {
                        await retrieveEmailList();
                     }
                   
                fetchData();
        }, []);

        const setField = (field, value) => {
                setForm({
                  ...form,
                  [field]: value
                })
        // Check and see if errors exist, and remove them from the error object:
                if ( !!errors[field] ) setErrors({
                  ...errors,
                  [field]: null
                })
        }

        const findFormErrors = () => {
                const { emailListName, emailList} = form
                const newErrors = {};

                if (!emailListName || emailListName === '') newErrors.emailListName = 'This field cannot be blank'

                if (!emailList || emailList === '') newErrors.emailList = 'This field cannot be blank'
                
                return newErrors
        }

        const constructListItem = (emailListName, emailList, i) => (
                <ListItem 
                key={i + 1} 
                style={{height: "auto", width: "auto", maxHeight: "auto",
                margin: "0 auto", borderBottom: "solid gainsboro 1px", 
                display: "flex", flexDirection: 'row', flex: "1"}}
                >
                <Row style={{height: "100%", width: "100%"}}>
                <IconButton
                disabled
                as={Col}
                key={i} 
                style={{paddingBottom: "0px", paddingTop: "0px", width: "40%"}}
                >  
                <ListItemText
                        style={{textAlign: "center", color: "black"}}
                        primary={emailListName}
                />                
                </IconButton>
                <div style={{height: "100%", width: "100%"}}>
                <ListItemSecondaryAction as={Col} style={{width: "50%", height: "100%"}}>
                        <Typography variant="body2" className="text-center" color="textSecondary" align="center" style={{width: "100%", height: "100%", overflowY: "auto", overflowX: "hidden"}}>
                                {emailList? emailList.map((email) => {
                                        if (email === emailList[emailList.length-1]) {
                                                return email
                                        } else {
                                                return email +", "
                                        }
                                }) : null}
                        </Typography>
                </ListItemSecondaryAction>
                </div>
                </Row>
                </ListItem>
        );


        const handleEmailListClose = () => {
                setErrors({
                        ...errors,
                        emailListName: null,
                        emailList: null
                })
                setRetrieveFailed(false);
                setEmailListOpen(false);
                retrieveEmailList();
        };

        const handleCreateListOpen = () => {
                setCreateListOpen(true);
        }

        const createListClose = () => {
                setErrors({
                        ...errors,
                        emailListName: null,
                        emailList: null
                })
                setCreateListFailed(false);
                setCreateListOpen(false);
                retrieveEmailList();
        };

        function handleCreateList(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = findFormErrors();
                console.log(form.emailList);

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch("/email-lists/create-new", {
                                method: 'POST',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        emailListName: form.emailListName,
                                        emailList: form.emailList.split(','),
                                }),
                                signal: signal
                        })
                        .then(async res => {
                                const data = await res.json();
                                console.log("-- data:", data);
                                console.log("-- res.status:", res.status);
                                setFailedMessage(data.message);
                                if(!res.ok){
                                        console.log("something went wrong", res.status);
                                        const error = (data && data.message) || res.status;
                                        setTimeout(controller.abort(), 3000);
                                        return Promise.reject(error);
                                } else{
                                        console.log("201 OK");
                                        createListClose();
                                }
                        })
                        .catch((err) => {
                                setCreateListFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }

        return (
                <div>
                                {/*  email list modal */}
                                <Modal
                                key={1}
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                aria-describedby="contained-modal-description"
                                centered
                                show={emailListOpen}
                                onHide={handleEmailListClose}
                                >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Email Lists
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                        <List style={{position: "relative", overflow: "auto", maxHeight: "300px"}}>
                                                <ListItem 
                                                key={0} 
                                                style={{paddingBottom: "0px", paddingTop: "0px", 
                                                margin: "0 auto", borderBottom: "solid gainsboro 1px", 
                                                display: "flex", flexDirection: 'row'}}
                                                onClick={() => console.log("onclicked!")}
                                                >
                                                <Row>   
                                                <IconButton
                                                disabled
                                                as={Col}
                                                key={0} 
                                                style={{paddingBottom: "0px", paddingTop: "0px", width: "40%"}}
                                                >
                                                <Typography variant="h6" className="text-center" style={{color: "black"}}>
                                                List Title
                                                </Typography>
                                                                
                                                
                                                </IconButton>
                                                <ListItemSecondaryAction as={Col} style={{width: "50%", color: "black"}}>
                                                        <Typography variant="h6" className="text-center" style={{color: "black"}}>
                                                        Email Entry
                                                        </Typography>
                                                </ListItemSecondaryAction>
                                                </Row>
                                                </ListItem>
                                                {emailList.map((item, i) => (
                                                        constructListItem(item.emailListName, item.emailList, i)
                                                ))}
                                                <ListItem>
                                                <IconButton
                                                edge="end"
                                                aria-label="add"
                                                onClick={handleCreateListOpen}
                                                style={{margin: "0 auto"}}
                                                type="submit"
                                                >
                                                <AddCircleIcon />
                                                </IconButton>  
                                                </ListItem>
                                        </List>
                                        {retrieveFailed && <Alert severity="error">{failedMessage}</Alert> }
                                </Modal.Body>
                                <Modal.Footer className="two-button">
                                </Modal.Footer>
                                </Modal>
                                {/*  create list modal */}
                                <Modal
                                key={2}
                                size="md"
                                aria-labelledby="contained-modal-title-vcenter"
                                aria-describedby="contained-modal-description"
                                centered
                                show={createListOpen}
                                onHide={createListClose}
                                >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Email Lists
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <Form>
                                        <Form.Group className="formBox" size="md" controlId="text">
                                                <Form.Label>Email list title</Form.Label>
                                                <Form.Control
                                                autoFocus
                                                type="text"
                                                onChange={(e) => setField('emailListName', e.target.value)}
                                                isInvalid={!!errors.emailListName}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                        {errors.emailListName}
                                                </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="formBox" size="md" controlId="email">
                                                <Form.Label>List entry</Form.Label>
                                                <Form.Control
                                                autoFocus
                                                type="email"
                                                onChange={(e) => setField('emailList', e.target.value)}
                                                isInvalid={!!errors.emailList}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                        {errors.emailList}
                                                </Form.Control.Feedback>
                                        </Form.Group>
                                        {createListFailed && <Alert severity="error">{failedMessage}</Alert> }
                                </Form>
                                </Modal.Body>
                                <Modal.Footer className="two-button">
                                <Row className="row-profile">
                                        <Button
                                        as={Col}
                                        onClick={handleCreateList}
                                        className="custom-btn-profile" 
                                        block size="md" 
                                        type="submit"
                                        >
                                        Create
                                        </Button>
                                        </Row>
                                <Row className="row-profile">
                                        <Button
                                        as={Col}
                                        onClick={createListClose}
                                        className="custom-btn-profile" 
                                        block size="md" 
                                        type="button"
                                        >
                                        Cancel
                                        </Button>
                                </Row>
                                </Modal.Footer>
                                </Modal>
        </div>
        );
}