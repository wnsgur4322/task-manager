import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import { useFailedMessageContext, useRoleOptionOnContext } from "../../../libs/contextLib";
import UserService from "../../../services/user.services";
import '../MagicForm.css';


export default function RoleOptionBox() {
        const [orgRoles, setOrgRoles] = useState([]);
        const [getOrgFailed, setGetOrgFailed] = useState(false);

        const { failedMessage, setFailedMessage } = useFailedMessageContext();
        const { roleOptionOn, setRoleOptionOn } = useRoleOptionOnContext();

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

        const constructRoleOptions = (role, i) => (
                <option key={i} value={role} >{role}</option>
        );

        return (
                        (roleOptionOn &&
                        <Form.Group className="formBox-single" size="md" controlId="role" key={3}>
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                                as="select"
                                                >
                                                <option value={null} >Choose one ...</option>
                                                {orgRoles.map((item, i) => (
                                                        constructRoleOptions(item, i)
                                                ))}
                                </Form.Control>
                        </Form.Group>)
        );
}