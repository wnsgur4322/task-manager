import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import FloatingLabel from "react-bootstrap-floating-label";
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import DatePicker from "react-datepicker";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import "react-datepicker/dist/react-datepicker.css";
import {
        List, ListItemAvatar, ListItem, 
        ListItemText, ListItemSecondaryAction, ListItemIcon,
        Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography
        } from '@material-ui/core';
import { useAppContext, useFailedMessageContext,
        useDateContext
        } from "../../libs/contextLib";
import ButtonLoader from "../../components/ButtonLoader";
import UserService from "../../services/user.services";
import AuthService from "../../services/auth.services";
import './MagicForm.css';

export default function Magicform() {
        const JWTtoken = AuthService.getCurrentUsertoken();
        const [ isLoading, setIsLoading ] = useState(false);
        const [getOrgFailed, setGetOrgFailed] = useState(false);
        const [orgRoles, setOrgRoles] = useState([]);
        const [errors, setErrors] = useState({});

        const [createFormFailed, setCreateFormFailed] = useState(false);
        const [createFormSuccess, setCreateFormSuccess] = useState(false);

        const [formOrder, setFormOrder] = useState(new Array);
        const [renderOrder, setRenderOrder] = useState(new Array);

         // form fields on & off
        const { failedMessage, setFailedMessage } = useFailedMessageContext();
        const [ addInputFieldOpen, setAddInputFieldOpen ] = useState(false);
        const [ addroleOptionOpen, setAddroleOptionOpen ] = useState(false);
        const [ form, setForm ] = useState({});
        const [inputTextLabels, setInputTextLabels] = useState(new Array);
        const [inputEmailLabels, setInputEmailLabels] = useState(new Array);
        const [selectWithOptionsLabels, setSelectWithOptionsLabels] = useState(new Array);
        const [inputDateLabels, setInputDateLabels] = useState(new Array);
        const [inputTimeLabels, setInputTimeLabels] = useState(new Array);
        const [inputTextareaLabels, setInputTextareaLabels] = useState(new Array);
        const [inputCheckBoxLabels, setInputCheckBoxLabels] = useState(new Array);

        const [loadOrgroles, setLoadOrgroles] = useState(false);

        const {datePick, setDatePick} = useDateContext();

        const [ labelName, setLabelName ] = useState("untitled");           // for modal

        const [inputTextBoxCounter, setInputTextBoxCounter] = useState(0);
        const [inputEmailBoxCounter, setInputEmailBoxCounter] = useState(0);
        const [selectOptionBoxCounter, setSelectOptionBoxCounter] = useState(0);
        const [inputDateBoxCounter, setInputDateBoxCounter] = useState(0);
        const [inputTimeBoxCounter, setInputTimeBoxCounter] = useState(0);
        const [inputTextareaCounter, setInputTextareaCounter] = useState(0);
        const [inputCheckBoxCounter, setInputCheckBoxCounter] = useState(0);

        const [undoable, setUndoable] = useState(false);
        const [redoable, setRedoable] = useState(false);

        const [redoArray, setRedoArray] = useState(new Array);
        const [redoLabels, setRedoLabels] = useState(new Array);
        const [redoFormorder, setRedoFormorder] = useState(new Array);

        const resetCreateForm = () => {
                setUndoable(false);
                setRedoable(false);
                setInputTextBoxCounter(0);
                setInputEmailBoxCounter(0);
                setInputDateBoxCounter(0);
                setInputTimeBoxCounter(0);
                setInputTextareaCounter(0);
                setInputCheckBoxCounter(0);
                setSelectOptionBoxCounter(0);
                setLabelName("untitled");
                setInputTextLabels(new Array);
                setInputEmailLabels(new Array);
                setSelectWithOptionsLabels(new Array);
                setInputDateLabels(new Array);
                setInputTimeLabels(new Array);
                setInputTextareaLabels(new Array);
                setInputCheckBoxLabels(new Array);
                setFormOrder(new Array);
                setRenderOrder(new Array);
                setRedoArray(new Array);
                setRedoLabels(new Array);
                setRedoFormorder(new Array);
        };

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

        useEffect(() => {
                const fetchData = async () => {
                        await getOrginfo();
                     }
                   
                fetchData();
        }, []);

        const handleAddInputTextOpen = () => {
                setLabelName("inputTextLabel");
                setAddInputFieldOpen(true);
        };

        const handleAddInputEmailOpen = () => {
                setLabelName("inputEmailLabel");
                setAddInputFieldOpen(true);
        };

        const handleSelectWithOptionsOpen = () => {
                setLabelName("inputSelectOptionLabel");
                setAddroleOptionOpen(true);  
        };

        const handleAddInputDateOpen = () => {
                setLabelName("inputDateLabel");
                setAddInputFieldOpen(true);
        }

        const handleAddInputTimeOpen = () => {
                setLabelName("inputTimeLabel");
                setAddInputFieldOpen(true);
        }
        
        const handleAddInputTextareaOpen = () => {
                setLabelName("inputTextareaLabel");
                setAddInputFieldOpen(true);
        }

        const handleAddInputCheckBoxOpen = () => {
                setLabelName("inputCheckLabel");
                setAddInputFieldOpen(true);
        }

        const handleAddroleOptionClose = () => {
                setErrors({
                        ...errors,
                        inputSelectOptionLabel: null,
                });
                setForm({
                        ...form,
                        inputSelectOptionLabel: null,
                });
                console.log("form", form);
                setOptionInputRender(new Array);
                setSelectOptionCounter(1);
                setLoadOrgroles(false);
                setAddroleOptionOpen(false);      
        }

        const handleAddInputFieldClose = () => {
                setErrors({
                        ...errors,
                        inputTextLabel: null,
                        inputEmailLabel: null,
                        inputDateLabel: null,
                        inputTimeLabel: null,
                        inputTextareaLabel: null,
                        inputCheckLabel: null
                });
                setForm({
                        ...form,
                        inputTextLabel: null,
                        inputEmailLabel: null,
                        inputDateLabel: null,
                        inputTimeLabel: null,
                        inputTextareaLabel: null,
                        inputCheckLabel: null
                })
                setAddInputFieldOpen(false);
        };

        const undo = (event) => {
                event.preventDefault();
                if (renderOrder.length > 0) {
                        const fieldType = formOrder[formOrder.length - 1].inputFieldType;
                        console.log(fieldType);
                        switch(fieldType) {
                                case 'inputText':
                                        redoLabels.push(inputTextLabels.pop());
                                        setInputTextBoxCounter(inputTextBoxCounter - 1);
                                        break
                                case 'textArea':
                                        redoLabels.push(inputTextareaLabels.pop());
                                        setInputTextareaCounter(inputTextareaCounter - 1);
                                        break
                                case 'inputEmail':
                                        redoLabels.push(inputEmailLabels.pop());
                                        setInputEmailBoxCounter(inputEmailBoxCounter - 1);
                                        break
                                case 'inputDate':
                                        redoLabels.push(inputDateLabels.pop());
                                        setInputDateBoxCounter(inputDateBoxCounter - 1);
                                        break
                                case 'inputTime':
                                        redoLabels.push(inputTimeLabels.pop());
                                        setInputTimeBoxCounter(inputTimeBoxCounter - 1);
                                        break
                                case 'inputCheckbox':
                                        redoLabels.push(inputCheckBoxLabels.pop());
                                        setInputCheckBoxCounter(inputCheckBoxCounter - 1); 
                                        break
                                case 'selectWithOptions':
                                        redoLabels.push(selectWithOptionsLabels.pop());
                                        setSelectOptionBoxCounter(selectOptionBoxCounter - 1);
                                        break
                        }
                        redoArray.push(renderOrder.pop());
                        redoFormorder.push(formOrder.pop());
                        setRedoable(true);

                        if (renderOrder.length === 0){
                                setUndoable(false);
                        }
                }
        };

        const redo = (event) => {
                event.preventDefault();
                if (redoArray.length > 0) {
                        const fieldType = redoFormorder[redoFormorder.length - 1].inputFieldType;
                        console.log(fieldType);
                        switch(fieldType) {
                                case 'inputText':
                                        inputTextLabels.push(redoLabels.pop());
                                        setInputTextBoxCounter(inputTextBoxCounter + 1);
                                        break
                                case 'textArea':
                                        inputTextareaLabels.push(redoLabels.pop());
                                        setInputTextareaCounter(inputTextareaCounter + 1);
                                        break
                                case 'inputEmail':
                                        inputEmailLabels.push(redoLabels.pop());
                                        setInputEmailBoxCounter(inputEmailBoxCounter + 1);
                                        break
                                case 'inputDate':
                                        inputDateLabels.push(redoLabels.pop());
                                        setInputDateBoxCounter(inputDateBoxCounter + 1);
                                        break
                                case 'inputTime':
                                        inputTimeLabels.push(redoLabels.pop());
                                        setInputTimeBoxCounter(inputTimeBoxCounter + 1);
                                        break
                                case 'inputCheckbox':
                                        inputCheckBoxLabels.push(redoLabels.pop());
                                        setInputCheckBoxCounter(inputCheckBoxCounter + 1); 
                                        break
                                case 'selectWithOptions':
                                        selectWithOptionsLabels.push(redoLabels.pop());
                                        setSelectOptionBoxCounter(selectOptionBoxCounter + 1);
                                        break
                        }
                        renderOrder.push(redoArray.pop());
                        formOrder.push(redoFormorder.pop());
                        setUndoable(true);

                        if (redoArray.length === 0) {
                                setRedoable(false);
                        }
                                
                }
        };

        const AddInputText = (event) => {
                event.preventDefault();
                const newErrors = findFormErrors_text();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        inputTextLabels.push(form.inputTextLabel);
                        console.log("inputTextLabels", inputTextLabels);
                        renderOrder.push(
                                <Grid item xs={6} key={inputTextLabels[inputTextBoxCounter]}>
                                        <Form.Group as={Col}
                                        className="formBox-multi" 
                                        controlId="inputText" 
                                        size="md" 
                                        >
                                                <Form.Label>{inputTextLabels[inputTextBoxCounter]}</Form.Label>
                                                <Form.Control.Feedback type='invalid'>
                                                {errors.inputTextLabel}
                                                </Form.Control.Feedback>
                                                <Form.Control
                                                type="text"
                                                />
                                        </Form.Group>
                                </Grid>
                        );
                        formOrder.push({fieldName: inputTextLabels[inputTextBoxCounter], inputFieldType: "inputText", width: 1 });
                        console.log(formOrder);
                        setInputTextBoxCounter(inputTextBoxCounter + 1);
                        setUndoable(true);
                        handleAddInputFieldClose();
                }
        };

        const AddInputEmail = (event) => {
                event.preventDefault();
                const newErrors = findFormErrors_email();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        inputEmailLabels.push(form.inputEmailLabel);
                        console.log("inputEmailLabels", inputEmailLabels);
                        renderOrder.push(
                                <Grid item xs={6} key={inputEmailLabels[inputEmailBoxCounter]}>                      
                                <Form.Group
                                className="formBox-single" 
                                size="md" 
                                controlId="inputEmail" 
                                >
                                <Form.Label>{inputEmailLabels[inputEmailBoxCounter]}</Form.Label>
                                <Form.Control
                                autoFocus
                                type="email"
                                onChange={(e) => setField("email", e.target.value)}
                                isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type='invalid' key={5}>
                                        {errors.email}
                                </Form.Control.Feedback>
                                </Form.Group>
                                </Grid>
                        );
                        formOrder.push({fieldName: inputEmailLabels[inputEmailBoxCounter], inputFieldType: "inputEmail", width: 1 });
                        console.log(formOrder);
                        setInputEmailBoxCounter(inputEmailBoxCounter + 1);
                        setUndoable(true);
                        handleAddInputFieldClose();
                }
        };
        
        const constructRoleOptions = (role, i) => (
                <option key={i} value={role} >{role}</option>
        );

        const AddSelectWithOptions = (event) => {
                event.preventDefault();
                const newErrors = findFormErrors_selectOption();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        selectWithOptionsLabels.push(form.inputSelectOptionLabel);
                        console.log("selectWithOptionsLabels", selectWithOptionsLabels);
                        renderOrder.push(
                                <Grid item xs={6} key={selectWithOptionsLabels[selectOptionBoxCounter]}>                     
                                <Form.Group 
                                className="formBox-single" 
                                size="md" 
                                controlId="selectWithOptions" 
                                >
                                <Form.Label>{selectWithOptionsLabels[selectOptionBoxCounter]}</Form.Label>
                                <Form.Control
                                                as="select"
                                                >
                                                <option value={null} >Choose one ...</option>
                                                
                                                {loadOrgroles? orgRoles.map((item, i) => (
                                                        constructRoleOptions(item, i)
                                                )) : options.map((item, i) => (
                                                        constructRoleOptions(form[item], i)
                                                ))}
                                </Form.Control>
                                </Form.Group>
                                </Grid>
                        );
                        if (loadOrgroles === false){
                                options.map((item, i) => (
                                        optionVals.push(form[item]? form[item] : ("empty " + i))
                                ));
                                console.log("optionVals:", optionVals);
                                
                        }
                        formOrder.push({fieldName: selectWithOptionsLabels[selectOptionBoxCounter], 
                                inputFieldType: "selectWithOptions", 
                                width: 1, 
                                dropdownOptions: loadOrgroles? orgRoles : optionVals });
                        console.log(formOrder);
                        setSelectOptionBoxCounter(selectOptionBoxCounter + 1);
                        setOptionInputRender(new Array);
                        setSelectOptionCounter(1);
                        setUndoable(true);
                        setOptions(new Array);
                        setOptionVals(new Array);
                        handleAddroleOptionClose();
                }
        };

        const AddInputDate = (event) => {
                event.preventDefault();
                const newErrors = findFormErrors_inputDate();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        inputDateLabels.push(form.inputDateLabel);
                        console.log("inputDateLabels", inputDateLabels);
                        renderOrder.push(
                                <Grid item xs={6} key={inputDateLabels[inputDateBoxCounter]}>                               
                                <Form.Group 
                                className="formBox-date" 
                                size="md" 
                                controlId="inputDate" 
                                >
                                <Form.Label>{inputDateLabels[inputDateBoxCounter]}</Form.Label>
                                <DatePicker
                                className="form-control"
                                selected={datePick}
                                onSelect={(date) => setDatePick(date)} //when day is clicked
                                onChange={(date) => setDatePick(date)} //only when value has changed
                                />
                                </Form.Group>
                                </Grid>
                        );
                        formOrder.push({fieldName: inputDateLabels[inputDateBoxCounter], inputFieldType: "inputDate", width: 1 });
                        console.log(formOrder);
                        setInputDateBoxCounter(inputDateBoxCounter + 1);
                        setUndoable(true);
                        handleAddInputFieldClose();
                }
        }

        const AddInputTime = (event) => {
                event.preventDefault();
                const newErrors = findFormErrors_inputTime();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        inputTimeLabels.push(form.inputTimeLabel);
                        console.log("inputDateLabels", inputTimeLabels);
                        renderOrder.push(
                                <Grid item xs={6} key={inputTimeLabels[inputTimeBoxCounter]}>                              
                                <Form.Group 
                                className="formBox-date" 
                                size="md" 
                                controlId="inputDate" 
                                >
                                <Form.Label>{inputTimeLabels[inputTimeBoxCounter]}</Form.Label>
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
                        formOrder.push({fieldName: inputTimeLabels[inputTimeBoxCounter], inputFieldType: "inputTime", width: 1 });
                        console.log(formOrder);
                        setInputTimeBoxCounter(inputTimeBoxCounter + 1);
                        setUndoable(true);
                        handleAddInputFieldClose();
                }
        }

        const AddTextArea = (event) => {
                event.preventDefault();
                const newErrors = findFormErrors_inputTextarea();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        inputTextareaLabels.push(form.inputTextareaLabel);
                        console.log("inputTextareaLabels", inputTextareaLabels);
                        renderOrder.push(
                                <Grid item xs={12} key={inputTextareaLabels[inputTextareaCounter]}>                               
                                <Form.Group 
                                        className="formBox-single" 
                                        size="md" 
                                        controlId="role" 
                                        >
                                        <Form.Label>{inputTextareaLabels[inputTextareaCounter]}</Form.Label>
                                        <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Leave a comment here"
                                        />
                                </Form.Group>
                                </Grid>
                        );
                        formOrder.push({fieldName: inputTextareaLabels[inputTextareaCounter], inputFieldType: "textArea", width: 2 });
                        console.log(formOrder);
                        setInputTextareaCounter(inputTextareaCounter + 1);
                        setUndoable(true);
                        handleAddInputFieldClose();
                }
        }

        const AddCheckbox = (event) => {
                event.preventDefault();
                const newErrors = findFormErrors_inputCheckbox();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        inputCheckBoxLabels.push(form.inputCheckLabel);
                        console.log("inputCheckBoxLabels", inputCheckBoxLabels);
                        renderOrder.push(
                                <Grid item xs={6} key={inputCheckBoxLabels[inputCheckBoxCounter]}>                              
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
                                        label={inputCheckBoxLabels[inputCheckBoxCounter]}
                                        />
                                </Form.Group>
                                </Grid>
                        );
                        formOrder.push({fieldName: inputCheckBoxLabels[inputCheckBoxCounter], inputFieldType: "inputCheckbox", width: 1 });
                        console.log(formOrder);
                        setInputCheckBoxCounter(inputCheckBoxCounter + 1);
                        setUndoable(true);
                        handleAddInputFieldClose();
                }
        }

        const [options, setOptions] = useState(new Array);
        const [optionVals, setOptionVals] = useState(new Array);
        const [selectOptionCounter, setSelectOptionCounter] = useState(1);
        const [optionInputRender, setOptionInputRender] = useState(new Array);

        const AddRoleOptionInput = (event) => {
                event.preventDefault();

                options.push("optionLabel" + selectOptionCounter);
                console.log(options);
                optionInputRender.push(
                        <Form.Group className="formBox" size="md" controlId="text" key={"optionLabel" + selectOptionCounter}>
                        <Form.Label>Option label {selectOptionCounter}</Form.Label>
                        <Form.Control
                        autoFocus
                        type="text"
                        defaultValue={"empty " + selectOptionCounter}
                        onChange={(e) => setField(("optionLabel" + selectOptionCounter), e.target.value)}
                        isInvalid={!!errors["optionLabel" + selectOptionCounter]}
                        />
                        <Form.Control.Feedback type='invalid'>
                                {errors["optionLabel" + selectOptionCounter]}
                        </Form.Control.Feedback>
                        </Form.Group>
                );
                setSelectOptionCounter(selectOptionCounter + 1);
                console.log(form);

        }


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

        const findFormErrors_text = () => {
                const { inputTextLabel } = form
                const newErrors = {};       

                if (!inputTextLabel || inputTextLabel === '') newErrors.inputTextLabel = 'This field cannot be blank'

                return newErrors
        }

        const findFormErrors_email = () => {
                const { inputEmailLabel } = form
                const newErrors = {};       

                if (!inputEmailLabel || inputEmailLabel === '') newErrors.inputTextLabel = 'This field cannot be blank'

                return newErrors
        }

        const findFormErrors_selectOption = () => {
                const { inputSelectOptionLabel } = form
                const newErrors = {};       

                if (!inputSelectOptionLabel || inputSelectOptionLabel === '') newErrors.inputSelectOptionLabel = 'This field cannot be blank'

                return newErrors
        }

        const findFormErrors_inputDate = () => {
                const { inputDateLabel } = form
                const newErrors = {};       

                if (!inputDateLabel || inputDateLabel === '') newErrors.inputDateLabel = 'This field cannot be blank'

                return newErrors
        }

        const findFormErrors_inputTime = () => {
                const { inputTimeLabel } = form
                const newErrors = {};       

                if (!inputTimeLabel || inputTimeLabel === '') newErrors.inputTimeLabel = 'This field cannot be blank'

                return newErrors
        }

        const findFormErrors_inputTextarea = () => {
                const { inputTextareaLabel } = form
                const newErrors = {};       

                if (!inputTextareaLabel || inputTextareaLabel === '') newErrors.inputTextareaLabel = 'This field cannot be blank'

                return newErrors
        }

        const findFormErrors_inputCheckbox = () => {
                const { inputCheckLabel } = form
                const newErrors = {};       

                if (!inputCheckLabel || inputCheckLabel === '') newErrors.inputCheckLabel = 'This field cannot be blank'

                return newErrors
        }

        function handleCreateForm(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;

                console.log(formOrder);
                console.log(inputTextLabels);

                fetch("/magic-form-templates/create", {
                                method: 'POST',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        magicFormName: form.magicFormName,
                                        description: form.magicFormDescription,
                                        fields: formOrder,  
                                        }),
                                        signal: signal
                })
                .then(async res => {
                                const data = await res.json();
                                console.log("-- data:", res);
                                console.log("-- res.status:", res.status);
                                setFailedMessage(data.message);
                                if(!res.ok){
                                        console.log("something went wrong", res.status);
                                        const error = (data && data.message) || res.status;
                                        setTimeout(controller.abort(), 3000);
                                        return Promise.reject(error);
                                } else{
                                        console.log("201 OK");
                                        await getOrginfo();
                                        resetCreateForm();
                                        setCreateFormFailed(false);
                                        setCreateFormSuccess(true);

                                }
                })
                .catch((err) => {
                                setCreateFormFailed(true);
                                setCreateFormSuccess(false);
                                console.error("-- error:", err);
                        })
                console.log("end fetch call");
        }

        return (
        <div className="Project">
                {getOrgFailed && <Alert severity="error">{failedMessage}</Alert>}
                {/* set field name modal */}
                <Modal
                key={0}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={addInputFieldOpen}
                onHide={handleAddInputFieldClose}
                onSubmit={event => event.preventDefault()}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        {"Create " + labelName.slice(5,labelName.length-5) + " Box"}
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form>
                                <Form.Group className="formBox" size="md" controlId="text">
                                        <Form.Label>Field label</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField(labelName, e.target.value)}
                                        isInvalid={!!errors[labelName]}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors[labelName]}
                                        </Form.Control.Feedback>
                                </Form.Group>
                        </Form>
                </Modal.Body>
                <Modal.Footer className="two-button">
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={(event) => {
                                        if(labelName === "inputTextLabel"){
                                                AddInputText(event);
                                        }
                                        if(labelName === "inputEmailLabel"){
                                                AddInputEmail(event);
                                        }
                                        if(labelName === 'inputDateLabel'){
                                                AddInputDate(event);
                                        }
                                        if(labelName === 'inputTimeLabel'){
                                                AddInputTime(event);
                                        }
                                        if(labelName === 'inputTextareaLabel'){
                                                AddTextArea(event);
                                        }
                                        if(labelName === 'inputCheckLabel'){
                                                AddCheckbox(event);
                                        }
                                }
                                }
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
                                onClick={handleAddInputFieldClose}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </Button>
                        </Row>
                </Modal.Footer>
                </Modal>
                {/* set form role names modal */}
                <Modal
                key={1}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={addroleOptionOpen}
                onHide={handleAddroleOptionClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        {"Create " + labelName.slice(5,labelName.length-5) + " Box"}
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form>
                                <Form.Group className="formBox" size="md" controlId="text">
                                        <Form.Label>Field label</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField(labelName, e.target.value)}
                                        isInvalid={!!errors[labelName]}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors[labelName]}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                <FormGroup >
                                        <FormControlLabel
                                                style={{margin: "0 auto"}}
                                                control={
                                                <Checkbox
                                                checked={loadOrgroles}
                                                onChange={(event) => setLoadOrgroles(event.target.checked)}
                                                />
                                                }
                                                label="load organization roles?"
                                                labelPlacement="start"
                                        />
                                </FormGroup>
                                {optionInputRender.map((component) => (component))}
                                <FormGroup >
                                <IconButton
                                                disabled={loadOrgroles}
                                                edge="end"
                                                aria-label="addOption"
                                                onClick={AddRoleOptionInput}
                                                style={{margin: "0 auto"}}
                                                type="add"
                                                >
                                                <AddCircleIcon />
                                </IconButton>
                                </FormGroup> 
                        </Form>
                </Modal.Body>
                <Modal.Footer className="two-button">
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={AddSelectWithOptions}
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
                                onClick={handleAddroleOptionClose}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </Button>
                        </Row>
                </Modal.Footer>
                </Modal>
                <Row>
                        <div className="card-org" as={Col}>
                                <div className="d-flex flex-column align-items-center" style={{paddingBottom: "10px"}}>
                                        <div className="mt-3" style={{width:"90%"}}>
                                        <h4 className="text-center">Magic Form Preview</h4>
                                        <div className="form-line">
                                        <Form style={{backgroundColor: "#f9a825", margin: "0 auto", borderRadius: ".5rem", paddingBottom: "10px"}}>
                                                <div style={{borderBottom: "solid black 1px"}}>
                                                <Form.Group controlId="magicFormName" style={{width: "30%", margin: "0 auto", paddingTop:"10px"}} size="md">
                                                <FloatingLabel
                                                label="Form Title"
                                                type="text"
                                                onChange={(e) => setField("magicFormName", e.target.value)}
                                                />
                                                </Form.Group>
                                                <Form.Group controlId="FormDescription" style={{width: "50%", margin: "0 auto", paddingTop:"10px", marginBottom: "10px"}} size="md">
                                                <FloatingLabel
                                                label="Form Description"
                                                as="textarea"
                                                type="text"
                                                onChange={(e) => setField("magicFormDescription", e.target.value)}
                                                />
                                                </Form.Group>
                                                </div>
                                                <Row>
                                                <IconButton
                                                disabled={!undoable}
                                                edge="end"
                                                aria-label="add"
                                                onClick={(e) => undo(e)}
                                                as={Col} 
                                                style={{width: "auto", height: "auto", margin: "0 auto", cursor:"pointer", color: undoable? "black" : null}}
                                                >
                                                <UndoIcon />
                                                </IconButton>
                                                <IconButton
                                                disabled={!redoable}
                                                edge="end"
                                                aria-label="add"
                                                onClick={(e) => redo(e)}
                                                as={Col} 
                                                style={{width: "auto", height: "auto", margin: "0 auto", cursor:"pointer", color: redoable? "black" : null}}
                                                >
                                                <RedoIcon />
                                                </IconButton>
                                                </Row>
                                                <Grid
                                                container
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                                wrap="wrap"
                                                >
                                                {renderOrder.map((component) => (component))}
                                                </Grid>
                                                {/* <Form.Group className="formBox-single" size="md" controlId="file" key={8}>
                                                <Form.Label>Upload note as PDF</Form.Label>
                                                <Form.Control
                                                className="form-control"
                                                autoFocus
                                                style={{height: "100%", padding:"0"}}
                                                accept="application/pdf"
                                                type="file"
                                                name="file"
                                                size="md" />
                                                </Form.Group> */}
                                                {createFormSuccess && <Alert severity="info" style={{marginTop: "10px"}}>{failedMessage}</Alert> }
                                                {createFormFailed && <Alert severity="error" style={{marginTop: "10px"}}>{failedMessage}</Alert> }
                                                <Form.Group className="two-button" size="lg" controlId="buttons" key={11} style={{width: "30%", margin: "0 auto", marginTop: "10px"}}>
                                                <ButtonLoader
                                                block
                                                className="custom-btn"
                                                size="md"
                                                type="create"
                                                isLoading={isLoading}
                                                onClick={handleCreateForm}
                                                >
                                                Create
                                                </ButtonLoader>
                                                </Form.Group>
                                        </Form>
                                        </div>
                                        </div>
                                </div>
                        </div>
                        <Grid item xs={12} md={4} className="card-list" as={Col}>
                                <Typography variant="h6" className="text-center">
                                Form Format List
                                </Typography>
                        <div>
                        <Row style={{marginBottom: "10px"}}>
                                <Col>
                                </Col>
                                <FormGroup as={Col}>
                                </FormGroup>
                        </Row>
                        <List style={{position: "relative", overflow: "auto", maxHeight: "300px"}}>
                        <ListItem key={0} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemText
                                        style={{textAlign: "center", maxWidth: "30%"}}
                                        primary={inputTextLabels.length}
                        />  
                        <IconButton
                        disabled 
                        key={0} 
                        style={{paddingBottom: "0px", paddingTop: "0px"}}
                        >
                                        <ListItemText
                                        style={{textAlign: "center", color: "black"}}
                                        primary="Text box"
                                        />
                        </IconButton>
                        <ListItemSecondaryAction>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={handleAddInputTextOpen}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <AddIcon />
                                </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={1} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemText
                                        style={{textAlign: "center", maxWidth: "30%"}}
                                        primary={inputEmailLabels.length}
                        />   
                        <IconButton
                        disabled
                        key={1} 
                        style={{paddingBottom: "0px", paddingTop: "0px"}}
                        >
                                        <ListItemText
                                        style={{textAlign: "center", color: "black"}}
                                        primary="Email box"
                                        />
                        </IconButton>
                        <ListItemSecondaryAction>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={handleAddInputEmailOpen}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <AddIcon />
                                </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={2} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemText
                                        style={{textAlign: "center", maxWidth: "30%"}}
                                        primary={selectWithOptionsLabels.length}
                        />     
                        <IconButton
                        disabled 
                        key={2} 
                        style={{paddingBottom: "0px", paddingTop: "0px"}}
                        >
                                        <ListItemText
                                        style={{textAlign: "center", color: "black"}}
                                        primary="Select option box"
                                        />
                        </IconButton>
                        <ListItemSecondaryAction>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={handleSelectWithOptionsOpen}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <AddIcon />
                                </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={3} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemText
                                        style={{textAlign: "center", maxWidth: "30%"}}
                                        primary={inputDateLabels.length}
                        />       
                        <IconButton
                        disabled 
                        key={3} 
                        style={{paddingBottom: "0px", paddingTop: "0px"}}
                        >
                                        <ListItemText
                                        style={{textAlign: "center", color: "black"}}
                                        primary="Date box"
                                        />
                        </IconButton>
                        <ListItemSecondaryAction>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={handleAddInputDateOpen}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <AddIcon />
                                </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={4} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemText
                                        style={{textAlign: "center", maxWidth: "30%"}}
                                        primary={inputTimeLabels.length}
                        />          
                        <IconButton
                        disabled 
                        key={4} 
                        style={{paddingBottom: "0px", paddingTop: "0px"}}
                        >
                                        <ListItemText
                                        style={{textAlign: "center", color: "black"}}
                                        primary="Time box"
                                        />
                        </IconButton>
                        <ListItemSecondaryAction>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={handleAddInputTimeOpen}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <AddIcon />
                                </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={5} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemText
                                        style={{textAlign: "center", maxWidth: "30%"}}
                                        primary={inputTextareaLabels.length}
                        />   
                        <IconButton
                        disabled
                        key={5} 
                        style={{paddingBottom: "0px", paddingTop: "0px"}}
                        >
                                        <ListItemText
                                        style={{textAlign: "center", color: "black"}}
                                        primary="Text area box"
                                        />
                        </IconButton>
                        <ListItemSecondaryAction>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={handleAddInputTextareaOpen}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <AddIcon />
                                </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={6} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemText
                                        style={{textAlign: "center", maxWidth: "30%"}}
                                        primary={inputCheckBoxLabels.length}
                        />          
                        <IconButton
                        disabled 
                        key={6} 
                        style={{paddingBottom: "0px", paddingTop: "0px"}}
                        >
                                        <ListItemText
                                        style={{textAlign: "center", color: "black"}}
                                        primary="Check box"
                                        />
                        </IconButton>
                        <ListItemSecondaryAction>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={handleAddInputCheckBoxOpen}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <AddIcon />
                                </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                        </List>
                        </div>
                        </Grid>
                </Row>
        </div>
        );
}