import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './ChangePassword.css';
import Loader2 from './Loader2.js';
import { useToast } from '@chakra-ui/react';
import { InputGroup, Input, Button, InputRightElement } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function ChangePassword(props) {

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOldPasswordClick = () => setShowOldPassword(!showOldPassword);
  const handleNewPasswordClick = () => setShowNewPassword(!showNewPassword);
  const handleConfirmPasswordClick = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async () => {
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      toast({
        title: "Error! Please Fillout all the Fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast({
        title: "Error! New Password not met password requirements",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if(newPassword !== confirmPassword){
      toast({
        title: "Error! New & Confirm Password are not same",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }


    setChangePasswordLoading(true);
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      if (user.token) {
        const passwordData = {
          oldPassword,
          newPassword
        };
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post("/api/user/changePassword", passwordData, config);
          toast({
            title: "Success!",
            description: "Password changed Successfully! Login Again",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          localStorage.removeItem('userInfo');
          navigate('/login');
          setChangePasswordLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Unauthorized access: Token failed or expired
            toast({
              title: "Error Occurred!",
              description: `${error.response.data.message}! Please Login Again.`,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
            localStorage.removeItem('userInfo');
            navigate('/login');

          } else {
            // Other errors: Network issue or server error
            console.log(error.response);
            toast({
              title: "Error Occurred!",
              description: "Apologies for the inconvenience. Please refresh the page.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
          }
        }
      } else {
        toast({
          title: "Please Login Again. Session Expired!",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    } else {
      toast({
        title: "Please Login Again. Session Expired!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      navigate('/login');
      setChangePasswordLoading(false);
    }
  }

  // Reset function to Reset All the Input Fields
  const handleReset = async () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

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
              if (data.user.role === 'Coordinator') {
                navigate('/coordinatorDashboard');
              } else if (data.user.role === "Administrator") {
                navigate('/administratorDashboard');
              } else {
                if (window.location.pathname === '/studentDashboard' || window.location.pathname === '/studentDashboard/') navigate("/studentDashboard/studentProfile", { replace: true });
              }
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
              // Unauthorized access: Token failed or expired
              toast({
                title: "Token Failed || Expired!",
                description: "Please Login again to get access.",
                status: "warming",
                duration: 3000,
                isClosable: true,
                position: "top-right",
              });
              localStorage.removeItem('userInfo');
              navigate('/login');
            } else {
              // Other errors: Network issue or server error
              toast({
                title: "Error Occurred!",
                description: "Apologies for the inconvenience. Please Try Again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
            }
          }
        } else {
          toast({
            title: "Token Don't Exist!",
            description: "Please log in to get access.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          localStorage.removeItem('userInfo');
          navigate('/login');
        }
        setLoading(false);
      } else {
        toast({
          title: "Unauthorized Access!",
          description: "Please log in to get access.",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        navigate('/login');
        setLoading(false);
      }
    };
    fetchData(); // Call the async Function immediately
  }, []);

  if (loading) {
    return <Loader2 />;
  }

  return (
    <div className="changePassword" style={{ height: props.windowSize[1] - 2 }}>
      <div className="changePasswordPopup">
        <div className="instructions">
          <h1>Change Password</h1>
          <p>Password must contain:</p>
          <ul className="instructionsForPassword">
            <li className="instructionsItems">At least 8 characters</li>
            <li className="instructionsItems">At least 1 number (0 - 9)</li>
            <li className="instructionsItems">At least 1 special character .-$*#@!+</li>
          </ul>
        </div>
        <div className="inputBoxes">
          <form style={{display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto'}}>
            <InputGroup size='md' style={{ margin: '5px 0px' }} className='inputFields'>
              <Input
                pr='4.5rem'
                type={showOldPassword ? 'text' : 'password'}
                placeholder='Old Password'
                bg="white"
                borderColor="#cbd0dd"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete='off'
                id='oldPassword'
                style={{ fontSize: '15px', fontFamily: 'system-ui' }}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleOldPasswordClick} bg='white'>
                  {showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <InputGroup size='md' style={{ margin: '5px 0px' }} className='inputFields'>
              <Input
                pr='4.5rem'
                type={showNewPassword ? 'text' : 'password'}
                placeholder='New Password'
                bg="white"
                borderColor="#cbd0dd"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete='off'
                id='newPassword'
                style={{ fontSize: '15px', fontFamily: 'system-ui' }}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleNewPasswordClick} bg='white'>
                  {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <InputGroup size='md' style={{ margin: '5px 0px' }} className='inputFields'>
              <Input
                pr='4.5rem'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm Password'
                bg="white"
                borderColor="#cbd0dd"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete='off'
                id='confirmPassword'
                style={{ fontSize: '15px', fontFamily: 'system-ui' }}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleConfirmPasswordClick} bg='white'>
                  {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <div className='submitReset'>
              <Button colorScheme='blue' width='49%' onClick={handleSubmit} isLoading={changePasswordLoading}>Submit</Button>
              <Button colorScheme='blue' width='49%' onClick={handleReset}>Reset</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
