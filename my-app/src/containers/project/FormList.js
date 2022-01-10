import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown, Spinner } from "react-bootstrap";
import FloatingLabel from "react-bootstrap-floating-label";
import Alert from '@material-ui/lab/Alert';
import DatePicker from "react-datepicker";
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import "react-datepicker/dist/react-datepicker.css";
import {
        List, ListItemAvatar, ListItem, Select, Chip, MenuItem, Input,
        ListItemText, ListItemSecondaryAction, ListItemIcon,
        Avatar, IconButton, FormGroup, FormControlLabel, Checkbox, FormControl,
        Grid, Typography
        } from '@material-ui/core';
import { useAppContext, useFailedMessageContext
        } from "../../libs/contextLib";
import ButtonLoader from "../../components/ButtonLoader";
import UserService from "../../services/user.services";
import AuthService from "../../services/auth.services";
import './MagicForm.css';

export default function MagicformList() {
        const JWTtoken = AuthService.getCurrentUsertoken();
        const [ isLoading, setIsLoading ] = useState(false);
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [getOrgFailed, setGetOrgFailed] = useState(false);
        const [orgRoles, setOrgRoles] = useState([]);
        const [retrieveFailed, setRetrieveFailed] = useState();
        const [formList, setFormList] = useState(new Array);
        const [previewOpen, setPreviewOpen] = useState(false);
        const [previewFailed, setPreviewFailed] = useState(false);
        const [whichForm, setWhichForm] = useState(new Array);
        const [selectedFormName, setSelectedFormName] = useState("");
        const [renderOrder, setRenderOrder] = useState(new Array);
        const [deleteFormFailed, setDeleteFormFailed] = useState(false);
        const [deleteFormOpen, setDeleteFormOpen] = useState(false);
        const [datePick, setDatePick] = useState(new Date());
        const [emailFormOpen, setEmailFormOpen] = useState(false);
        const [emailFormOption, setEmailFormOption] = useState("");
        const [rolebaseFailed, setRolebaseFailed] = useState(false);
        const [rolebaseSuccess, setRolebaseSuccess] = useState(false);
        const [emailListbaseFailed, setEmailListbaseFailed] = useState(false);
        const [emailListbaseSuccess, setEmailListbaseSuccess] = useState(false);
        const [emailNotificationFailed, setEmailNotificationFailed] = useState(false);
        const [emailNotificationSuccess, setEmailNotificationSuccess] = useState(false);
        const [emailList, setEmailList] = useState(new Array);

        const { failedMessage, setFailedMessage } = useFailedMessageContext();

        async function getOrginfo() {
                console.log("getOrg start")

                fetch("/organizations/get-account-info/" + UserService.getOrgname(), {
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
                        setGetOrgFailed(false);
                        if(!res.ok){
                                setFailedMessage(data.message);
                                console.log("something went wrong", res.status);
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                        } else{
                                setOrgRoles(data.data.roles);
                                console.log("data.data.roles", data.data.roles);
                                console.log(res.status, '[OK]');
                                        
                        }
                })
                .catch((err) => {
                        setGetOrgFailed(true);
                        console.error("-- error:", err);
                })
                console.log("end fetch call");
        }

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

        async function retrieveForms() {
                fetch("/magic-form-templates/retrieve-all", {
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
                                setFormList(data.data);
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
                        await retrieveForms();
                        await getOrginfo();
                        await retrieveEmailList();
                     }
                   
                fetchData();
        }, []);

        const handleDeleteFormOpen = () => {
                setDeleteFormOpen(true);
        };

        const handleDeleteFormClose = () => {
                setErrors({
                        ...errors,
                        magicFormName: null,
                        magicFormNameConfirm: null,
                });
                setForm({
                        ...form,
                        magicFormName: null,
                        magicFormNameConfirm: null,
                })
                setDeleteFormFailed(false);
                setDeleteFormOpen(false);
        };

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
                const { magicFormName, magicFormNameConfirm  } = form
                const newErrors = {};       

                if (!magicFormName || magicFormName === '') newErrors.magicFormName = 'This field cannot be blank'

                if (! magicFormName ||  magicFormName === '' ||  magicFormName !==  magicFormNameConfirm ) newErrors.magicFormNameConfirm = ' both magicform title fields should be matched'



                return newErrors
        }

        function timeout(delay) {
                return new Promise( res => setTimeout(res, delay) );
        }

        const constructRoleOptions = (role, i) => (
                <option key={i} value={role} >{role}</option>
        );

        const handlePreviewOpen = async (selectedForm) => {
                setIsLoading(true);
                setSelectedFormName(selectedForm.magicFormName);
                console.log("which form?", selectedForm);

                      
                selectedForm.fields.map((field) => {
                        console.log("field", field);
                        switch(field.inputFieldType) {
                                case 'inputText':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field.order}>
                                                        <Form.Group as={Col}
                                                        className="formBox-multi" 
                                                        controlId="inputText" 
                                                        size="md" 
                                                        >
                                                                <Form.Label>{field.fieldName}</Form.Label>
                                                                <Form.Control
                                                                autoFocus
                                                                type="text"
                                                                />
                                                        </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'textArea':
                                        renderOrder.push(
                                                <Grid item xs={12} key={field.order}>                               
                                                <Form.Group 
                                                        className="formBox-single" 
                                                        size="md" 
                                                        controlId="role" 
                                                        >
                                                        <Form.Label>{field.fieldName}</Form.Label>
                                                        <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="Leave a comment here"
                                                        />
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'inputEmail':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field.order}>                      
                                                <Form.Group
                                                className="formBox-single" 
                                                size="md" 
                                                controlId="inputEmail" 
                                                >
                                                <Form.Label>{field.fieldName}</Form.Label>
                                                <Form.Control
                                                autoFocus
                                                type="email"
                                                onChange={(e) => setField("email", e.target.value)}
                                                />
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'inputDate':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field.order}>                               
                                                <Form.Group 
                                                className="formBox-date" 
                                                size="md" 
                                                controlId="inputDate" 
                                                >
                                                <Form.Label>{field.fieldName}</Form.Label>
                                                <DatePicker
                                                className="form-control"
                                                selected={datePick}
                                                onSelect={(date) => setDatePick(date)} //when day is clicked
                                                onChange={(date) => setDatePick(date)} //only when value has changed
                                                />
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'inputTime':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field.order}>                              
                                                <Form.Group 
                                                className="formBox-date" 
                                                size="md" 
                                                controlId="inputDate" 
                                                >
                                                <Form.Label>{field.fieldName}</Form.Label>
                                                <DatePicker
                                                className="form-control"
                                                selected={datePick}
                                                onChange={(time) => setDatePick(time)}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                                />
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'inputCheckbox':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field.order}>                              
                                                <Form.Group 
                                                        className="formBox-single" 
                                                        size="md" 
                                                        controlId="inputCheckbox" 
                                                        >
                                                        <Form.Check
                                                        className="text-center"
                                                        style={{margin: "0 auto", marginTop: "10px"}} 
                                                        type="checkbox"
                                                        id="default-checkbox"
                                                        label={field.fieldName}
                                                        />
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                                case 'selectWithOptions':
                                        renderOrder.push(
                                                <Grid item xs={6} key={field.order}>                     
                                                <Form.Group 
                                                className="formBox-single" 
                                                size="md" 
                                                controlId="selectWithOptions" 
                                                >
                                                <Form.Label>{field.fieldName}</Form.Label>
                                                <Form.Control
                                                                as="select"
                                                                >
                                                                <option value={null} >Choose one ...</option>
                                                                {field.dropdownOptions.map((item, i) => (
                                                                        constructRoleOptions(item, i)
                                                                ))}
                                                </Form.Control>
                                                </Form.Group>
                                                </Grid>
                                        );
                                        break
                        }
                });
                console.log("renderOrder", renderOrder);
                setPreviewOpen(true);
                await timeout(2000);
                setIsLoading(false);
        };

        const handlePreviewClose = () => {
                setRenderOrder(new Array);
                setPreviewOpen(false);
        };

        const handleEmailFormOpen = (event) => {
                event.preventDefault();
                setEmailFormOpen(true);
                handlePreviewClose();
                

        };

        const handleEmailFormClose = () => {
                setSelectedRoles([]);
                setEmailFormOption("");
                setEmailFormOpen(false);
                

        };

        const handleRolebaseOpen = () => {
                setRolebaseSuccess(false);
                setRolebaseFailed(false);
                setEmailFormOption("rolebase");
        };

        const handleEmailbaseOpen = () => {
                setEmailListbaseSuccess(false);
                setEmailListbaseFailed(false);
                setEmailFormOption("emailListbase");
        };

        const handleEmailNotificationOpen = () => {
                setEmailNotificationSuccess(false);
                setEmailNotificationFailed(false);
                setEmailFormOption("emailNotification");
        };

        function handleDeleteForm(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;

                const newErrors = findFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch("/magic-form-templates/delete-one", {
                                        method: 'DELETE',
                                        port: 3080,
                                        headers: { 
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${JWTtoken}`  
                                        },
                                        body: JSON.stringify({
                                                magicFormName: form.magicFormName,
                                                magicFormNameConfirm: form.magicFormNameConfirm,
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
                                                retrieveForms();
                                                handleDeleteFormClose();

                                        }
                        })
                        .catch((err) => {
                                        setDeleteFormFailed(true);
                                        console.error("-- error:", err);
                                })
                        console.log("end fetch call");
                }
        }

        const constructListItem = (magicFormName, description, i) => (
                <Row key={"row-" + (i + 1)}>
                <ListItem
                as={Col} 
                key={i + 1} 
                style={{paddingBottom: "0px", paddingTop: "0px", height: "auto",
                margin: "0 auto", borderBottom: "solid gainsboro 1px", 
                display: "flex", flexDirection: 'row'}}
                alignItems="center"
                >
                <Row>   
                <IconButton
                as={Col}
                key={"listbutton1-" + i} 
                style={{paddingBottom: "0px", paddingTop: "0px", width: "40%"}}
                onClick={() => handlePreviewOpen(formList[i])}
                >
                        <ListItemText
                                style={{textAlign: "center", color: "black"}}
                                primary={magicFormName}
                        >        
                        </ListItemText>
                </IconButton>
                <ListItemSecondaryAction as={Col} style={{width: "50%"}}>
                        <Typography 
                        variant="body2" 
                        className="text-center" 
                        color="textSecondary" 
                        align="center" 
                        style={{overflowY: "auto", overflowX: "hidden", width: "50%", margin: "0 auto"}}>
                                {description? description : "No description for this form"}
                        </Typography>
                </ListItemSecondaryAction>
                </Row>
                <IconButton
                as={Col}
                key={"listbutton2-" + i} 
                onClick={handleDeleteFormOpen}
                >
                        <DeleteIcon/>
                </IconButton>
                </ListItem>
                </Row>
        );

        function renderForm() {
                if (isLoading === true){
                        return (
                                <Row style={{textAlign: "center", margin: "0 auto"}}>
                                <Spinner animation="border" role="status" style={{textAlign: "center", margin: "0 auto"}}>
                                </Spinner>
                                </Row>
                        );
                } else {
                        return (
                                <div className="form-line">
                                <Form style={{backgroundColor: "#f9a825", margin: "0 auto", borderRadius: ".5rem", paddingBottom: "10px"}}>
                                        <h4 className="text-center">{selectedFormName}</h4>
                                        <Grid
                                                container
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                                wrap="wrap"
                                                >
                                                {renderOrder.map((component) => (component))}
                                        </Grid>
                                        {/* <Form.Group className="two-button" size="lg" controlId="buttons" key={11} style={{width: "30%", margin: "0 auto", marginTop: "10px"}}>
                                        <ButtonLoader
                                        block
                                        className="custom-btn"
                                        size="md"
                                        type="create"
                                        isLoading={isLoading}
                                        onClick={handleCreateForm}
                                        >
                                        Cancel
                                        </ButtonLoader>
                                        </Form.Group> */}
                                {previewFailed && <Alert severity="error">{failedMessage}</Alert> }
                                </Form>
                                </div>
                        );
                }
        }

        const [selectedRoles, setSelectedRoles] = useState([]);

        function renderEmailFormOptions() {
                let component;
                switch(emailFormOption) {
                        case 'rolebase':
                                component =                           
                                        (                
                                        <Form>      
                                                <Form.Group className="formBox" size="md" controlId="text">
                                                <Form.Label>Select roles to send the form</Form.Label>
                                                <Row>
                                                <FormControl
                                                >
                                                <Select
                                                labelId="demo-mutiple-chip-label"
                                                id="role-mutiple-chip"
                                                style={{width: "100%"}}
                                                multiple
                                                value={selectedRoles}
                                                onChange={(e) => setSelectedRoles(e.target.value)}
                                                input={<Input id="select-multiple-chip" />}
                                                renderValue={(selected) => (
                                                <div style={{margin: "0 auto", display: "flex", flexWrap: "wrap"}}>
                                                {selected.map((value) => (
                                                        <Chip key={value} label={value} style={{marginLeft: "5px", marginTop: "10px"}} />
                                                ))}
                                                </div>
                                                )}
                                                >
                                                {orgRoles.map((role) => (
                                                <MenuItem key={role} value={role}>
                                                {role}
                                                </MenuItem>
                                                ))}
                                                </Select>
                                                </FormControl>
                                                </Row>
                                                </Form.Group>
                                                {rolebaseSuccess && <Alert severity="info" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                {rolebaseFailed && <Alert severity="error" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                <Form.Group className="two-button" style={{marginTop: '10px'}}>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={()=> console.log("onclicked!")}
                                                        className="custom-btn-profile" 
                                                        block size="md" 
                                                        type="submit"
                                                        >
                                                        Send
                                                        </Button>
                                                        </Row>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={handleEmailFormClose}
                                                        className="custom-btn-profile" 
                                                        block size="md" 
                                                        type="button"
                                                        >
                                                        Cancel
                                                        </Button>
                                                </Row>
                                                </Form.Group>
                                        </Form>
                                )
                        break
                        case 'emailListbase':
                                component =
                                        (
                                        <Form>      
                                                <Form.Group className="formBox" size="md" controlId="text">
                                                <Form.Label>Send the form to selected email list</Form.Label>
                                                <Form.Control
                                                as="select"
                                                onChange={(e) => setField('emailListbase', e.target.value)}
                                                >
                                                <option value={null} >Choose one ...</option>
                                                {emailList.map((item, i) => (
                                                        constructRoleOptions(item.emailListName, i)
                                                ))}
                                                </Form.Control>
                                                </Form.Group>
                                                {emailListbaseSuccess && <Alert severity="info" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                {emailListbaseFailed && <Alert severity="error" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                <Form.Group className="two-button" style={{marginTop: '10px'}}>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={()=> console.log("onclicked!")}
                                                        className="custom-btn-profile" 
                                                        block size="md" 
                                                        type="submit"
                                                        >
                                                        Send
                                                        </Button>
                                                        </Row>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={handleEmailFormClose}
                                                        className="custom-btn-profile" 
                                                        block size="md" 
                                                        type="button"
                                                        >
                                                        Cancel
                                                        </Button>
                                                </Row>
                                                </Form.Group>
                                        </Form>
                                )
                        break
                        case 'emailNotification':
                                component =
                                        (
                                        <Form>      
                                                <Form.Group className="formBox" size="md" controlId="text">
                                                <Form.Label>Add email list to set notifications </Form.Label>
                                                <Form.Control
                                                as="select"
                                                onChange={(e) => setField('emailNotification', e.target.value)}
                                                >
                                                <option value={null} >Choose one ...</option>
                                                {emailList.map((item, i) => (
                                                        constructRoleOptions(item.emailListName, i)
                                                ))}
                                                </Form.Control>
                                                </Form.Group>
                                                {emailNotificationSuccess && <Alert severity="info" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                {emailNotificationFailed && <Alert severity="error" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                <Form.Group className="two-button" style={{marginTop: '10px'}}>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={()=> console.log("onclicked!")}
                                                        className="custom-btn-profile" 
                                                        block size="md" 
                                                        type="submit"
                                                        >
                                                        Send
                                                        </Button>
                                                        </Row>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={handleEmailFormClose}
                                                        className="custom-btn-profile" 
                                                        block size="md" 
                                                        type="button"
                                                        >
                                                        Cancel
                                                        </Button>
                                                </Row>
                                                </Form.Group>
                                        </Form>
                                )
                        break
                }
                return component;
        }

        return (
                <div className="Project">
                {retrieveFailed && <Alert severity="error">{failedMessage}</Alert> }
                {getOrgFailed && <Alert severity="error">{failedMessage}</Alert> }
                {/* selected form preview modal */}
                <Modal
                key={0}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={previewOpen}
                onHide={handlePreviewClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Magicform Preview
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        {renderForm()}
                </Modal.Body>
                <Modal.Footer className="two-button">
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleEmailFormOpen}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="submit"
                                >
                                Email form
                                </Button>
                                </Row>
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handlePreviewClose}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Publish online
                                </Button>
                        </Row>
                </Modal.Footer>
                </Modal>
                {/* delete form modal */}
                <Modal
                key={1}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={deleteFormOpen}
                onHide={handleDeleteFormClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Delete Magicform
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form>
                                <Form.Group className="formBox" size="md" controlId="text">
                                        <Form.Label>Magicform title</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField('magicFormName', e.target.value)}
                                        isInvalid={!!errors.magicFormName}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.magicFormName}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="formBox" size="md" controlId="text">
                                        <Form.Label>Confirm magicform title</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField('magicFormNameConfirm', e.target.value)}
                                        isInvalid={!!errors.magicFormNameConfirm}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.magicFormNameConfirm}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                {deleteFormFailed && <Alert severity="error">{failedMessage}</Alert> }
                        </Form>
                </Modal.Body>
                <Modal.Footer className="two-button">
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleDeleteForm}
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
                                onClick={handleDeleteFormClose}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </Button>
                        </Row>
                </Modal.Footer>
                </Modal>

                {/* email form option modal */}
                <Modal
                key={2}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={emailFormOpen}
                onHide={handleEmailFormClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        email options for '{selectedFormName}'
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid" style={{padding: '0'}}>
                <Container style={{padding: '0'}}>
                        <Row>
                                <Col xs={6} md={3} className="button-group" style={{width: '100%'}}>
                                <ButtonGroup
                                vertical
                                color="default"
                                //aria-label="vertical contained primary button group"
                                variant="text"
                                style={{padding: '0', width: '100%', height: '100%'}}
                                >
                                        <Button variant="outline-secondary" className="button-menu" onClick={handleRolebaseOpen} >send to organization roles</Button>
                                        <Button variant="outline-secondary" className="button-menu" onClick={handleEmailbaseOpen} >send to email list</Button>
                                        <Button variant="outline-secondary" className="button-menu" onClick={handleEmailNotificationOpen} >add notifications to email list</Button>
                                </ButtonGroup>
                                </Col>
                                <Col xs={12} md={9} >
                                        {renderEmailFormOptions()}
                                </Col>
                        </Row>
                </Container>
                </Modal.Body>
                <Modal.Footer className="two-button">
                </Modal.Footer>
                </Modal>

                <Grid item xs={12} className="form-list" as={Col} style={{margin: "0 auto"}}>
                                <Typography variant="h6" className="text-center">
                                Magic Form List
                                </Typography>
                                
                                <div>
                                <Row style={{marginBottom: "10px"}}>
                                <Col>
                                </Col>
                                <FormGroup as={Col}>
                                </FormGroup>
                                </Row>
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
                                        key={"iconButton0"} 
                                        style={{paddingBottom: "0px", paddingTop: "0px", width: "40%"}}
                                        >
                                        <Typography variant="h6" className="text-center" style={{color: "black", marginRight: "15px"}}>
                                        Form Title
                                        </Typography>
                                                        
                                        
                                        </IconButton>
                                        <ListItemSecondaryAction as={Col} style={{width: "50%", color: "black"}}>
                                                <Typography variant="h6" className="text-center" style={{color: "black"}}>
                                                Description
                                                </Typography>
                                        </ListItemSecondaryAction>
                                        </Row>
                                        </ListItem>
                                        {formList.map((item, i) => (
                                                constructListItem(item.magicFormName, item.description, i)
                                        ))}
                                </List>
                                </div>
                        </Grid>
                
                </div>
        
        );
}