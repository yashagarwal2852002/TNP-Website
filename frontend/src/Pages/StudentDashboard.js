import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import StudentProfile from '../components/StudentDashBoardComponents/StudentProfile';
import ChangePassword from '../components/StudentDashBoardComponents/ChangePassword';
import NavigationBar from '../components/StudentDashBoardComponents/NavigationBar';
import SideBarMenu from '../components/StudentDashBoardComponents/SideBarMenu';
import SearchJobs from '../components/StudentDashBoardComponents/SearchJobs';
import ChatRoom from '../components/StudentDashBoardComponents/Chat';
import ViewResume from '../components/StudentDashBoardComponents/ViewResume';
import Loader from '../components/StudentDashBoardComponents/Loader';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';


export default function StudentDashboard() {
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // UseEffect Function to check the Login Status of the USER
  useEffect(() => {
    const fetchData = async () => {
      try {
        let user = JSON.parse(localStorage.getItem('userInfo'));
        if (!user || !user.token) {
          localStorage.removeItem('userInfo');
          navigate('/login');
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        // Using the same API through which we check Login Status Because it also provide the user Information
        const { data } = await axios.get("/api/user/checkLoginStatus", config);
        if (data.isLoggedIn) {
          if (data.user.role === 'Coordinator') {
            navigate('/coordinatorDashboard');
          } else if (data.user.role === "Administrator") {
            navigate('/administratorDashboard');
          } else {
            setUser(data.user);
            if (window.location.pathname === '/studentDashboard' || window.location.pathname === '/studentDashboard/') navigate("/studentDashboard/studentProfile", { replace: true });
          }
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        if (!navigator.onLine) {
          toast({
            title: "Network Error",
            description: "Please check your internet connection.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        } else if (error.response && error.response.status === 401) {
          toast({
            title: "Unauthorized Access",
            description: "Session expired or unauthorized. Please log in.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          localStorage.removeItem('userInfo');
          navigate('/login');
        } else {
          toast({
            title: "Error Occurred!",
            description: "An error occurred while fetching data.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          localStorage.removeItem('userInfo');
          navigate('/login');
        }
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
        <Route path="/studentProfile" element={<StudentProfile />} />
        <Route path="/searchJobs" element={<SearchJobs windowSize={windowSize} />} />
        <Route path="/chatRoom" element={<ChatRoom />} />
        <Route path="/viewResume" element={<ViewResume />} />
        <Route path="/changePassword" element={<ChangePassword windowSize={windowSize} />} />
      </Routes>
    </div>
    )
  )
}
