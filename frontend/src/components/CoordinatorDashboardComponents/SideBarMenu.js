import React from 'react';
import { ChatIcon, Search2Icon } from '@chakra-ui/icons';
import { NavLink, useNavigate } from "react-router-dom";
import './SideBarMenu.css';

export default function SideBarMenu(props) {
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    }
    return (
        <div className="sideNavBar" style={(props.sideBarShow === false) ? { display: "none" } : { display: "block" }}>
            <ul className="sideNavBarlist">
            <li className="sideNavBarLists-item">
                    <NavLink to="/coordinatorDashboard/" className="sideNavBar-listItem">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user me-2 text-900"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li className="sideNavBarLists-item">
                    <NavLink to="/coordinatorDashboard/searchStudent" className="sideNavBar-listItem">
                        <Search2Icon width="14px" height="14px" mr="8px" ml="6px"/>
                        <span>Search Student</span>
                    </NavLink>
                </li>
                <li className="sideNavBarLists-item">
                    <NavLink to="/coordinatorDashboard/jobPost" className="sideNavBar-listItem">
                        <ChatIcon width="14px" height="14px" mr="8px" ml="6px"/>
                        <span>Job Post</span>
                    </NavLink>
                </li>
                <li className="sideNavBarLists-item">
                    <div className="sideNavBar-signout" onClick={handleLogOut}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-900"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        <span>Sign out</span>
                    </div>
                </li>
            </ul>
        </div>
    )
}

