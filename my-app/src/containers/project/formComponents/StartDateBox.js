import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useStartFieldOnContext } from "../../../libs/contextLib";
import '../MagicForm.css';

export default function StartDateBox() {
        const [startTime, setStartTime] = useState(new Date());

        const [startDate, setStartDate] = useState(new Date());
        const [endDate, setEndDate] = useState(new Date());
        const { startFieldOn, setStartFieldOn } = useStartFieldOnContext();


        return (
                        (startFieldOn &&
                                <Row className="mb-3">
                                <Form.Group className="formBox-date" size="md" controlId="role" key={4}>
                                <Form.Label>Start Date</Form.Label>
                                <DatePicker
                                className="form-control"
                                selected={startDate}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                onSelect={(date) => setStartDate(date)} //when day is clicked
                                onChange={(date) => setStartDate(date)} //only when value has changed
                                />
                                </Form.Group>
                                <Form.Group className="formBox-date" size="md" controlId="role" key={5}>
                                <Form.Label>Start Time</Form.Label>
                                <DatePicker
                                className="form-control"
                                selected={startTime}
                                onChange={(date) => setStartTime(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                />
                                </Form.Group>
                                </Row>)
        );
}