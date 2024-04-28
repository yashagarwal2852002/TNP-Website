import React, { useState } from 'react';
import { Search2Icon } from '@chakra-ui/icons'
import './NavigationBar.css';
import Logo from '../../assets/iiitbhopallogo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function NavigationBar(props) {
    let temp = "";
    if(props.user) temp = props.user.firstName + " " + props.user.middleName + " " + props.user.lastName;
    const [Name, setName] = useState(temp.length > 17 ? temp.substring(0, 15) + "..." : temp);
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    }
    return (
        <div className="nav_container">
            <div className="navFirst">
                <div className="nav-hamburgerIcon" id="menu" onClick={props.toggleSideBar}>
                    <div className="box11"></div>
                    <div className="box12"></div>
                    <div className="box13"></div>
                </div>
                <Link to='https://www.iiitbhopal.ac.in/' target="_blank" rel="noreferrer">
                    <img className='iiitbhopalLogo' src={Logo} alt="Logo" />
                </Link>
            </div>
            <div className="navSecond">
                <div className="studentName">
                    {Name}
                </div>
                <div className="navProfilePic">
                    <span onClick={props.navProfileLogoClick} className='profileLogo'>{Name.substring(0, 1)}</span>
                </div>
            </div>
            <div id="navDropdownContent" className='navDropdown' style={{ display: props.navDropdownShow, maxHeight: "301px", height: props.windowSize[1] - 85 }}>
                <div className="profileAndName">
                    <div className="dropprofilePic">
                        <span className='dropprofileLogo'>{Name.substring(0, 1)}</span>
                    </div>
                    <div className="dropstudentName">
                        {Name}
                    </div>
                </div>
                <ul>
                    <li className="nav-item">
                        <Link className="nav-item-class" to="/coordinatorDashboard/">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user me-2 text-900"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/coordinatorDashboard/searchStudent" className="nav-item-class">
                            <svg className="text-900" height="16px" width="16px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <g>
                                    <path className="st0" d="M276.239,252.183c-6.37,2.127-13.165,3.308-20.239,3.308c-7.074,0-13.87-1.181-20.24-3.308
                                    c-46.272,7.599-70.489,41.608-70.489,82.877H256h90.728C346.728,293.791,322.515,259.782,276.239,252.183z"/>
                                    <path className="st0" d="M256,240.788c27.43,0,49.658-22.24,49.658-49.666v-14.087c0-27.426-22.228-49.659-49.658-49.659
                                    c-27.43,0-49.658,22.233-49.658,49.659v14.087C206.342,218.548,228.57,240.788,256,240.788z"/>
                                    <path className="st0" d="M378.4,0H133.582C86.234,0,47.7,38.542,47.7,85.899v340.22C47.7,473.476,86.234,512,133.582,512h205.695
                                    h13.175l9.318-9.301l93.229-93.229l9.301-9.31v-13.174V85.899C464.3,38.542,425.766,0,378.4,0z M432.497,386.985H384.35
                                    c-24.882,0-45.074,20.183-45.074,45.073v48.139H133.582c-29.866,0-54.078-24.221-54.078-54.078V85.899
                                    c0-29.874,24.212-54.096,54.078-54.096H378.4c29.876,0,54.096,24.222,54.096,54.096V386.985z"/>
                                </g>
                            </svg>                            
                            <span>Search Student</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-item-class" to="/coordinatorDashboard/jobPost">
                            <Search2Icon width="14px" height="14px" mr="8px" ml="6px" />
                            <span>Job Post</span>
                        </Link>
                    </li>
                </ul>
                <div className="signOutFunction">
                    <div className="nav-item-signout" onClick={handleLogOut}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-900"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        <span>Sign out</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
