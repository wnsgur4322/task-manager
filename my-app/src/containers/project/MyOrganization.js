import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, Button, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import Alert from '@material-ui/lab/Alert';
import {
        List, ListItemAvatar, ListItem, 
        ListItemText, ListItemSecondaryAction, ListItemIcon,
        Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography
        } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import SettingsIcon from '@material-ui/icons/Settings';
import CancelScheduleSendIcon from '@material-ui/icons/CancelScheduleSend';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import UserService from "../../services/user.services";
import AuthService from "../../services/auth.services";
import { useAppContext, useFailedMessageContext, usePermissionLevelContext, 
        useSetInviteOpenContext, useSetRevokeOpenContext, useIsOwnerOfOrganizationContext,
        useSetEmailListOpenContext
        } from "../../libs/contextLib";
import MemberInviteAndRevoke from "./MemberInviteAndRevoke";
import EmailList from "./EmailList";
import './MyOrganization.css';

export default function MyOrganization() {
        const JWTtoken = AuthService.getCurrentUsertoken();
        const nodeRef = React.useRef(null);
        const [secondary, setSecondary] = useState(false);
        const [ChangePermissionFailed, setChangePermissionFailed] = useState(false);
        const [ChangePermissionSuccess, setChangePermissionSuccess] = useState(false);
        const [optionsOpen, setOptionsOpen] = useState(false);
        const endpoint_url = "/organizations/get-account-info/" + UserService.getOrgname();
        const history = useHistory();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [orgName, setOrgName] = useState(null);
        const [getOrgFailed, setGetOrgFailed] = useState(false);
        const initialList = [
                {firstName: "", lastName: "", id: ""}
        ]
        const [memberList, setMemberList] = useState(initialList);
        // user options
        const [ChosenOption, setChosenOption] = useState(null);
        const [whoseOption, setWhoseOption] = useState({firstName: "", lastName: "", id: ""});
        const [whoseInfo, setWhoseInfo] = useState({permissionLevel: "", roles: []});
        const [orgRoles, setOrgRoles] = useState([]);
        const [orgMemberNum, setOrgMemberNum] = useState({memberCount: null, memberLimit: null});
        const [orgBio, setOrgBio] = useState("");
        const [assignButtonOpen, setAssignButtonOpen] = useState(false);
        const [defaultRoles, setDefaultRoles] = useState([]);
        const [IsHoveredRole, setIsHoveredRole] = useState(false);
        // admin option
        const [EditBioFailed, setEditBioFailed] = useState(false);
        const [createRemoveRole, setCreateRemoveRole] = useState(null);
        const [roleopen, setRoleopen] = useState(false);
        const [RoleFailed, setRoleFailed] = useState(false);
        const [RemoveSuccess, setRemoveSuccess] = useState(false);
        const [CreateSuccess, setCreateSuccess] = useState(false);
        const [capacityOpen, setCapacityOpen] = useState(false);
        const [CapacityFailed, setCapacityFailed] = useState(false);
        const [CapacitySuccess, setCapacitySuccess] = useState(false);
        const [editBio, setEditBio] = useState(false);
        const [transferOwnerOpen, setTransferOwnerOpen] = useState(false);
        const [TransferOwnerFailed ,setTransferOwnerFailed] = useState(false);
        const [deleteOrgOpen, setDeleteOrgOpen] = useState(false);
        const [DeleteOrgFailed, setDeleteOrgFailed] = useState(false);

        const { userHasAuthenticated } = useAppContext();
        const { permissionLevel, setPermissionLevel } = usePermissionLevelContext();
        const { failedMessage, setFailedMessage } = useFailedMessageContext();
        const { setInviteOpen } = useSetInviteOpenContext();
        const { setRevokeOpen } = useSetRevokeOpenContext();
        const { setEmailListOpen } = useSetEmailListOpenContext();
        const { isOwnerOfOrganization } = useIsOwnerOfOrganizationContext();

        async function getOrginfo() {
                fetch(endpoint_url, {
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
                                setOrgName(data.data.name);
                                setMemberList(data.data.members);
                                setOrgRoles(data.data.roles);
                                setOrgMemberNum({memberCount: data.data.memberCount, memberLimit: data.data.memberLimit});
                                setOrgBio(data.data.bio);
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

        function handleLogout() {

                fetch('/auth/logout', {
                        method: 'POST',
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
                        if(!res.ok){
                                console.log("something went wrong", res.status);
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                        } else{
                                userHasAuthenticated(false);
                                await AuthService.logout();
                                console.log(res.status, '[OK]');
                                history.push("/login");
                                        
                        }
                })
                .catch((err) => {
                        console.error("-- error:", err);
                })
    
                // redirect to login page after logged out
                console.log("end handleLogout fetch call");
        }


        useEffect(() => {
                const fetchData = async () => {
                        await getOrginfo();
                     }
                   
                fetchData();
        }, []);

        const navigateToMemberProfile = (key) => {
                localStorage.setItem("SelectedMemberID", memberList[key].id);
                localStorage.setItem("SelectedMemberName",memberList[key].firstName + "-" + memberList[key].lastName);
                history.push("/profile/" + memberList[key].firstName + "-" + memberList[key].lastName);
                window.location.reload();   
        }

        const constructListItem = (firstName, lastName, i) => (
                <ListItem key={i} style={{paddingBottom: "0px", paddingTop: "0px"}}>
                        <ListItemAvatar>
                                <IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={() => navigateToMemberProfile(i)}
                                        as={Col} 
                                        style={{width: "100%", cursor:"pointer"}}
                                >
                                <Avatar>
                                <FaceIcon />
                                </Avatar>
                                </IconButton>
                        </ListItemAvatar>
                                <ListItemText
                                style={{marginLeft: "5px"}}
                                primary={[firstName, " ", lastName]}
                                secondary={secondary ? (memberList[i].roles).map((role) => {
                                        if (role === (memberList[i].roles)[(memberList[i].roles).length-1]) {
                                                return role
                                        } else {
                                                return role +", "
                                        }
                                }) : null}
                                />
                        <ListItemSecondaryAction>
                                { (permissionLevel >= 2) &&
                                (<IconButton
                                        edge="end"
                                        aria-label="add"
                                        onClick={() => handleOptionsOpen(i)}
                                        as={Col} 
                                        style={{width: "100%", height: "auto", margin: "0 auto", cursor:"pointer"}}
                                        >
                                        <SettingsIcon />
                                </IconButton>)
                                }
                        </ListItemSecondaryAction>
                </ListItem>
        );

        const constructRoleOptions = (role, i) => (
                <option key={i} value={role} >{role}</option>
        );

        const handleRemoveChange = () => {
                setRoleFailed(false);
                setIsHoveredRole(true);
        };

        const handleRollbackChange = () => {
                setIsHoveredRole(false);
        };

        const contructCurrentRoles = (role, i) => (
                <IconButton
                        className="role-remove"
                        key={i}
                        size="small"
                        edge="start"
                        aria-label="remove role"
                        color="primary"
                        alt="remove role"
                        onClick={(e) => (
                                console.log("onclicked!"),
                                handleRemoveAssignRole(e, role)
                        )}
                        onMouseOver={() => handleRemoveChange()}
                        onMouseLeave={() => handleRollbackChange()}
                        as={Col} 
                        style={{width:"auto", margin:"0 auto", cursor:"pointer"}}
                        >
                        {role}
                </IconButton>
                
        );

        const handleRoleOpen = () => {
                setRoleopen(true);
        };


        const handleRoleClose = () => {
                setErrors({
                        ...errors,
                        role: null
                })
                getOrginfo();
                setCreateRemoveRole(null);
                setRoleFailed(false);
                setRemoveSuccess(false);
                setCreateSuccess(false);
                setField('role', null);
                setField('removeRole', null);
                setRoleopen(false);
        };

        const handleCapacityOpen = () => {
                setCapacityOpen(true);
        };

        const handleCapacityClose = () => {
                setErrors({
                        ...errors,
                        memberLimit: null
                })
                getOrginfo();
                setCapacityFailed(false);
                setCapacitySuccess(false);
                setCapacityOpen(false);
                
        };

        const handleTransferOwnerOpen = () => {
                setTransferOwnerOpen(true);
        };

        const handleTransferOwnerClose = () => {
                setErrors({
                        ...errors,
                        newOwnerUsername: null,
                        currentOwnerUsername: null,
                        currentOwnerPassword: null
                })
                getOrginfo();
                setTransferOwnerFailed(false);
                setTransferOwnerOpen(false);
        };

        const handleDeleteOrgOpen = () => {
                setDeleteOrgOpen(true);
        };

        const handleDeleteOrgClose = () => {
                setErrors({
                        ...errors,
                        organizationName: null,
                        ownerUsername: null,
                        ownerPassword: null
                })
                setDeleteOrgFailed(false);
                setDeleteOrgOpen(false);
        };

        const handleEditBioOpen = () => {
                setEditBio(true);
        };

        const handleEditBioClose = () => {
                getOrginfo();
                setEditBioFailed(false);
                setEditBio(false);
        };

        const BioInput = (text) => {
                setOrgBio(text)
        }

        
        const handleCreateRoleOpen = () => {
                setRemoveSuccess(false);
                setRoleFailed(false);
                setCreateRemoveRole("createRole");
        };

        const handleRemoveRoleOpen = () => {
                setCreateSuccess(false);
                setRoleFailed(false);
                setField('role', null);
                setCreateRemoveRole("removeRole");
        };

        const handleAssignRoleOpen = () => {
                setChosenOption("assignRole");
                setChangePermissionFailed(false);
                setChangePermissionSuccess(false);
                setField('permissionLevel', null);
                setRoleFailed(false);
        };
        const handleAssignButtonOpen = () => {
                setAssignButtonOpen(true);
        };

        const handlePermissionOpen = () => {
                setChosenOption("changePermission");
                setChangePermissionFailed(false);
                setChangePermissionSuccess(false);
                setField('permissionLevel', null);
                setRoleFailed(false);
        };


        const handleOptionsOpen = (key) => {
                console.log("whose key?", memberList[key]);
                setWhoseOption(memberList[key]);
                getPermissionLevelAndRole(memberList[key].id);
                setOptionsOpen(true);        
                
        };

        const handleOptionsClose = () => {
                setErrors({
                        ...errors,
                        permissionLevel: null,
                        roles: null
                })
                console.log("selected",selected);
                setOptionsOpen(false);
                setDefaultRoles([]);
                setChosenOption(null);
                setChangePermissionFailed(false);
                setRoleFailed(false);
                setIsHoveredRole(false);
                setField('permissionLevel', null);
                getOrginfo();
        };

        const handleInviteOpen = () => {
                setInviteOpen(true);
        };
        

        const handleRevokeOpen = () => {
                setRevokeOpen(true);
        }

        const handleEmailListOpen = () => {
                setEmailListOpen(true);
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
		// form validation
        const setRoleFormErrors = () => {
		const { role } = form
		const newErrors = {};

                if (!role || role === '') newErrors.role = 'This field cannot be blank'

		return newErrors
	}

        const TransferOwnerFormErrors = () => {
		const { currentOwnerUsername, currentOwnerPassword, newOwnerUsername  } = form
		const newErrors = {};
                
                if (!currentOwnerUsername || currentOwnerUsername === '') newErrors.currentOwnerUsername = 'This field cannot be blank'

                if (!currentOwnerPassword || currentOwnerPassword === '') newErrors.currentOwnerPassword = 'This field cannot be blank'

                if (!newOwnerUsername || newOwnerUsername === '') newErrors.newOwnerUsername = 'This field cannot be blank'
	
		return newErrors

        }

        const deleteOrgFormErrors = () => {
		const { organizationName, ownerUsername, ownerPassword  } = form
		const newErrors = {};
                
                if (!organizationName || organizationName === '') newErrors.organizationName = 'This field cannot be blank'

                if (!ownerUsername || ownerUsername === '') newErrors.ownerUsername = 'This field cannot be blank'

                if (!ownerPassword || ownerPassword === '') newErrors.ownerPassword = 'This field cannot be blank'
	
		return newErrors

        }

        const permissionFormErrors = () => {
		const { permissionLevel } = form
		const newErrors = {};

                if (!permissionLevel || permissionLevel > 4 || permissionLevel < 0) newErrors.permissionLevel = 'Please enter valid permission level'
                
	
		return newErrors

        }

        function handleEditBio(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;

                fetch("/organizations/change-bio", {
                                method: 'PATCH',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        bio: orgBio     
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
                                        handleEditBioClose();
                                }
                })
                .catch((err) => {
                                setEditBioFailed(true);
                                console.error("-- error:", err);
                })
                console.log("end fetch call");
        }


        function handleCreateRole(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = setRoleFormErrors();

                console.log("fetching!", form.role);
                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch("/organizations/create-new-role", {
                                method: 'POST',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        roleName: form.role    
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
                                        await getOrginfo();
                                        setRoleFailed(false);
                                        setCreateSuccess(true);
                                }
                        })
                        .catch((err) => {
                                setCreateSuccess(false);
                                setRoleFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }

        function handleRemoveRole(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;

                fetch("/organizations/remove-role", {
                                method: 'DELETE',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        roleName: form.removeRole    
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
                                        await getOrginfo();
                                        setRoleFailed(false);
                                        setRemoveSuccess(true);
                                        setField('removeRole', "");
                                }
                })
                .catch((err) => {
                                setRemoveSuccess(false);
                                setRoleFailed(true);
                                console.error("-- error:", err);
                        })
                console.log("end fetch call");
        }

        function handleCapacity(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;

                fetch("/organizations/change-member-limit", {
                                method: 'PATCH',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        memberLimit: form.memberLimit    
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
                                        setCapacityFailed(false);
                                        setCapacitySuccess(true);
                                }
                })
                .catch((err) => {
                                setCapacitySuccess(false);
                                setCapacityFailed(true);
                                console.error("-- error:", err);
                        })
                console.log("end fetch call");
        }

        function handleTransferOwner(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = TransferOwnerFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch("/organizations/transfer-ownership", {
                                method: 'PATCH',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        newOwnerUsername: form.newOwnerUsername,
                                        currentOwnerUsername: form.currentOwnerUsername,
                                        currentOwnerPassword: form.currentOwnerPassword    
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
                                        handleTransferOwnerClose();
                                        handleLogout();
                                }
                        })
                        .catch((err) => {
                                setTransferOwnerFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }

        function handleDeleteOrg(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = deleteOrgFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                } else {
                        fetch("/organizations/delete-organization-account", {
                                method: 'DELETE',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        organizationName: form.organizationName,
                                        ownerUsername: form.ownerUsername,
                                        ownerPassword: form.ownerPassword   
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
                                        handleDeleteOrgClose();
                                        handleLogout();
                                }
                        })
                        .catch((err) => {
                                setDeleteOrgFailed(true);
                                console.error("-- error:", err);
                        })
                        console.log("end fetch call");
                }
        }

        function handleChangePermission(event) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;

                console.log("fetching!", form.role);
                fetch("/user-options/update-permission-level/" + whoseOption.id, {
                                method: 'PATCH',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        permissionLevel: form.permissionLevel    
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
                                        console.log(data.message);
                                        getPermissionLevelAndRole(whoseOption.id);
                                        setChangePermissionSuccess(true);
                                        setChangePermissionFailed(false);
                                }
                        })
                .catch((err) => {
                                setChangePermissionFailed(true);
                                setChangePermissionSuccess(false);
                                console.error("-- error:", err);
                        })
                console.log("end fetch call");
        }

        function handleAssignRoles(event, targetVal) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;

                console.log("fetching!");
                fetch("/user-options/add-new-role/" + whoseOption.id, {
                                method: 'POST',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        roleName: targetVal   
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
                                        console.log(data.message);
                                        getPermissionLevelAndRole(whoseOption.id);
                                        setRoleFailed(false);
                                        
                                }
                        })
                .catch((err) => {
                                setRoleFailed(true);
                                console.error("-- error:", err);
                        })
                console.log("end fetch call");
        }

        function handleRemoveAssignRole(event, targetVal) {
                event.preventDefault();
                const controller = new AbortController();
                const signal = controller.signal;
                const newErrors = permissionFormErrors();
                console.log("targetVal:", targetVal)

                console.log("fetching!");
                fetch("/user-options/remove-existing-role/" + whoseOption.id, {
                                method: 'DELETE',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${JWTtoken}`  
                                },
                                body: JSON.stringify({
                                        roleName: targetVal   
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
                                        console.log(data.message);
                                        getPermissionLevelAndRole(whoseOption.id);
                                        setRoleFailed(false);
                                        
                                }
                        })
                .catch((err) => {
                                setRoleFailed(true);
                                console.error("-- error:", err);
                        })
                console.log("end fetch call");
        }



        function getPermissionLevelAndRole(id) {
                console.log("getprofile start");
                console.log("id?", id);

                fetch("/user-profiles/get-info/" + id, {
                        method: 'GET',
                        port: 3080,
                        headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${AuthService.getCurrentUsertoken()}`    
                        }
                })
                .then(async res => {
                        const data = await res.json();
                        console.log("-- data:", data);
                        console.log("-- res.status:", res.status);
                        
                        if(!res.ok || (AuthService.getCurrentUsertoken() === null)){
                                setFailedMessage(data.message);
                                console.log("something went wrong", res.status);
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                        } else{
                                setWhoseInfo({permissionLevel: data.data.permissionLevel, roles: data.data.roles});
                                data.data.roles.map(role => (
                                        setDefaultRoles(defaultRoles => [...defaultRoles, {value: role, label: role}])
                                ));
                                console.log(res.status, '[OK]');
                                        
                        }
                })
                .catch((err) => {
                        console.error("-- error:", err);
                        history.push("/403");
                })
                console.log("end fetch call");
        }

        const [selected, setSelected] = useState([]);
        const onChangeroles = selectedOptions => (setSelected(selected => [...selected, selectedOptions]));

        function numToStringPermissionLevel(val) {
                if (val === 0){
                        return "Member"
                }
                if (val === 1){
                        return "Moderator"
                }
                if (val === 2){
                        return "Admin"
                }
                if (val === 3){
                        return "Owner"
                }
        }

        function renderUserOptions() {
                let component;
                switch(ChosenOption) {
                        case 'changePermission':
                                component =                           
                                        (<Form key={0}>
                                                <Form.Group as={Row} className="mb" controlId="formPlaintext">
                                                <Form.Label column sm="6">
                                                current permission level
                                                </Form.Label>
                                                <Col sm="4">
                                                <Form.Control className="text-center" plaintext readOnly value={numToStringPermissionLevel(whoseInfo.permissionLevel)} />
                                                </Col>
                                                </Form.Group>
                                                <Form.Group as={Row}  className="mb" controlId="text" style={{marginTop: "10px"}}>
                                                <Form.Label column sm="6">
                                                change to
                                                </Form.Label>
                                                <Col sm="4">
                                                <Form.Control
                                                as="select"
                                                onChange={(e) => setField('permissionLevel', e.target.value)}
                                                >
                                                <option >Choose one ...</option>
                                                <option value={"member"}>Member</option>
                                                <option value={"moderator"}>Moderator</option>
                                                <option value={"admin"}>Admin</option>
                                                </Form.Control>
                                                </Col>
                                                </Form.Group>
                                                {ChangePermissionSuccess && <Alert severity="info">{failedMessage}</Alert> }
                                                {ChangePermissionFailed && <Alert severity="error">{failedMessage}</Alert> }
                                                <Form.Group className="two-button" style={{marginTop: '10px'}}>
                                                <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleChangePermission}
                                                className="custom-btn-profile" 
                                                block size="md" 
                                                type="submit"
                                                >
                                                Save
                                                </Button>
                                                </Row>
                                                <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleOptionsClose}
                                                className="custom-btn-profile" 
                                                block size="md" 
                                                type="button"
                                                >
                                                Cancel
                                                </Button>
                                                </Row>
                                                </Form.Group>
                                        </Form>)
                        break
                        case 'assignRole':
                                component =
                                        (<Form key={1}> 
                                                <Form.Group as={Row} className="mb" controlId="formPlaintext">
                                                <Form.Label column sm="2" style={{fontSize: "18px"}}>
                                                Current Roles
                                                </Form.Label>
                                                <Col sm="6">
                                                {whoseInfo.roles.map((item, i) => (
                                                        contructCurrentRoles(item, i)
                                                ))}
                                                </Col>
                                                <Col sm="4">
                                                {!assignButtonOpen &&
                                                <IconButton
                                                edge="end"
                                                aria-label="add"
                                                as={Col}
                                                onClick={handleAssignButtonOpen}
                                                type="submit"
                                                >
                                                <AddCircleIcon />
                                                </IconButton>
                                                }
                                                {assignButtonOpen &&
                                                <Form.Control
                                                as="select"
                                                onChange={(e) => (
                                                        handleAssignRoles(e, e.target.value),
                                                        setAssignButtonOpen(false)
                                                )}
                                                onMouseLeave={(e) => (
                                                        setAssignButtonOpen(false)
                                                )}
                                                >
                                                <option value={null} >Choose one ...</option>
                                                {orgRoles.map((item, i) => (
                                                        constructRoleOptions(item, i)
                                                ))}
                                                </Form.Control>
                                                }
                                                </Col>
                                                </Form.Group>
                                                <Form.Group className="mb" controlId="formPlaintext" style={{height: "40px"}}>
                                                {IsHoveredRole && <Alert severity="info">To remove an assigned role of the member, click the role!</Alert>}
                                                {RoleFailed && <Alert severity="error">{failedMessage}</Alert> }
                                                </Form.Group>
                                        </Form>)
                        break
                }
                return component;
        }

        function renderCreateRemoverole() {
                let component;
                switch(createRemoveRole) {
                        case 'createRole':
                                component =                           
                                        (                
                                        <Form>      
                                                <Form.Group className="formBox" size="md" controlId="text">
                                                <Form.Label>Create a role</Form.Label>
                                                <Form.Control
                                                autoFocus
                                                type="text"
                                                onChange={(e) => setField('role', e.target.value)}
                                                isInvalid={!!errors.role}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                        {errors.role}
                                                </Form.Control.Feedback>
                                                </Form.Group>
                                                {CreateSuccess && <Alert severity="info" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                {RoleFailed && <Alert severity="error" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                <Form.Group className="two-button" style={{marginTop: '10px'}}>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={handleCreateRole}
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
                                                        onClick={handleRoleClose}
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
                        case 'removeRole':
                                component =
                                        (
                                        <Form>      
                                                <Form.Group className="formBox" size="md" controlId="text">
                                                <Form.Label>Remove a role</Form.Label>
                                                <Form.Control
                                                as="select"
                                                onChange={(e) => setField('removeRole', e.target.value)}
                                                >
                                                <option value={null} >Choose one ...</option>
                                                {orgRoles.map((item, i) => (
                                                        constructRoleOptions(item, i)
                                                ))}
                                                </Form.Control>
                                                </Form.Group>
                                                {RemoveSuccess && <Alert severity="info" style={{marginTop: '5px'}}>The selected role has deleted successfully!</Alert> }
                                                {RoleFailed && <Alert severity="error" style={{marginTop: '5px'}}>{failedMessage}</Alert> }
                                                <Form.Group className="two-button" style={{marginTop: '10px'}}>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={handleRemoveRole}
                                                        className="custom-btn-profile" 
                                                        block size="md" 
                                                        type="submit"
                                                        >
                                                        Remove
                                                        </Button>
                                                        </Row>
                                                <Row className="row-profile">
                                                        <Button
                                                        as={Col}
                                                        onClick={handleRoleClose}
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
                {getOrgFailed && <Alert severity="error">{failedMessage}</Alert>}
                <div ref={nodeRef}>
                {MemberInviteAndRevoke()}
                {EmailList()}
                {/* change capacity modal */}
                <Modal
                key={2}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={capacityOpen}
                onHide={handleCapacityClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Change organization maximum capacity
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                                <Form.Group as={Row} className="mb" controlId="formPlaintext" style={{marginBottom:"10px"}}>
                                        <Form.Label column sm="5">
                                        Current capacity
                                        </Form.Label>
                                        <Col sm="6">
                                        <Form.Control className="text-center" plaintext readOnly value={orgMemberNum.memberCount + "/" +  orgMemberNum.memberLimit} />
                                        </Col>
                                </Form.Group>       
                                <Form.Group as={Row} className="mb" controlId="text">
                                        <Form.Label column sm="5">
                                        Capacity options
                                        </Form.Label>
                                        <Col sm="6">
                                        <Form.Control
                                        as="select"
                                        onChange={(e) => setField('memberLimit', e.target.value)}
                                        >
                                        <option key={0} value={""} >Choose one ...</option>
                                        <option key={1} value={10} >10</option>
                                        <option key={2} value={25} >25</option>
                                        <option key={3} value={50} >50</option>
                                        <option key={4} value={100} >100</option>
                                        <option key={5} value={1000} >1000</option>
                                        </Form.Control>
                                        </Col>
                                </Form.Group>
                                {CapacityFailed && <Alert severity="error">{failedMessage}</Alert> }
                                {CapacitySuccess && <Alert severity="info">{failedMessage}</Alert> }
                </Form>
                </Modal.Body>
                <Modal.Footer className="two-button">
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleCapacity}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="submit"
                                >
                                Save
                                </Button>
                                </Row>
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleCapacityClose}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </Button>
                        </Row>
                </Modal.Footer>
                </Modal>
                {/* transfer ownership modal */}
                <Modal
                key={3}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={transferOwnerOpen}
                onHide={handleTransferOwnerClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Transfer admin ownership
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form>
                                <Form.Group className="formBox" size="md" controlId="text">
                                        <Form.Label>New owner username</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField('newOwnerUsername', e.target.value)}
                                        isInvalid={!!errors.newOwnerUsername}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.newOwnerUsername}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="formBox" size="md" controlId="text">
                                        <Form.Label>Current owner username</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField('currentOwnerUsername', e.target.value)}
                                        isInvalid={!!errors.currentOwnerUsername}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.currentOwnerUsername}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="formBox" size="md" controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="password"
                                        onChange={(e) => setField('currentOwnerPassword', e.target.value)}
                                        isInvalid={!!errors.currentOwnerPassword}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.currentOwnerPassword}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                {TransferOwnerFailed && <Alert severity="error">{failedMessage}</Alert> }
                        </Form>
                </Modal.Body>
                <Modal.Footer className="two-button">
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleTransferOwner}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="submit"
                                >
                                Save
                                </Button>
                                </Row>
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleTransferOwnerClose}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </Button>
                        </Row>
                </Modal.Footer>
                </Modal>
                {/* delete organization account modal */}
                <Modal
                key={4}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={deleteOrgOpen}
                onHide={handleDeleteOrgClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Delete organization
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form>
                        {<Alert severity="warning">This action CANNOT be undone. This will delete all associated users and data permanently.</Alert>}
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
                                        <Form.Label>Owner username</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="text"
                                        onChange={(e) => setField('ownerUsername', e.target.value)}
                                        isInvalid={!!errors.ownerUsername}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.ownerUsername}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="formBox" size="md" controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type="password"
                                        onChange={(e) => setField('ownerPassword', e.target.value)}
                                        isInvalid={!!errors.ownerPassword}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.ownerPassword}
                                        </Form.Control.Feedback>
                                </Form.Group>
                                {DeleteOrgFailed && <Alert severity="error">{failedMessage}</Alert> }
                        </Form>
                </Modal.Body>
                <Modal.Footer className="two-button">
                        <Row className="row-profile">
                                <Button
                                as={Col}
                                onClick={handleDeleteOrg}
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
                                onClick={handleDeleteOrgClose}
                                className="custom-btn-profile" 
                                block size="md" 
                                type="button"
                                >
                                Cancel
                                </Button>
                        </Row>
                </Modal.Footer>
                </Modal>
                {/* create a role modal */}
                <Modal
                key={5}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={roleopen}
                onHide={handleRoleClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Create/Remove an organization role
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
                                        <Button variant="outline-secondary" className="button-menu" onClick={handleCreateRoleOpen} >create a role</Button>
                                        <Button variant="outline-secondary" className="button-menu" onClick={handleRemoveRoleOpen} >remove a role</Button>
                                </ButtonGroup>
                                </Col>
                                <Col xs={12} md={9} >
                                        {renderCreateRemoverole()}
                                </Col>
                        </Row>
                </Container>
                </Modal.Body>
                <Modal.Footer className="two-button">
                </Modal.Footer>
                </Modal>
                {/* user options modal */}
                <Modal
                key={6}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                aria-describedby="contained-modal-description"
                centered
                show={optionsOpen}
                onHide={handleOptionsClose}
                >
                <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        user options for {whoseOption.firstName} {whoseOption.lastName}
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
                                        <Button variant="outline-secondary" className="button-menu" onClick={handleAssignRoleOpen} >Assign a role</Button>
                                        <Button variant="outline-secondary" className="button-menu" onClick={handlePermissionOpen} >Change permission level</Button>
                                        <Button variant="outline-secondary" className="button-menu">Three</Button>
                                </ButtonGroup>
                                </Col>
                                <Col xs={12} md={9} >
                                        {renderUserOptions()}
                                </Col>
                        </Row>
                </Container>
                </Modal.Body>
                <Modal.Footer className="two-button">
                </Modal.Footer>
                </Modal>
                </div>
                <Row>
                        <div className="card-org" as={Col}>
                                <div className="d-flex flex-column align-items-center text-center">
                                        <img src="https://img.icons8.com/ios-glyphs/240/000000/user-male-circle.png" alt="logo" width="150" />
                                        <div className="mt-3" style={{width:"90%"}}>
                                        <h4>{orgName}</h4>
                                        {(editBio) &&
                                        (<Form style={{width:"100%", margin: "0 auto"}}>
                                        <Form.Group className="mb" controlId="formPlaintext" style={{width:"95%", margin:"0 auto"}}>
                                                <Form.Control
                                                as="textarea"
                                                rows="4"
                                                className="text-center"
                                                style={{width:"100%", margin:"0 auto", border:"1px solid", borderColor:"gainsboro"}} 
                                                plaintext 
                                                defaultValue={orgBio}
                                                onChange={(e) => BioInput(e.target.value)} />
                                        </Form.Group>
                                        </Form>
                                        )}
                                        {EditBioFailed && <Alert severity="error">{failedMessage}</Alert> }
                                        {(editBio) &&
                                        (<IconButton
                                                size="small"
                                                edge="start"
                                                aria-label="edit"
                                                alt="edit bio"
                                                onClick={handleEditBio}
                                                style={{cursor:"pointer"}}
                                                >
                                                <SaveIcon />
                                        </IconButton>)}
                                        {(!editBio) && (<p className="text-secondary mb-1" style={{width: "95%", margin: "0 auto"}}>{orgBio}</p>)}
                                        {(permissionLevel >= 2) && (!editBio) &&
                                                (<IconButton
                                                size="small"
                                                edge="start"
                                                aria-label="edit"
                                                alt="edit bio"
                                                onClick={handleEditBioOpen}
                                                style={{cursor:"pointer"}}
                                                >
                                                <EditIcon />
                                                </IconButton>
                                        )}
                                </div>
                                </div>
                                {(isOwnerOfOrganization === true || permissionLevel >= 3) &&
                                (<div className="profile-usermenu">
                                        <List>
                                        <ListItem
                                        className="orgMenu"
                                        onClick={handleRoleOpen}>
                                        <ListItemText
                                        primary="Create/Remove an organization role"
                                        />
                                        </ListItem>
                                        <ListItem
                                        className="orgMenu"
                                        onClick={handleCapacityOpen}>
                                        <ListItemText
                                        primary="Change organization maximum capacity"
                                        />
                                        </ListItem>
                                        <ListItem
                                        className="orgMenu"
                                        onClick={handleTransferOwnerOpen}>
                                        <ListItemText
                                        primary="Transfer admin ownership"
                                        />
                                        </ListItem>
                                        <ListItem
                                        className="orgMenu"
                                        onClick={handleDeleteOrgOpen}>
                                        <ListItemText
                                        style={{color: "red"}}
                                        primary="Delete organization account"
                                        />
                                        </ListItem>
                                        </List>
                                </div>)
                                }
                        </div>
                        <Grid item xs={12} md={4} className="card-list" as={Col}>
                                <Typography variant="h6" className="text-center">
                                Member List
                                </Typography>
                        <div>
                        <Row>
                                <Col>
                                {(permissionLevel >= 1) &&
                                (<IconButton
                                edge="end"
                                aria-label="add"
                                alt="invite new member"
                                onClick={handleInviteOpen}
                                style={{width: "10%", height: "auto", marginRight: "auto", marginLeft: 10, cursor:"pointer"}}
                                >
                                <AddIcon />
                                </IconButton>
                                )}
                                {(permissionLevel >= 1) &&
                                (<IconButton
                                edge="end"
                                aria-label="cancel"
                                alt="cancel invitation"
                                onClick={handleRevokeOpen}
                                style={{width: "10%", height: "auto", marginRight: "auto", marginLeft: 10, cursor:"pointer"}}
                                >
                                <CancelScheduleSendIcon />
                                </IconButton>
                                )}
                                {(permissionLevel >= 1) &&
                                (<IconButton
                                edge="end"
                                aria-label="cancel"
                                alt="cancel invitation"
                                onClick={handleEmailListOpen}
                                style={{width: "10%", height: "auto", marginRight: "auto", marginLeft: 10, cursor:"pointer"}}
                                >
                                <MailOutlineIcon />
                                </IconButton>
                                )}
                                </Col>
                                <FormGroup as={Col}>
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
                                </FormGroup>
                        </Row>
                        <List style={{position: "relative", overflow: "auto", maxHeight: "300px"}}>
                        {memberList.map((item, i) => (
                                constructListItem(item.firstName, item.lastName, i)
                        ))}
                        </List>
                        </div>
                        </Grid>
            </Row>
          </div>
        );
}