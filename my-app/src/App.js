import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { AppContext, FailedMessageContext, PermissionLevelContext, 
  SetInviteOpenContext, SetRevokeOpenContext, LogoutErrorContext, 
  isOwnerOfOrganizationContext, nameFieldOnContext, emailFieldOnContext,
  roleOptionOnContext, startFieldOnContext, endFieldOnContext,
  commentsOnContext, subCheckOnContext, dateContext, endDateContext, SetEmailListOpenContext,
  formContext
} from "./libs/contextLib";
import AuthService from "./services/auth.services"
import { useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";
import SimpleFooter from "./containers/Footer";
import NavDropdown from "react-bootstrap/NavDropdown";

function App() {
        const history = useHistory();
        const [isAuthenticated, userHasAuthenticated] = useState(false);
        const [isAuthenticating, setIsAuthenticating] = useState(true);
        const [permissionLevel, setPermissionLevel] = useState(null);
        const [isOwnerOfOrganization, setIsOwnerOfOrganization] = useState(false);
        const [failedMessage, setFailedMessage] = useState(null);
        const [inviteOpen, setInviteOpen] = useState(false);
        const [revokeOpen, setRevokeOpen] = useState(false);
        const [emailListOpen, setEmailListOpen] = useState(false);
        const [logoutError, setLogoutError] = useState(false);

        // magic form components
        const [form, setForm] = useState({});
        const [nameFieldOn, setNameFieldOn] = useState(false);
        const [emailFieldOn, setEmailFieldOn] = useState(false);
        const [roleOptionOn, setRoleOptionOn] = useState(false);
        const [startFieldOn, setStartFieldOn] = useState(false);
        const [endFieldOn, setEndFieldOn] = useState(false);
        const [commentsOn, setCommentsOn] = useState(false);
        const [subCheckOn, setSubCheckOn] = useState(false);
        const [datePick, setDatePick] = useState(new Date());
        const [endDate, setEndDate] = useState(new Date());

        useEffect(() => {
          const fetchData = () => {
            onLoad();
          }
          fetchData();
          console.log("onload!", permissionLevel);
        }, []);
        
        function onLoad() {
            const usertoken = AuthService.getCurrentUsertoken();
            console.log("an account logged in");
            
            //await Auth.currentSession();    AWS Auth or Mongodb auth
            if (usertoken !== null){
              userHasAuthenticated(true);
              getPermissionLevel();
            }
            else {
              console.log("[App] can't find current user")

            }
        
          setIsAuthenticating(false);
        }

        async function getPermissionLevel() {
          console.log("getprofile start")

          fetch("/user-profiles/my-info/", {
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
                          setPermissionLevel(data.data.permissionLevel);
                          setIsOwnerOfOrganization(data.data.isOwnerOfOrganization);
                          console.log(res.status, '[OK]');
                                  
                  }
          })
          .catch((err) => {
                  console.error("-- error:", err);
                  setLogoutError(true);
                  handleLogout();
          })
          console.log("end fetch call");
        }

        function handleLogout() {
            fetch('/auth/logout', {
                    method: 'POST',
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
            console.log("end fetch call");
        }

        function separateNavLink() {
            const menuicon = (<img src="https://img.icons8.com/material-sharp/24/000000/user-menu-male.png" alt="menu"/>);
            if (isAuthenticated && (permissionLevel >= 3)){
              return (
                <>
                <NavDropdown
                  alignRight
                  id="dropdown-menu-align-right"
                  title={menuicon}
                >
                  <NavDropdown.Item className="NavDropdown-item" href="/my-organization">My Organization</NavDropdown.Item>
                  <NavDropdown.Item className="NavDropdown-item" href="/create-magicform">Create Magic Form</NavDropdown.Item>
                  <NavDropdown.Item className="NavDropdown-item" href="/magicform-list">Magic Form List</NavDropdown.Item>
                  <NavDropdown.Item className="NavDropdown-item" href="/owner/org-tokens">Organization Tokens</NavDropdown.Item>
                  <NavDropdown.Item className="NavDropdown-item" href="/my-profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => handleLogout()}>Sign out</NavDropdown.Item>
                </NavDropdown>
                </>
              )
            }
            if (isAuthenticated && permissionLevel < 3) {
              return (
                <>
                <NavDropdown
                  alignRight
                  id="dropdown-menu-align-right"
                  title={menuicon}
                >
                  <NavDropdown.Item className="NavDropdown-item" href="/my-organization">My Organization</NavDropdown.Item>
                  <NavDropdown.Item className="NavDropdown-item" href="/create-magicform">Create Magic Form</NavDropdown.Item>
                  <NavDropdown.Item className="NavDropdown-item" href="/magicform-list">Magic Form List</NavDropdown.Item>
                  <NavDropdown.Item className="NavDropdown-item" href="/my-profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => handleLogout()}>Sign out</NavDropdown.Item>
                </NavDropdown>
                </>
              )
            }
            if (isAuthenticated === false) {
              return (
                <>
                  <LinkContainer to="/signup-member/orgName/userEmail/someToken">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/signup-admin/orgName/userEmail/someToken">
                    <Nav.Link>Signup(admin)</Nav.Link>
                  </LinkContainer>                     
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )
            } 
        }

        return (
          !isAuthenticating && (
          <div className="App container py-3">
            <Navbar className="color-nav" collapseOnSelect  expand="md" variant="light">
              <LinkContainer to="/">
                <Navbar.Brand className="font-weight-bold">
                  Task Manager
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle />
              
              <Navbar.Collapse className="justify-content-end">
                <Nav activeKey={window.location.pathname} >
                  {separateNavLink()}
              </Nav>
              </Navbar.Collapse>
            </Navbar>
            <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
              <FailedMessageContext.Provider value={{ failedMessage, setFailedMessage }}>
                <PermissionLevelContext.Provider value={{ permissionLevel, setPermissionLevel }}>
                  <SetInviteOpenContext.Provider value={{ inviteOpen, setInviteOpen }}>
                  <SetRevokeOpenContext.Provider value={{ revokeOpen, setRevokeOpen }}>
                  <SetEmailListOpenContext.Provider value={{ emailListOpen, setEmailListOpen }}>
                  <LogoutErrorContext.Provider value={{ logoutError, setLogoutError }}>
                  <isOwnerOfOrganizationContext.Provider value={{ isOwnerOfOrganization, setIsOwnerOfOrganization }}>
                    <nameFieldOnContext.Provider value={{ nameFieldOn, setNameFieldOn }}>
                    <emailFieldOnContext.Provider value={{ emailFieldOn, setEmailFieldOn }}>
                    <roleOptionOnContext.Provider value={{ roleOptionOn, setRoleOptionOn }}>
                    <startFieldOnContext.Provider value={{ startFieldOn, setStartFieldOn }}>
                    <endFieldOnContext.Provider value={{ endFieldOn, setEndFieldOn }}>
                    <commentsOnContext.Provider value={{ commentsOn, setCommentsOn }}>
                    <subCheckOnContext.Provider value={{ subCheckOn, setSubCheckOn }}>
                      <dateContext.Provider value={{ datePick, setDatePick }}>
                      <endDateContext.Provider value={{ endDate, setEndDate }}>
                        <formContext.Provider value={{form, setForm}}>
            <Routes />
                        </formContext.Provider>
                      </endDateContext.Provider>
                      </dateContext.Provider>
                    </subCheckOnContext.Provider>
                    </commentsOnContext.Provider>
                    </endFieldOnContext.Provider>
                    </startFieldOnContext.Provider>
                    </roleOptionOnContext.Provider>
                    </emailFieldOnContext.Provider>
                    </nameFieldOnContext.Provider>
                  </isOwnerOfOrganizationContext.Provider>
                  </LogoutErrorContext.Provider>
                  </SetEmailListOpenContext.Provider>
                  </SetRevokeOpenContext.Provider>
                  </SetInviteOpenContext.Provider>
                </PermissionLevelContext.Provider>
              </FailedMessageContext.Provider>
            </AppContext.Provider>
            <SimpleFooter />
          </div>
          
          )
        );
}

export default App;