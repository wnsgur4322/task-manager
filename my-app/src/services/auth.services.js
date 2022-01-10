class AuthService {

        logout = () => {
                localStorage.removeItem("client-token");
                localStorage.removeItem("loggedin-username");
                localStorage.removeItem("permissionLevel");
                localStorage.removeItem("userId");
                localStorage.removeItem("orgName");
                localStorage.removeItem("SelectedMemberID");
                localStorage.removeItem("SelectedMemberName");
                console.log("--[logout] client-token has cleaned:", localStorage.getItem("client-token"));
        };

        getCurrentUsertoken = () => {
                console.log("--client-token:", localStorage.getItem("client-token"));
                return localStorage.getItem("client-token");
        };

        getCurrentUsername = () => {
                console.log("--loggedin-username:", localStorage.getItem("loggedin-username"));
                return localStorage.getItem("loggedin-username");
        }

        getCurrentUserId = () => {
                console.log("--loggedin-userid:", localStorage.getItem("userId"));
                return localStorage.getItem("userId");
        }

        getPermissionLevel = () => {
                console.log("--permission level:", localStorage.getItem("permissionLevel"));
                return localStorage.getItem("permissionLevel");
        }

}
export default new AuthService();