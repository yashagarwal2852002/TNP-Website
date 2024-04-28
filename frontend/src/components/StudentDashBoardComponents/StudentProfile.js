import './StudentProfile.css'
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast, Button, Avatar, AvatarGroup, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow, Box} from '@chakra-ui/react';
import { Search2Icon, AddIcon, EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import iiitbhopallogo from '../../assets/iiitbhopallogo.png';
import companyLogo from '../../assets/companyLogo.jpg';
import schoolLogo from '../../assets/schoolLogo.jpg';
import AddProjectModal from './AddProjectModal.js';
import EditProjectModal from './EditProjectModal.js';
import Loader2 from './Loader2.js';

export default function StudentProfile() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  // UseEffect Function to Fetch the USER Credentials
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
    fetchData();
  }, []);
  // ------------------------------------ Completed----------------------------------------

  function convertDate(dateStr) {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    return formattedDate;
  }

  function dateToMonthandYear(dateStr) {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    })
    return formattedDate;
  }

  return (
    ((loading) ? <Loader2 />
      : (user ? <div className='studentProfilePage'>
        {/* ------------------------------------------------------------Logo Name & Description ---------------------------------------------------- */}
        <div className="studentProfileImage">
          <div className="profileImage">
            <img src={user.pic} alt="Profile Pic" />
          </div>
          <div className='student_About'>
            <div className="student_name">{user.firstName + " " + user.middleName + " " + user.lastName}</div>
            <div className="about">{user.description}</div>
            <Link to='/studentDashboard/searchJobs' className="searchJobshortcut"><Search2Icon mr="6px" mt="-3px" />Apply Jobs</Link>
          </div>
        </div>
        {/* -------------------------------------------------------------Completed----------------------------------------------------------------- */}


        <div className='information'>

          {/* ----------------------------------------------------------Personal Information ------------------------------------------------------ */}
          <div className="personalInformation">
            <h2>Personal Information</h2>
            <div className="personalInformationSection1">
              <div> <div className="first">First Name </div><div className="second">{user.firstName}</div> </div>
              <div> <div className="first">Middle Name </div><div className="second">{user.middleName}</div> </div>
              <div> <div className="first">Last Name </div><div className="second">{user.lastName}</div> </div>
              <div> <div className="first">Scholar No </div><div className="second">{user.scholarNo}</div> </div>
              <div> <div className="first">Scholar Status </div><div className="second">{user.scholarStatus}</div> </div>
              <div> <div className="first">Father's Name </div><div className="second">{user.fatherName}</div> </div>
              <div> <div className="first">Mother's Name </div><div className="second">{user.motherName}</div> </div>
              <div> <div className="first">Gender </div><div className="second">{user.gender}</div> </div>
              <div> <div className="first">D.O.B. </div><div className="second">{convertDate(user.dateOfBirth)}</div> </div>
              <div> <div className="first">Category </div><div className="second">{user.category}</div> </div>
              <div> <div className="first">Community </div><div className="second">{user.community}</div> </div>
              <div> <div className="first">Nationality </div><div className="second">{user.nationality}</div> </div>
              <div> <div className="first">Aadhar Card No. </div><div className="second">{user.aadharCardNo}</div> </div>
              <div> <div className="first">Contact No. </div><div className="second">+91-{user.contactNo}</div> </div>
              <div> <div className="first">Email </div><div className="second">{user.email}</div> </div>
              <div> <div className="first">Course </div><div className="second">{user.course}</div> </div>
              <div> <div className="first">Department </div><div className="second">{user.department}</div> </div>
              <div> <div className="first">Specialization </div><div className="second">{user.specialization}</div> </div>
              <div> <div className="first">Admission Year </div><div className="second">{user.admissionYear}</div> </div>
              <div> <div className="first">Additional Contact No. </div><div className="second">{user.additionalContactNo}</div> </div>
            </div>
          </div>
        </div>
        {/* --------------------------------------------------- Completed ------------------------------------------------------------------------- */}


        {/* ---------------------------------------------------------- Education ------------------------------------------------------------------ */}
        <div className="education">
          <h2>Education</h2>
          {user.education.length > 0 ? (
            user.education.map((educationDetail, index) => (
              <div className="educationLogoAndDetail" key={index} style={{ borderBottom: "1px solid #ebebeb" }}>
                <div className="educationLogo">
                  <img src={(educationDetail.institution === 'Indian Institute of Information Technology Bhopal') ? iiitbhopallogo : schoolLogo} alt={educationDetail.institution} />
                </div>
                <div className="educationDetails">
                  <div className="educationtitle">{educationDetail.institution}</div>
                  <div className='degreeandSpecialization'>{educationDetail.degree}, {educationDetail.fieldOfStudy}</div>
                  <div className="educationDuration">{educationDetail.startDate} - {educationDetail.endDate}</div>
                  <div className="educationGrade">Grade: {parseFloat(educationDetail.grade).toFixed(2)}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#6c757d", marginBottom: "10px" }}>No Education to Display.</p>
          )}
        </div>
        {/* -----------------------------------------------------Completed -------------------------------------------------------------------- */}


        {/* ----------------------------------------------------------Experience ------------------------------------------------------------------ */}
        <div className="experience">
          <h2>Experience</h2>
          {user.experience.length > 0 ? (
            user.experience.map((experience, index) => (
              <div className="logoanddetail" key={index}>
                <div className="companyLogo">
                  <img src={companyLogo} alt="Profile Pic" />
                </div>
                <div className="detail">
                  <div className="title">{experience.title}</div>
                  <div className="companyName">
                    {experience.companyName} · {experience.employmentType}
                  </div>
                  <div className="duration">
                    {dateToMonthandYear(experience.startDate) + " "} - {experience.currentlyWorking === "yes" ? " Present" : dateToMonthandYear(experience.endDate)}
                  </div>
                  <div className="location">{experience.location} · {experience.locationType}</div>
                </div>
              </div>
            ))
          ) : <p style={{ color: "#6c757d", marginBottom: "10px" }}>No Experiences to Display.</p>}
        </div>
        {/* -----------------------------------------------------Completed -------------------------------------------------------------------- */}


        {/* -----------------------------------------------------Project Details -------------------------------------------------------------- */}
        <div className="project">
          <div className="projectTitle">
            <h2>Projects</h2>
            <AddProjectModal setUser={setUser}>
              <Button
                display="flex"
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                bg="white"
                width="40px"
                height="40px"
                borderRadius="50%"
                _hover={{ bg: '#ebedf0' }}
              >
                <AddIcon />
              </Button>
            </AddProjectModal>
          </div>
          {user.project.length > 0 ? (
            user.project.map((project, index) => (
              <div className="detail" key={index}>
                <EditProjectModal project={project} setUser={setUser}>
                  <Button
                    display="flex"
                    fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                    bg="white"
                    width="40px"
                    height="40px"
                    borderRadius="50%"
                    _hover={{ bg: '#ebedf0' }}
                  >
                    <EditIcon />
                  </Button>
                </EditProjectModal>
                <div className="title">{project.projectName}</div>
                <div className="duration">
                  {project.startDate} - {project.currentlyWorking ? " Present" : project.endDate}
                </div>
                <div className="projectLink"><a href={project.projectURL} target="_blank" rel="noreferrer">Show Project&nbsp;&nbsp;
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" style={{ display: "inline", marginLeft: "-5px", marginBottom: '-2px' }} fill="currentColor" className="mercado-match" width="16" height="16" focusable="false">
                    <path d="M15 1v6h-2V4.41L7.41 10 6 8.59 11.59 3H9V1zm-4 10a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h2V3H5a3 3 0 00-3 3v5a3 3 0 003 3h5a3 3 0 003-3V9h-2z"></path>
                  </svg></a>
                </div>
                <div className="description"><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', fontSize: '14px', fontFamily: 'system-ui', marginTop: '10px' }}>{project.description}</pre></div>
                {project.contributors.length > 0 && (
                  <div className="contributor">
                    <p style={{ fontSize: '15px', fontWeight: '600', fontFamily: 'system-ui', margin: '10px 0px' }}>Other Contributors</p>
                    <AvatarGroup size='md'>
                      {project.contributors.map(contributor => (
                        <Popover key={contributor._id}>
                          <PopoverTrigger>
                            <Avatar style={{ cursor: 'pointer', marginRight: '5px' }} name={`${contributor.firstName} ${contributor.middleName ? contributor.middleName + ' ' : ''}${contributor.lastName}`} src={contributor.pic} />
                          </PopoverTrigger>
                          <PopoverContent className='popOverComponent'>
                            <PopoverArrow />
                            <PopoverBody display="flex" alignItems="center">
                              <Box mr={4}>
                                <Avatar name={`${contributor.firstName} ${contributor.middleName ? contributor.middleName + ' ' : ''}${contributor.lastName}`} src={contributor.pic} />
                              </Box>
                              <Box>
                                <p style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: 'system-ui' }}>{`${contributor.firstName} ${contributor.middleName ? contributor.middleName + ' ' : ''}${contributor.lastName}`}</p>
                                <p style={{ color: '#404040c9', fontSize: '13px', fontFamily: 'system-ui' }}>Scholar No: {contributor.scholarNo}</p>
                              </Box>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      ))}
                    </AvatarGroup>
                  </div>
                )}
              </div>
            ))
          ) : <p style={{ color: "#6c757d", marginBottom: "10px" }}>No Projects to Display.</p>}
        </div>
        {/* -----------------------------------------------------Completed -------------------------------------------------------------------- */}
      </div> : <></>)
    )
  )
}
