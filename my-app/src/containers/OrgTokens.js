import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import {
        List, ListItemAvatar, ListItem, 
        ListItemText, ListItemSecondaryAction, ListItemIcon,
        Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography
        } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import GroupIcon from '@material-ui/icons/Group';
import CachedIcon from '@material-ui/icons/Cached';
import SettingsIcon from "@material-ui/icons/Settings";
import Alert from '@material-ui/lab/Alert';
import ButtonLoader from "../components/ButtonLoader";
import { useFailedMessageContext } from "../libs/contextLib";
import "./project/MyOrganization.css";

export default function OrgTokens() {
        const history = useHistory();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [newUser, setNewUser] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [CreateFailed, setCreateFailed] = useState(false);
        const [secondary, setSecondary] = useState(false);
        const [getOrgtokensFailed, setGetOrgtokensFailed] = useState(false);
        const [orgTokensList, SetOrgTokensList] = useState(Array(0));
        const [deleteTokenOpen, setDeleteTokenOpen] = useState(false);
        const [whoseOption, setWhoseOption] = useState({organizationName: "", isExpired: ""});
        const [deleteOrgTokenFailed, setDeleteOrgTokenFailed] = useState(false);

        const {failedMessage, setFailedMessage} = useFailedMessageContext();

        const formList =  [
                { controlId: 'organization', label: 'org', title: 'organization', type: 'text', error: errors.org },
                { controlId: 'email', label: 'email', title: 'email', type: 'email', error: errors.email },
                { controlId: 'email', label: 'confirmEmail', title: 'confirm email', type: 'email', error: errors.confirmEmail }
        ];

        async function getOrgtokens() {
                console.log("getOrg start")

                fetch("/owner/get-organization-tokens", {
                        method: 'GET',
                        port: 3080,
                        headers: { 
                                'Content-Type': 'application/json', 
                        }
                })
                .then(async res => {
                        const data = await res.json();
                        console.log("-- data:", data);
                        console.log("-- res.status:", res.status);
                        setGetOrgtokensFailed(false);
                        setFailedMessage(data.message);
                        if(!res.ok){
                                console.log("something went wrong", res.status);
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                        } else{
                                SetOrgTokensList(data.data);
                                console.log(res.status, '[OK]');
                                        
                        }
                })
                .catch((err) => {
                        setGetOrgtokensFailed(true);
                        console.error("-- error:", err);
                })
                console.log("end fetch call");
        }

        useEffect(() => {
                const fetchData = async () => {
                        await getOrgtokens();
                     }
                   
                fetchData();
        }, []);

        const constructListItem = (organizationName, isExpired, i) => (
                <ListItem key={i} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemAvatar>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        as={Col} 
                                        style={{width: "100%", cursor:"pointer"}}
                                >
                                <Avatar>
                                <GroupIcon />
                                </Avatar>
                                </IconButton>
                        </ListItemAvatar>
                                <ListItemText
                                style={{marginLeft: "5px"}}
                                primary={organizationName}
                                secondary={"Expired? " + isExpired}
                                />
                        <ListItemSecondaryAction>
                                {
                                (<IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={() => handleDeleteTokenOpen(i)}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <RemoveIcon />
                                </IconButton>)
                                }
                        </ListItemSecondaryAction>
                </ListItem>
        );

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

        const deleteOrgTokenFormErrors = () => {
                const { organizationName, organizationNameConfirm } = form
                const newErrors = {};
                
                if (!organizationName || organizationName ==='') newErrors.organizationName = 'This field cannot be blank'

                if (!organizationNameConfirm || organizationNameConfirm === '' || organizationName !== organizationNameConfirm) newErrors.organizationNameConfirm = 'both organization name fields should be matched'
                
                return newErrors
        }
 
        const handleDeleteTokenOpen = (key) => {
                console.log("whose key?", orgTokensList[key]);
                setWhoseOption(orgTokensList[key]);
                setDeleteTokenOpen(true);        
                
        };

        const handleDeleteTokenClose = () => {
                setErrors({
                        ...errors,
                        organizationName: null,
                        organizationNameConfirm: null,
                })
                setDeleteOrgTokenFailed(false);
                setDeleteTokenOpen(false);       
                
        };

        function handleDeleteOrgToken(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = deleteOrgTokenFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch("/owner/remove-organization-token", {
                                method: 'DELETE',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',  
                                },
                                body: JSON.stringify({
                                        organizationName: form.organizationName, 
                                }),
                                signal: signal
                        })
                        .then(async res => {
                                console.log("-- data:", res);
                                console.log("-- res.status:", res.status);
                                if(!res.ok){
                                        const data = await res.json();
                                        setFailedMessage(data.message);
                                        console.log("something went wrong", res.status);
                                        const error = (data && data.message) || res.status;
                                        setTimeout(controller.abort(), 3000);
                                        return Promise.reject(error);
                                } else{
                                        console.log("201 OK");
                                        getOrgtokens();
                                        handleDeleteTokenClose();
                                }
                        })
                        .catch((err) => {
                                setDeleteOrgTokenFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }


        return (
                <div className="Project">
                {/* delete organization account modal */}
                <Modal
                key={0}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={deleteTokenOpen}
                onHide={handleDeleteTokenClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Delete Organization Token
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form>
                        {<Alert severity="warning">This action CANNOT be undone. This will delete organization token permanently.</Alert>}
                                <Form.Group className="formBox" size="md" controlId="text">
                                        <Form.Label>Organization name</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField('organizationName', e.target.value)}
                                        isInvalid={!!errors.organizationName}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.organizationName}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="formBox" size="md" controlId="text">
                                        <Form.Label>Confirm organization name</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField('organizationNameConfirm', e.target.value)}
                                        isInvalid={!!errors.organizationNameConfirm}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.organizationNameConfirm}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                {deleteOrgTokenFailed && <Alert severity="error">{failedMessage}</Alert> }
                        </Form>
                </Modal.Body>
                <Modal.Footer className="two-button">
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleDeleteOrgToken}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="submit"
                                >
                                Delete
                                </Button>
                                </Row>
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleDeleteTokenClose}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </Button>
                        </Row>
                </Modal.Footer>
                </Modal>
                {getOrgtokensFailed && <Alert severity="error">{failedMessage}</Alert>}
                <Grid item xs={12} md={12} className="card-list" as={Col} style={{margin: "0 auto"}}>
                                <Typography variant="h6" className="text-center">
                                Organization Token List
                                </Typography>
                        <div>
                        <Row>
                                <Col>
                                {
                                (<IconButton
                                edge="end"
                                aria-label="add"
                                alt="create org token"
                                onClick={() => history.push("/owner/create-organization-token")}
                                style={{width: "10%", height: "auto", marginRight: "auto", marginLeft: 10, cursor:"pointer"}}
                                >
                                <AddIcon />
                                </IconButton>
                                )}
                                {
                                (<IconButton
                                edge="end"
                                aria-label="update"
                                alt="update org token"
                                onClick={() => history.push("/owner/update-organization-token")}
                                style={{width: "10%", height: "auto", marginRight: "auto", cursor:"pointer"}}
                                >
                                <CachedIcon />
                                </IconButton>
                                )}
                                </Col>
                                {/* <FormGroup as={Col}>
                                        <FormControlLabel
                                                style={{marginLeft: "auto"}}
                                                control={
                                                <Checkbox
                                                checked={secondary}
                                                onChange={(event) => setSecondary(event.target.checked)}
                                                />
                                                }
                                                label="role"
                                        />
                                </FormGroup> */}
                        </Row>
                        <List style={{position: "relative", overflow: "auto", maxHeight: "300px"}}>
                        {orgTokensList.map((item, i) => (
                                constructListItem(item.organizationName, item.isExpired, i)
                        ))}
                        </List>
                        </div>
                        </Grid>
                </div>
        );
}