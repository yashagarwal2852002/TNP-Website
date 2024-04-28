import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import JobPost from '../components/CoordinatorDashboardComponents/JobPost';
import NavigationBar from '../components/CoordinatorDashboardComponents/NavigationBar';
import SideBarMenu from '../components/CoordinatorDashboardComponents/SideBarMenu';
import Dashboard from '../components/CoordinatorDashboardComponents/Dashboard';
import SearchStudent from '../components/CoordinatorDashboardComponents/SearchStudent';
import Loader from '../components/StudentDashBoardComponents/Loader';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

export default function CoordinatorDashboard() {
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  
  // UseEffect Function to check the Login Status of the USER
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
                navigate('/studentDashboard');
              } else if (data.user.role === "Administrator") {
                navigate('/administratorDashboard');
              }else{
                setUser(data.user);
              }
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
              // Unauthorized access: Token failed or expired
              localStorage.removeItem('userInfo');
              navigate('/login');
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
          navigate('/login');
        }
        setLoading(false);
      } else {
        navigate('/login');
        setLoading(false);
      }
    };
    fetchData(); // Call the async Function immediately
  }, []);
  // -------------------------------------------------    USEEFFECT Functionality Completed to check the Login Status    -----------------------------------------


  // -------------------------------------------------    Handle HamBurgar Icon Click function in Navigation Menu   ----------------------------------------------
  const [sideBarShow, setSideBarShow] = useState((window.innerWidth > 1050) ? true : false);
  const toggleSideBar = () => {
    if (sideBarShow === false) setSideBarShow(true);
    else setSideBarShow(false);
  }
  // ---------------------------------------------------------------------------    Completed   ------------------------------------------------------------------


  // ---------------------------------------------------    Handle Profile Logo Click function in Navigation Menu   ----------------------------------------------
  const [navDropdownShow, setNavDropdownShow] = useState("none");
  const navProfileLogoClick = () => {
    if (navDropdownShow === "none") setNavDropdownShow("block");
    else setNavDropdownShow("none");
  }
  // ---------------------------------------------------------------------------    Completed   ------------------------------------------------------------------


  // ---------------------------------------------------    Handle on resize of window ---------------------------------------------------------------------------
  window.onresize = function (event) {
    // For Navigation menu
    setWindowSize([window.innerWidth, window.innerHeight]);
    // for sidebar menu
    if (window.innerWidth <= 1050) setSideBarShow(false);
    else setSideBarShow(true);
  }
  // --------------------------------------------------------------- Completed -----------------------------------------------------------------------------------

  // ---------------------------------------------------    Handle click on whole window -------------------------------------------------------------------------
  window.onclick = function (event) {
    // For Navigation menu
    if (!event.target.matches('.navDropdown') && !event.target.matches('.profileLogo')) {
      if (navDropdownShow === "block") setNavDropdownShow("none");
    }
    // For side Bar Menu
    if (window.innerWidth <= 1050 && !event.target.matches('.nav-hamburgerIcon') && !event.target.closest('.nav-hamburgerIcon') && !event.target.matches('.sideNavBar')) {
      setSideBarShow(false);
    }
  }
  // --------------------------------------------------------------- Completed -----------------------------------------------------------------------------------

  return (
    (loading ? <Loader /> : <div>
      <NavigationBar user={user} toggleSideBar={toggleSideBar} navProfileLogoClick={navProfileLogoClick} navDropdownShow={navDropdownShow} windowSize={windowSize} />
      <SideBarMenu sideBarShow={sideBarShow} setSideBarShow={setSideBarShow} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/searchStudent" element={<SearchStudent windowSize={windowSize}/>} />
        <Route path="/jobPost" element={<JobPost />} />
      </Routes>
    </div>
    )
  )
}
