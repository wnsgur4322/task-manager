class UserService {

        getOrgname = () => {
                console.log("-- org name:", localStorage.getItem("orgName"));
                return localStorage.getItem("orgName");
        }

}
export default new UserService();