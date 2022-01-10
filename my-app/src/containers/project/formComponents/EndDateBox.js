import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEndFieldOnContext } from "../../../libs/contextLib";
import '../MagicForm.css';

export default function EndDateBox() {
        const [endTime, setEndTime] = useState(new Date());

        const [startDate, setStartDate] = useState(new Date());
        const [endDate, setEndDate] = useState(new Date());
        const { endFieldOn, setEndFieldOn } = useEndFieldOnContext();


        return (
                        (endFieldOn &&
                                <Row className="mb-3">
                                <Form.Group className="formBox-date" size="md" controlId="role" key={6}>
                                <Form.Label>End Date</Form.Label>
                                <DatePicker
                                className="form-control"
                                selected={endDate}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                onSelect={(date) => setEndDate(date)} //when day is clicked
                                onChange={(date) => setEndDate(date)} //only when value has changed
                                />
                                </Form.Group>
                                <Form.Group className="formBox-date" size="md" controlId="role" key={7}>
                                <Form.Label>End Time</Form.Label>
                                <DatePicker
                                className="form-control"
                                selected={endTime}
                                onChange={(date) => setEndTime(date)}
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