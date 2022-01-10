import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Error from "./containers/404";
import Forbidden from "./containers/403";
import Login from "./containers/Login";
import MemberSignup from "./containers/MemberSignup";
import AdminSignup from "./containers/AdminSignup";
import TokenCreate from "./containers/TokenCreate";
import TokenUpdate from "./containers/TokenUpdate";
import Profile from "./containers/Profile";
import MemberProfile from "./containers/MemberProfile";
import SendInvitation from "./containers/SendInvitation";
import MyOrganization from "./containers/project/MyOrganization";
import Magicform from "./containers/project/MagicForm";
import OrgTokens from "./containers/OrgTokens";
import MagicformList from "./containers/project/FormList";
import SubmitMagicform from "./containers/SubmitMagicform";

export default function Routes() {

        console.log("selectedName:", localStorage.getItem("SelectedMemberName"));
        return (
                <Switch>
                        <Route exact path="/">
                                <Home />
                        </Route>
                        <Route exact path="/owner/create-organization-token">
                                <TokenCreate />
                        </Route>
                        <Route exact path="/owner/update-organization-token">
                                <TokenUpdate />
                        </Route>
                        <Route exact path="/login">
                                <Login />
                        </Route>
                        <Route exact path="/signup-member/:orgName/:signUpemail/:orgToken">
                                <MemberSignup />
                        </Route>
                        <Route exact path="/signup-admin/:orgName/:signUpemail/:orgToken">
                                <AdminSignup />
                        </Route>
                        <Route exact path="/my-profile">
                                <Profile />
                        </Route>
                        <Route exact path={"/profile/" + localStorage.getItem("SelectedMemberName")} >
                                <MemberProfile />
                        </Route>
                        <Route exact path="/invite-member">
                                <SendInvitation />
                        </Route>
                        <Route exact path="/my-organization">
                                <MyOrganization />
                        </Route>
                        <Route exact path="/create-magicform">
                                <Magicform />
                        </Route>
                        <Route exact path="/magicform-list">
                                <MagicformList />
                        </Route>
                        <Route exact path="/magicform-submit/:email/:formId">
                                <SubmitMagicform />
                        </Route>
                        <Route exact path="/owner/org-tokens">
                                <OrgTokens />
                        </Route>
                        <Route exact path="/403">
                                <Forbidden />
                        </Route>
                        <Route>
                                <Error />
                        </Route>
                </Switch>
        );
}