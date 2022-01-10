import SimpleReactFooter from "../components/SimpleReactFooter";
import "./Footer.css";

export default function SimpleFooter() {
        const description = "This is Task Manager App";
        const title = "Task Manager";
        var columns = [
        {
                title: "Resources",
                resources: [
                {
                        name: "About",
                        link: "http://localhost:3000/about"
                },
                {
                        name: "Contact",
                        link: "http://localhost:3000/contact"
                },
                ]
        },
        {
                title: "Legal",
                resources: [
                {
                        name: "Privacy",
                        link: "http://localhost:3000/privacy"
                },
                {
                        name: "Terms",
                        link: "http://localhost:3000/terms"
                }
                ]
        },
        {
                title: "Visit",
                resources: [
                {
                        name: "Locations",
                        link: "http://localhost:3000/locations"
                },
                {
                        name: "Culture",
                        link: "http://localhost:3000/culture"
                }
                ]
        }
        ];
        return(
        <footer>
                <SimpleReactFooter
                columns={columns}
                linkedin="Wizrds LLC"
                facebook="Wizrds LLC"
                twitter="Wizrds LLC"
                instagram="Wizrds LLC"
                youtube="google"
                pinterest="Wizrds LLC"
                copyright="Wizrds LLC"
                iconColor="white"
                backgroundColor="#266867"
                fontColor="white"
                copyrightColor="darkgrey"
        />
        </footer>
        )
};