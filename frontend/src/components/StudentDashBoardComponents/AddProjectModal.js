import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProjectModal.css';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input, Textarea, Checkbox, Select, Grid, Box, useToast} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import UserBadgeItem from '../useAvatar/userBadgeItem';
import UserListItem from '../useAvatar/userListItem';

export default function AddProjectModal({ children, setUser }) {
    const startYear = 1924;
    const currentYear = new Date().getFullYear();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [projectName, setProjectName] = useState('');
    const [projectURL, setProjectURL] = useState('');
    const [description, setDescription] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [projectstartMonth, setProjectStartMonth] = useState('');
    const [projectstartYear, setProjectStartYear] = useState('');
    const [projectendMonth, setProjectEndMonth] = useState('');
    const [projectendYear, setProjectEndYear] = useState('');
    const [search, setSearch] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addProjectLoading, setAddProjectLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    // This function will Handle the Save Button Functionality which will create the New Project Entry in the Logged in User with all Information
    const submitHandler = async () => {
        // Check if the checkbox is not checked and if end date fields are not filled
        if (!projectName || !projectURL || !projectstartMonth || !projectstartYear) {
            toast({
                title: "Please fill all the Required Fields!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }
        if (!isChecked && (!projectendMonth || !projectendYear)) {
            toast({
                title: "Please fill the End Date!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }

        setAddProjectLoading(true);
        let user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            if (user.token) {
                const projectData = {
                    projectName,
                    projectURL,
                    description,
                    projectstartMonth,
                    projectstartYear,
                    projectendMonth,
                    projectendYear,
                    currentlyWorking: isChecked,
                    contributors: selectedUsers.map(user => user._id),
                };
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const { data } = await axios.post("/api/user/addProject", projectData, config);
                    setUser(data);
                    setAddProjectLoading(false);
                    handleClose();
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
            setSearchLoading(false);
        }
    }

    // Function to alter the CheckBox isChecked Value
    const handleIsChecked = () => {
        setIsChecked(!isChecked);
    }

    // Function to reset all state values to their initial state
    const resetState = () => {
        setProjectName('');
        setProjectURL('');
        setDescription('');
        setIsChecked(false);
        setProjectStartMonth('');
        setProjectStartYear('');
        setProjectEndMonth('');
        setProjectEndYear('');
        setSearch('');
        setSearchLoading(false);
        setSearchResult([]);
        setSelectedUsers([]);
        setAddProjectLoading(false);
    };

    // Function to handle the close event of the modal
    const handleClose = () => {
        // Reset all state values
        resetState();
        // Close the modal
        onClose();
    };

    // Function to handle the Search Funtionality for contributors to be added in Projects
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something to search",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }

        setSearchLoading(true);
        let user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            if (user.token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const { data } = await axios.get(`/api/user?search=${search}`, config);
                    setSearchLoading(false);
                    setSearchResult(data);
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
            setSearchLoading(false);
        }
    };

    // This Functions handles the Click on Search Results
    const handleGroup = (userToAdd) => {
        if (selectedUsers.find((c) => c._id === userToAdd._id)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    // This Functions handle the delete operation from the selected users which shows as a badges
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={handleClose} className="addProjectModal" scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent maxWidth="700px" width="100%" ml="20px" mr="20px">
                    <ModalHeader style={{ borderBottom: '1px solid #cbd0dd' }}>Add New Project</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl className='projectName' isRequired mb="20px">
                            <FormLabel htmlFor='name' style={{ fontSize: '14px', color: "#404040c9", marginBottom: '0px', marginTop: '15px' }}>Project name</FormLabel>
                            <Input
                                id='name'
                                maxWidth="727px"
                                width="100%"
                                type="text"
                                height="40px"
                                fontSize="14px"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                autoComplete='off'
                            />
                        </FormControl>
                        <FormControl className='projectURL' isRequired mb="20px">
                            <FormLabel htmlFor='url' style={{ fontSize: '14px', color: "#404040c9", marginBottom: '0px', marginTop: '15px' }}>Project URL</FormLabel>
                            <Input
                                id='url'
                                type="text"
                                height="40px"
                                value={projectURL}
                                onChange={(e) => setProjectURL(e.target.value)}
                                autoComplete='off'
                                fontSize='14px'
                            />
                        </FormControl>
                        <FormControl className='description' mb="20px">
                            <FormLabel htmlFor='description' style={{ fontSize: '14px', color: "#404040c9", marginBottom: '0px', marginTop: '15px' }}>Description</FormLabel>
                            <Textarea
                                id='description'
                                resize='vertical'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                autoComplete='off'
                                fontSize="14px"
                            />
                        </FormControl>
                        <FormControl className='additionalDetails' mb="20px" isRequired>
                            <FormLabel htmlFor='additionalDetails' style={{ fontSize: '20px', fontWeight: 'bold' }}>Additional Details</FormLabel>
                            <Checkbox
                                id='additionalDetails'
                                isChecked={isChecked}
                                onChange={handleIsChecked}
                                color="#404040c9"
                            >
                                I am currently working on this project
                            </Checkbox>
                        </FormControl>
                        <FormControl className='startDate' mb="20px" isRequired>
                            <FormLabel htmlFor='startMonth' style={{ fontSize: '14px', color: "#404040c9", marginBottom: '0px', marginTop: '15px' }}>Start Date</FormLabel>
                            <Grid templateColumns='1fr 1fr' gap='4'>
                                <Select placeholder='Month' value={projectstartMonth} onChange={(e) => setProjectStartMonth(e.target.value)} id='startMonth' height='35px' style={{ fontSize: '14px', color: "#404040" }}>
                                    <option value='January'>January</option>
                                    <option value='February'>February</option>
                                    <option value='March'>March</option>
                                    <option value='April'>April</option>
                                    <option value='May'>May</option>
                                    <option value='June'>June</option>
                                    <option value='July'>July</option>
                                    <option value='August'>August</option>
                                    <option value='September'>September</option>
                                    <option value='October'>October</option>
                                    <option value='November'>November</option>
                                    <option value='December'>December</option>
                                </Select>
                                <Select placeholder='Year' value={projectstartYear} onChange={(e) => setProjectStartYear(e.target.value)} id='startYear' height='35px' style={{ fontSize: '14px', color: "#404040" }}>
                                    {[...Array(currentYear - startYear + 1)].map((_, index) => {
                                        const year = currentYear - index;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </Select>
                            </Grid>
                        </FormControl>
                        {(!isChecked ? <FormControl className='endDate' mb="20px" isRequired>
                            <FormLabel htmlFor='endMonth' style={{ fontSize: '14px', color: "#404040c9", marginBottom: '0px', marginTop: '15px' }}>End Date</FormLabel>
                            <Grid templateColumns='1fr 1fr' gap='4'>
                                <Select placeholder='Month' value={projectendMonth} onChange={(e) => setProjectEndMonth(e.target.value)} id='endMonth' height='35px' style={{ fontSize: '14px', color: "#404040" }}>
                                    <option value='January'>January</option>
                                    <option value='February'>February</option>
                                    <option value='March'>March</option>
                                    <option value='April'>April</option>
                                    <option value='May'>May</option>
                                    <option value='June'>June</option>
                                    <option value='July'>July</option>
                                    <option value='August'>August</option>
                                    <option value='September'>September</option>
                                    <option value='October'>October</option>
                                    <option value='November'>November</option>
                                    <option value='December'>December</option>
                                </Select>
                                <Select placeholder='Year' value={projectendYear} onChange={(e) => setProjectEndYear(e.target.value)} id='endYear' height='35px' style={{ fontSize: '14px', color: "#404040" }}>
                                    {[...Array(currentYear - startYear + 1)].map((_, index) => {
                                        const year = currentYear - index;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </Select>
                            </Grid>
                        </FormControl> : <></>)}
                        <FormControl className='addContributors' mb="20px">
                            <p style={{ fontSize: '18px', color: "#404040", marginBottom: '10px', marginTop: '25px', fontWeight: 'bold' }}>Add Contributors</p>
                            <Box mb={1} display="flex">
                                <Input
                                    placeholder="Search Contributors"
                                    value={search}
                                    mr={2}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        if (e.target.value === '') setSearchResult([]);
                                    }}
                                    autoComplete='off'
                                />
                                <Button onClick={handleSearch} isLoading={searchLoading}><SearchIcon /></Button>
                            </Box>
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {!searchLoading && searchResult
                            ?.slice(0, 4)
                            .map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => { handleGroup(user) }}
                                />
                            ))
                        }
                    </ModalBody>

                    <ModalFooter style={{ borderTop: '1px solid #cbd0dd' }}>
                        <Button isLoading={addProjectLoading} colorScheme='blue' onClick={submitHandler} type='submit'>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
