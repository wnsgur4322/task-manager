import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthService from "../services/auth.services";
import "./Profile.css";
import { useHistory } from "react-router-dom";

export default function MemberProfile() {
        const endpoint_url = "/user-profiles/get-info/" + localStorage.getItem("SelectedMemberID");
        const JWTtoken = AuthService.getCurrentUsertoken();
        const history = useHistory();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [roles, setRoles] = useState([]);

        useEffect(() => {
                async function getMemberProfile() {

                        fetch(endpoint_url, {
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
                                
                                if(!res.ok || (AuthService.getCurrentUsertoken() === null)){
                                        console.log("something went wrong", res.status);
                                        const error = (data && data.message) || res.status;
                                        return Promise.reject(error);
                                } else{
                                        setProfileList([
                                                {label: 'organization', value: data.data.organizationName },
                                                {label: 'username', value: data.data.username },
                                                {label: 'first name', value: data.data.firstName },
                                                {label: 'last name', value: data.data.lastName },
                                                {label: 'email', value: data.data.email },
                                        
                                        ]);
                                        setRoles(data.data.roles);
                                        console.log(res.status, '[OK]');
                                                
                                }
                        })
                        .catch((err) => {
                                console.error("-- error:", err);
                                history.push("/403");
                        })
                        console.log("end fetch call");
                }
                const fetchData = async () => {
                        await getMemberProfile();
                     }
                   
                fetchData();
        }, []);
        
        const initialProfile = [
                {label: 'organization', value: "" },
                {label: 'username', value: "" },
                {label: 'first name', value: "" },
                {label: 'last name', value: "" },
                {label: 'email', value: "" },

        ]
        const [profilelist, setProfileList] = useState(initialProfile);
        

        const constructProfileItem = (label, value, i) => (
                <div className="row" key={i}>
                        <div className="col-sm-3">
                        <h6 className="mb-0">{label}</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                        {value}
                        </div>
                </div>
        );
        
        const setField = (field, value) => {
                setForm({
                        ...form,
                        [field]: value
                });
        // Check and see if errors exist, and remove them from the error object:
                if ( !!errors[field] ) setErrors({
                  ...errors,
                  [field]: null
                })
        }
		// form validation
        const findFormErrors = () => {
		const { firstName, lastName, email, username } = form
		const newErrors = {};
                var pattern = new RegExp(/^[0-9\b]+$/);

		if (firstName === '') newErrors.firstName = 'This field cannot be blank'

		if (lastName === '') newErrors.lastName = 'This field cannot be blank'

		if (email === '') newErrors.email = 'This field cannot be blank'

                if (username === '') newErrors.username = 'This field cannot be blank'

		return newErrors
	}

        function renderProfile() {
                return (
                        <div className="col-md-8">
                        <div className="card mb-4">
                                <div className="card-body">
                                {profilelist.map((item, i) => (
                                        constructProfileItem(item.label, item.value, i)
                                ))}
                                <div className="row">
                                        <div className="col-sm-3">
                                        <h6 className="mb-0">roles</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                        {roles.map((role) => {
                                                if (role === roles[roles.length-1]) {
                                                        return role
                                                } else {
                                                        return role +", "
                                                }
                                        })}
                                        </div>
                                </div>
                                </div>
                                
                        </div>
                                </div>

                );
        }


        return (
                <div className="Profile">
                        <div className="row gutters-sm">
                                <div className="col-md-4 mb-3">
                                <div className="card">
                                <div className="d-flex flex-column align-items-center text-center">
                                        <img src="https://img.icons8.com/ios-glyphs/240/000000/user-male-circle.png" alt="Admin" className="rounded-circle" width="150" />
                                        <div className="mt-3">
                                        <h4>{profilelist[2].value} {profilelist[3].value}</h4>
                                        <p className="text-secondary mb-1"></p>
                                </div>
                                </div>
                                </div>
                                </div>
                                {renderProfile()}
                        </div>
                </div>
        );
}