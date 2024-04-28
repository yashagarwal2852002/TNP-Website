import { useNavigate } from 'react-router-dom';
import { React, useEffect, useState } from "react";
import './LoginPage.css';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Grid, GridItem, Image } from "@chakra-ui/react";
import Logo from '../assets/iiitbhopallogo.png';
import StudentLogin from '../components/Authentication/StudentLogin.js';
import CoordinatorLogin from '../components/Authentication/CoordinatorLogin.js';
import AdministratorLogin from '../components/Authentication/AdministratorLogin.js';
import Loader from '../components/StudentDashBoardComponents/Loader.js';

export default function LoginPage() {
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            let user = JSON.parse(localStorage.getItem('userInfo'));
            if (user) {
                if (user.token) {
                    try {
                        const config = {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        };

                        const { data } = await axios.get("/api/user/checkLoginStatus", config);
                        if (data.isLoggedIn) {
                            if (data.user.role === 'Student') {
                                Navigate("/studentDashboard");
                            } else if (data.user.role === 'Coordinator') {
                                Navigate("/coordinatorDashboard");
                            } else {
                                Navigate("/administratorDashboard");
                            }
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            // Unauthorized access: Token failed or expired
                            localStorage.removeItem('userInfo');
                        } else {
                            // Other errors: Network issue or server error
                            toast({
                                title: "Error Occurred!",
                                description: "Apologies for the inconvenience. Please refresh the page.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom-left",
                            });
                        }
                    }

                } else {
                    localStorage.removeItem('userInfo');
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        fetchData(); // Call the async function immediately
    }, [Navigate]);


    return (
        (loading ? <Loader /> : <Grid className='container' templateColumns="1.3fr 2fr" gap={4}>
            <GridItem className='leftContainer'>
                <h1 className='heading1'>IIIT Bhopal Placements</h1>
                <h1 className='slogan'>One stop portal for students & companies for placements.</h1>
                <Image boxSize="170px" src={Logo} alt='IITT BHOPAL LOGO' m="auto" />
                <div className="backgroundimage">
                    <div className="hbars">
                        <div className="boxh"></div>
                    </div>
                    <div className="vbars">
                        <div className="box1"></div>
                        <div className="box2"></div>
                        <div className="box3"></div>
                        <div className="box4"></div>
                    </div>
                </div>
            </GridItem>
            <GridItem className='rightContainer'>
                <Heading as="h4" size='md' style={{ color: "#007BFF", marginBottom: "50px", textAlign: "center" }}>Sign In to IIIT Bhopal Placement Portal</Heading>
                <Tabs>
                    <TabList className='tablist'>
                        <Tab className='tabs'>Student</Tab>
                        <Tab className='tabs'>TNP - Coordinator</Tab>
                        <Tab className='tabs'>Administrator</Tab>
                    </TabList>

                    <TabPanels style={{ width: "70%", margin: "auto" }}>
                        <TabPanel>
                            <StudentLogin />
                        </TabPanel>
                        <TabPanel>
                            <CoordinatorLogin />
                        </TabPanel>
                        <TabPanel>
                            <AdministratorLogin />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </GridItem>

        </Grid>)

    )
}
