import React, { useState, useEffect } from "react";
import { Button, Grid, GridItem, useToast } from "@chakra-ui/react";
import { Stack, Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Input, Text, Avatar } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from "@chakra-ui/react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import './JobPost.css';
import exportFromJSON from 'export-from-json';

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

/***************************************************************************************************/
/*******************************       Companies Details              *************************/
/***************************************************************************************************/

// Key add karni hai isme
const companies = [
    {
        id: "123456",
        year: 2024,
        branch: ["CSE"],
        postingDate: "2 days ago",
        companyName: "Microsoft",
        companyLogo: "http//asdf",
        jobRole: "SDE-INTERN",
        location: "Gurugram",
        locationType: "In-Office Job",
        salary: "4 LPA - 7 LPA",
        JobType: "6 month internship",
        deadline: "20 / 4 / 24 ",
        skills: ["C++", "Phyton", "Java"],
        description: "Add description here",
        applicants: [
            { id: "1", name: "Ajay", scholarNumber: "123" },
            { id: "2", name: "Pranshu", scholarNumber: "1234" },
            { id: "3", name: "Yash", scholarNumber: "12345" },
            { id: "4", name: "Shivam", scholarNumber: "123456" },
        ],
    },
    {
        id: "1234567",
        year: 2023,
        branch: ["CSE", "IT"],
        postingDate: "5 days ago",
        companyName: "Google",
        companyLogo: "http//asdf",
        jobRole: "Backend-INTERN",
        location: "Banglore",
        locationType: "Office - Flexible",
        salary: "15 LPA - 22 LPA",
        JobType: "6 month internship + PPO",
        deadline: "22 / 4 / 24 ",
        skills: ["React", "Node", "Java"],
        description: "Add description here",
        applicants: [
            { id: "1", name: "Ajay", scholarNumber: "123" },
            { id: "2", name: "Pranshu", scholarNumber: "1234" },
        ],
    },
    {
        id: "12345678",
        year: 2022,
        branch: ["CSE", "IT", "ECE"],
        postingDate: "5 days ago",
        companyName: "Apple",
        companyLogo: "http//asdf",
        jobRole: "Backend-INTERN",
        location: "Banglore",
        locationType: "Office - Flexible",
        salary: "15 LPA - 22 LPA",
        JobType: "6 month internship + PPO",
        deadline: "22 / 4 / 24 ",
        skills: ["React", "Node", "Java"],
        description: "Add description here",
        applicants: [
            { id: "3", name: "Yash", scholarNumber: "12345" },
            { id: "4", name: "Shivam", scholarNumber: "123456" },
        ],
    },
];

/***************************************************************************************************/
/*******************************     Companies Details Completion      *************************/
/***************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

/***************************************************************************************************/
/*******************************              Job             **************************************/
/***************************************************************************************************/
const fetchJobs = async (setCompaniesDetails) => {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
        if (user.token) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get('/api/jobs/', config);
                //   setUserId(response.data.userId);
                // console.log(response.data.userId);
                console.log(response.data.jobs.reverse());
                return response.data.jobs.reverse();
                // setCompaniesDetails(response.data.jobs.reverse());
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Unauthorized access: Token failed or expired
                    localStorage.removeItem('userInfo');
                    // navigate('/login');
                } else {
                    // Other errors: Network issue or server error
                    // toast({
                    //     title: "Error Occurred!",
                    //     description: "An unexpected error occurred. Please try again later.",
                    //     status: "error",
                    //     duration: 5000,
                    //     isClosable: true,
                    //     position: "bottom-left",
                    // });
                }
            }
            finally {
                //   setApplyLoadingId(null);
            }
        } else {
            localStorage.removeItem('userInfo');
            // navigate('/login');
        }
        setTimeout(() => {
            // setLoading(false);
        }, 1000);
    } else {
        // navigate('/login');
        //   setLoading(false);
    }
};
const handleDownload = (applicants) => {
    const applicantsCopy = applicants.map((user) => {
        // Create a deep copy of the user object
        const userCopy = JSON.parse(JSON.stringify(user));

        // Apply modifications to the user copy
        userCopy.education.forEach((edu, index) => {
            userCopy[`${edu.degree}_institution`] = edu.institution;
            userCopy[`${edu.degree}_degree`] = edu.degree;
            userCopy[`${edu.degree}_grade`] = edu.grade;
        });

        // Remove the education field if needed
        delete userCopy.education;
        delete userCopy._id;
        delete userCopy.pic;
        delete userCopy.__v;

        return userCopy;
    });

    console.log(applicantsCopy);
    const fileName = 'usersData';
    const exportType = exportFromJSON.types.csv;

    exportFromJSON({ data: applicantsCopy, fileName, exportType });
};


export default function Job() {
    const [filterBranch, setFilterBranch] = useState([]);
    const [filterYear, setFilterYear] = useState("");

    const [companiesDetails, setCompaniesDetails] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const fetchavlJobs = async () => {
        const avlJobs = await fetchJobs();
        console.log(avlJobs);
        setCompaniesDetails(avlJobs);
    }

    useEffect(() => {
        fetchavlJobs();
    }, []);

    return (
        <div className="jobStatus">
            <JobPostings
                filterBranch={filterBranch}
                setFilterBranch={setFilterBranch}
                filterYear={filterYear}
                setFilterYear={setFilterYear}
            />
            <JobPost
                filterBranch={filterBranch}
                filterYear={filterYear}
                companiesDetails={companiesDetails}
                setCompaniesDetails={setCompaniesDetails}
                isFormOpen={isFormOpen}
                setIsFormOpen={setIsFormOpen}
            />
        </div>
    );
}

/***************************************************************************************************/
/*******************************          Job Completion      **************************************/
/***************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

/***************************************************************************************************/
/*******************************      Job Postings Filteration             *************************/
/***************************************************************************************************/

function JobPostings({
    filterBranch,
    setFilterBranch,
    filterYear,
    setFilterYear,
}) {
    return (
        <div className="jobPostings">
            <div className="jobPostings__Title">Filter Postings</div>
            <Grid h="min" templateRows="1fr" templateColumns="1fr 1fr" gap={4}>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobFilterBranch setFilterBranch={setFilterBranch} />
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobFilterYear setFilterYear={setFilterYear} />
                </GridItem>
            </Grid>
        </div>
    );
}

function JobFilterYear({ setFilterYear }) {
    const [checkedItems, setCheckedItems] = React.useState([
        false,
        false,
        false,
        false,
        false,
        false,
    ]);

    const allChecked = checkedItems.every(Boolean);
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

    function handleOnSelectYear(arr) {
        const newYearArr = arr.reduce((indices, value, index) => {
            if (value) {
                indices.push(2026 - index);
            }
            return indices;
        }, []);
        // console.log(newYearArr);
        setCheckedItems(arr);
        setFilterYear(newYearArr);
    }

    return (
        <div className="jobFilterYear">
            <Grid h="min" templateRows="1fr 3fr" templateColumns="1fr 1fr" gap={4}>
                <GridItem h="min" rowSpan={1} colSpan={1} className="jobFilterGridItem">
                    <Checkbox
                        isChecked={allChecked}
                        isIndeterminate={isIndeterminate}
                        onChange={(e) =>
                            handleOnSelectYear([
                                e.target.checked,
                                e.target.checked,
                                e.target.checked,
                                e.target.checked,
                                e.target.checked,
                                e.target.checked,
                            ])
                        }
                    >
                        All Year
                    </Checkbox>
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1} />
                <GridItem h="min" rowSpan={1} colSpan={1} className="jobFilterGridItem">
                    <Checkbox
                        isChecked={checkedItems[0]}
                        onChange={(e) =>
                            handleOnSelectYear([
                                e.target.checked,
                                checkedItems[1],
                                checkedItems[2],
                                checkedItems[3],
                                checkedItems[4],
                                checkedItems[5],
                            ])
                        }
                    >
                        2026
                    </Checkbox>
                    <Checkbox
                        isChecked={checkedItems[1]}
                        onChange={(e) =>
                            handleOnSelectYear([
                                checkedItems[0],
                                e.target.checked,
                                checkedItems[2],
                                checkedItems[3],
                                checkedItems[4],
                                checkedItems[5],
                            ])
                        }
                    >
                        2025
                    </Checkbox>
                    <Checkbox
                        isChecked={checkedItems[2]}
                        onChange={(e) =>
                            handleOnSelectYear([
                                checkedItems[0],
                                checkedItems[1],
                                e.target.checked,
                                checkedItems[3],
                                checkedItems[4],
                                checkedItems[5],
                            ])
                        }
                    >
                        2024
                    </Checkbox>
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1} className="jobFilterGridItem">
                    <Stack pl={6} mt={1} spacing={1}>
                        <Checkbox
                            isChecked={checkedItems[3]}
                            onChange={(e) =>
                                handleOnSelectYear([
                                    checkedItems[0],
                                    checkedItems[1],
                                    checkedItems[2],
                                    e.target.checked,
                                    checkedItems[4],
                                    checkedItems[5],
                                ])
                            }
                        >
                            2023
                        </Checkbox>
                        <Checkbox
                            isChecked={checkedItems[4]}
                            onChange={(e) =>
                                handleOnSelectYear([
                                    checkedItems[0],
                                    checkedItems[1],
                                    checkedItems[2],
                                    checkedItems[3],
                                    e.target.checked,
                                    checkedItems[5],
                                ])
                            }
                        >
                            2022
                        </Checkbox>
                        <Checkbox
                            isChecked={checkedItems[5]}
                            onChange={(e) =>
                                handleOnSelectYear([
                                    checkedItems[0],
                                    checkedItems[1],
                                    checkedItems[2],
                                    checkedItems[3],
                                    checkedItems[4],
                                    e.target.checked,
                                ])
                            }
                        >
                            2021
                        </Checkbox>
                    </Stack>
                </GridItem>
            </Grid>
        </div>
    );
}

function JobFilterBranch({ setFilterBranch }) {
    const [checkedItems, setCheckedItems] = React.useState([false, false, false]);

    const allChecked = checkedItems.every(Boolean);
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

    function handleOnSelectBranch(arr) {
        const newBranchArr = arr.reduce((indices, value, index) => {
            if (value) {
                if (index === 0) indices.push("Computer Science Engineering");
                if (index === 1) indices.push("Information Technology");
                if (index === 2) indices.push("Electronics and Communication Engineering");
            }
            return indices;
        }, []);
        // console.log(newBranchArr);
        setCheckedItems(arr);
        setFilterBranch(newBranchArr);
    }

    return (
        <div className="jobFilterYear">
            <Grid h="min" templateRows="1fr 3fr" templateColumns="1fr 1fr">
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <Checkbox
                        isChecked={allChecked}
                        isIndeterminate={isIndeterminate}
                        onChange={(e) =>
                            handleOnSelectBranch([
                                e.target.checked,
                                e.target.checked,
                                e.target.checked,
                            ])
                        }
                    >
                        All Branches
                    </Checkbox>
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1} />
                <GridItem h="min" rowSpan={1} colSpan={1} />
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <Stack pl={6} mt={1} spacing={1}>
                        <Checkbox
                            isChecked={checkedItems[0]}
                            onChange={(e) =>
                                handleOnSelectBranch([
                                    e.target.checked,
                                    checkedItems[1],
                                    checkedItems[2],
                                ])
                            }
                        >
                            CSE
                        </Checkbox>
                        <Checkbox
                            isChecked={checkedItems[1]}
                            onChange={(e) =>
                                handleOnSelectBranch([
                                    checkedItems[0],
                                    e.target.checked,
                                    checkedItems[2],
                                ])
                            }
                        >
                            IT
                        </Checkbox>
                        <Checkbox
                            isChecked={checkedItems[2]}
                            onChange={(e) =>
                                handleOnSelectBranch([
                                    checkedItems[0],
                                    checkedItems[1],
                                    e.target.checked,
                                ])
                            }
                        >
                            ECE
                        </Checkbox>
                    </Stack>
                </GridItem>
            </Grid>
        </div>
    );
}

/***************************************************************************************************/
/*******************************  Job Postings Filteration Completion      *************************/
/***************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////

/***************************************************************************************************/
/*******************************            Job Postings                   *************************/
/***************************************************************************************************/

function JobPost({
    filterBranch,
    filterYear,
    companiesDetails,
    setCompaniesDetails,
    isFormOpen,
    setIsFormOpen,
}) {
    function shouldRenderComponent(c, filterBranch, filterYear) {
        return (
            filterBranch.some((branch) => c.allowedBranches.includes(branch)) &&
            filterYear.includes(c.allowedYear)
        );
    }

    return (
        <>
            {isFormOpen ? (
                <JobAddition
                    companiesDetails={companiesDetails}
                    setCompaniesDetails={setCompaniesDetails}
                    setIsFormOpen={setIsFormOpen}
                />
            ) : (
                <JobAddForm setIsFormOpen={setIsFormOpen} />
            )}
            {companiesDetails.map((c) =>
                shouldRenderComponent(c, filterBranch, filterYear) ? (

                    <JobCollection
                        companiesDetails={companiesDetails}
                        setCompaniesDetails={setCompaniesDetails}
                        setIsFormOpen={setIsFormOpen}
                        c={c}
                    />
                ) : (
                    <></>
                )
            )}
        </>
    );
}

function JobCollection({ companiesDetails, setCompaniesDetails, c }) {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <>
            {isEditing ? (
                <JobItemsEdit
                    companiesDetails={companiesDetails}
                    setCompaniesDetails={setCompaniesDetails}
                    setIsEditing={setIsEditing}
                    c={c}
                />
            ) : (
                <JobItems
                    id={c._id}
                    year={c.allowedYear}
                    branch={c.allowedBranches}
                    logo={c.companyLogo}
                    name={c.companyName}
                    jobRole={c.jobRole}
                    location={c.location}
                    locationType={c.locationType}
                    salary={c.salary}
                    JobType={c.JobType}
                    postingDate={c.createdAt}
                    deadline={c.deadline}
                    skills={c.skills}
                    description={c.details}
                    applicants={c.applicants}
                    setIsEditing={setIsEditing}
                />
            )}
        </>
    );
}

/***************************************************************************************************/
/*******************************         Job Postings Complete             *************************/
/***************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

/***************************************************************************************************/
/*******************************         Job Addition Form                 *************************/
/***************************************************************************************************/

function JobAddForm({ setIsFormOpen }) {
    function handleFormClick(e) {
        setIsFormOpen((s) => !s);
    }
    return (
        <div className="jobFrom">
            <span className="jobForm__Title" onClick={(e) => handleFormClick(e)}>
                NEW FORM ➕
            </span>
        </div>
    );
}

function JobAddition({ setCompaniesDetails, setIsFormOpen }) {
    const [jobYear, setJobYear] = useState([]);
    const [jobBranch, setJobBranch] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyLogo, setCompanyLogo] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [location, setLocation] = useState("");
    const [locationType, setLocationType] = useState("");
    const [salary, setSalary] = useState("");
    const [JobType, setJobType] = useState("");
    const [deadline, setDeadline] = useState("");
    const [skills, setSkills] = useState("");
    const [jobAddDescription, setJobAddDescription] = useState("");

    return (
        <div className="jobAddition">
            <JobAddHeaderAddSaveAndDelete
                jobYear={jobYear}
                jobBranch={jobBranch}
                companyName={companyName}
                companyLogo={companyLogo}
                jobRole={jobRole}
                location={location}
                locationType={locationType}
                salary={salary}
                JobType={JobType}
                deadline={deadline}
                skills={skills}
                jobAddDescription={jobAddDescription}
                setJobYear={setJobYear}
                setJobBranch={setJobBranch}
                setCompanyName={setCompanyName}
                setCompanyLogo={setCompanyLogo}
                setJobRole={setJobRole}
                setLocation={setLocation}
                setLocationType={setLocationType}
                setSalary={setSalary}
                setJobType={setJobType}
                setDeadline={setDeadline}
                setSkills={setSkills}
                setJobAddDescription={setJobAddDescription}
                setCompaniesDetails={setCompaniesDetails}
                setIsFormOpen={setIsFormOpen}
            />
            <JobAddYear jobYear={jobYear} setJobYear={setJobYear} />
            <JobAddBranch jobBranch={jobBranch} setJobBranch={setJobBranch} />
            <JobAddCompany
                companyName={companyName}
                setCompanyName={setCompanyName}
            />
            <JobAddCompanyLogo
                companyLogoLink={companyLogo}
                setCompanyLogoLink={setCompanyLogo}
            />
            <JobAddRole jobRole={jobRole} setJobRole={setJobRole} />
            <JobAddLocation location={location} setLocation={setLocation} />
            <JobAddlocationType
                locationType={locationType}
                setLocationType={setLocationType}
            />
            <JobAddSalary salary={salary} setSalary={setSalary} />
            <JobAddJobType JobType={JobType} setJobType={setJobType} />
            <JobAddDeadline deadline={deadline} setDeadline={setDeadline} />
            <JobAddSkills skills={skills} setSkills={setSkills} />
            <JobAddDescription
                jobAddDescription={jobAddDescription}
                setJobAddDescription={setJobAddDescription}
            />
        </div>
    );
}

function JobAddHeaderAddSaveAndDelete({
    jobYear,
    jobBranch,
    companyName,
    companyLogo,
    jobRole,
    location,
    locationType,
    salary,
    JobType,
    deadline,
    skills,
    jobAddDescription,
    setJobYear,
    setJobBranch,
    setCompanyName,
    setCompanyLogo,
    setJobRole,
    setLocation,
    setLocationType,
    setSalary,
    setJobType,
    setDeadline,
    setSkills,
    setJobAddDescription,
    setCompaniesDetails,
    setIsFormOpen,
}) {
    return (
        <div className="jobHeader">
            <Grid h="min" templateRows="1fr" templateColumns="1fr 1.5fr 1fr" gap={4}>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobDelete
                        setJobYear={setJobYear}
                        setJobBranch={setJobBranch}
                        setCompanyName={setCompanyName}
                        setCompanyLogo={setCompanyLogo}
                        setJobRole={setJobRole}
                        setLocation={setLocation}
                        setLocationType={setLocationType}
                        setSalary={setSalary}
                        setJobType={setJobType}
                        setDeadline={setDeadline}
                        setSkills={setSkills}
                        setJobAddDescription={setJobAddDescription}
                        setIsFormOpen={setIsFormOpen}
                    />
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1} className="JobHeader__title">
                    NEW FORM
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobSave
                        jobYear={jobYear}
                        jobBranch={jobBranch}
                        companyName={companyName}
                        companyLogo={companyLogo}
                        jobRole={jobRole}
                        location={location}
                        locationType={locationType}
                        salary={salary}
                        JobType={JobType}
                        deadline={deadline}
                        skills={skills}
                        jobAddDescription={jobAddDescription}
                        setJobYear={setJobYear}
                        setJobBranch={setJobBranch}
                        setCompanyName={setCompanyName}
                        setCompanyLogo={setCompanyLogo}
                        setJobRole={setJobRole}
                        setLocation={setLocation}
                        setLocationType={setLocationType}
                        setSalary={setSalary}
                        setJobType={setJobType}
                        setDeadline={setDeadline}
                        setSkills={setSkills}
                        setJobAddDescription={setJobAddDescription}
                        setCompaniesDetails={setCompaniesDetails}
                        setIsFormOpen={setIsFormOpen}
                    />
                </GridItem>
            </Grid>
        </div>
    );
}

function JobDelete({
    setJobYear,
    setJobBranch,
    setCompanyName,
    setCompanyLogo,
    setJobRole,
    setLocation,
    setLocationType,
    setSalary,
    setJobType,
    setDeadline,
    setSkills,
    setJobAddDescription,
    setIsFormOpen,
}) {
    function handleDeleteForm(e) {
        setJobYear([]);
        setJobBranch("");
        setCompanyName("");
        setCompanyLogo("");
        setJobRole("");
        setLocation("");
        setLocationType("");
        setSalary("");
        setJobType("");
        setDeadline("");
        setSkills("");
        setJobAddDescription("");
        setIsFormOpen((s) => !s);
    }
    return (
        <div className="jobDelete" onClick={(e) => handleDeleteForm(e)}>
            {" "}
            Delete ❌
        </div>
    );
}

function JobSave({
    jobYear,
    jobBranch,
    companyName,
    companyLogo,
    jobRole,
    location,
    locationType,
    salary,
    JobType,
    deadline,
    skills,
    jobAddDescription,
    setJobYear,
    setJobBranch,
    setCompanyName,
    setCompanyLogo,
    setJobRole,
    setLocation,
    setLocationType,
    setSalary,
    setJobType,
    setDeadline,
    setSkills,
    setJobAddDescription,
    setCompaniesDetails,
    setIsFormOpen,
}) {

    const handleSave = async (e) => {
        let newCompany = {
            companyName: companyName,
            companyLogo: companyLogo,
            jobRole: jobRole,
            jobType: JobType,
            location: location,
            locationType: locationType,
            salary: salary,
            deadline: deadline,
            skills: skills ? skills : [],
            details: jobAddDescription,
            allowedBranches: jobBranch ? jobBranch : [],
            allowedYear: jobYear,
        };
        // console.log(newCompany);
        let user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            if (user.token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const response = await axios.post('/api/jobs/addJob/', newCompany, config);
                    // console.log(response);
                    const avljobs = await fetchJobs();
                    // console.log(avljobs);
                    setCompaniesDetails(avljobs.reverse());
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        // Unauthorized access: Token failed or expired
                        localStorage.removeItem('userInfo');
                        // navigate('/login');
                    } else {
                        // Other errors: Network issue or server error
                        // toast({
                        //   title: "Error Occurred!",
                        //   description: "An unexpected error occurred. Please try again later.",
                        //   status: "error",
                        //   duration: 5000,
                        //   isClosable: true,
                        //   position: "bottom-left",
                        // });
                    }
                }
                finally {
                    //   setApplyLoadingId(null);
                }
            } else {
                localStorage.removeItem('userInfo');
                // navigate('/login');
            }
            setTimeout(() => {
                // setLoading(false);
            }, 1000);
        } else {
            //   navigate('/login');
            //   setLoading(false);
        }
        setJobYear("");
        setJobBranch("");
        setCompanyName("");
        setCompanyLogo("");
        setJobRole("");
        setLocation("");
        setLocationType("");
        setSalary("");
        setJobType("");
        setDeadline("");
        setSkills("");
        setJobAddDescription("");
        setIsFormOpen((s) => !s);
    }
    return (
        <div className="jobSave" onClick={(e) => handleSave(e)}>
            SAVE ✔️
        </div>
    );
}

function JobFormComponent({ text, value, placeholder, OnChange }) {
    return (
        <div className="jobAddComponent">
            <Text mb="8px" className="jobComponentText">
                {text}
            </Text>
            <Input
                variant="filled"
                value={value}
                onChange={(e) => OnChange(e)}
                placeholder={placeholder}
                size="md"
            />
        </div>
    );

    //   return (
    //     <>
    //         <JobFormComponent text={} value={value} placeholder={} OnChange={}/>
    //     </>
    //   );
}

function JobAddYear({ jobYear, setJobYear }) {
    function handleAddYear(e) {
        setJobYear(e.target.value);
    }

    return (
        <div className="jobAddComponent">
            <Text mb="8px" className="jobComponentText">
                Job Year
            </Text>

            <NumberInput variant="filled" value={jobYear}>
                <NumberInputField
                    placeholder={"Add Job year in Number"}
                    onChange={handleAddYear}
                />
            </NumberInput>
        </div>
    );
}

function JobAddBranch({ jobBranch, setJobBranch }) {
    function handleAddBranch(e) {
        setJobBranch(e.target.value.split(" + "));
    }

    return (
        <div className="jobAddComponent">
            <Text mb="8px" className="jobComponentText">
                Branch
            </Text>
            <Select
                placeholder="Select option"
                onChange={(e) => handleAddBranch(e)}
                variant="filled"
            >
                <option value="Computer Science Engineering">Computer Science Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                <option value="Computer Science Engineering + Information Technology">
                    Computer Science Engineering + Information Technology
                </option>
                <option value="Computer Science Engineering + Information Technology + Electronics and Communication Engineering">
                    Computer Science Engineering + Information Technology + Electronics and Communication Engineering
                </option>
            </Select>
        </div>
    );
}

function JobAddCompany({ companyName, setCompanyName }) {
    const [value, setValue] = React.useState(companyName);
    function handleAddCompany(e) {
        setValue(e.target.value);
        setCompanyName(e.target.value);
    }

    return (
        <>
            <JobFormComponent
                text={"Company name"}
                value={value}
                placeholder={"Add Job years with spaces"}
                OnChange={handleAddCompany}
            />
        </>
    );
}

function JobAddCompanyLogo({ companyLogoLink, setCompanyLogoLink }) {
    const [value, setValue] = React.useState(companyLogoLink);
    function handleAddCompanyLogoLink(e) {
        setValue(e.target.value);
        setCompanyLogoLink(e.target.value);
    }

    return (
        <>
            <JobFormComponent
                text={"Company Logo Link"}
                value={value}
                placeholder={"Add Company Logo Link"}
                OnChange={handleAddCompanyLogoLink}
            />
        </>
    );
}

function JobAddRole({ jobRole, setJobRole }) {
    const [value, setValue] = React.useState(jobRole);

    function handleAddRole(e) {
        setValue(e.target.value);
        setJobRole(e.target.value);
    }

    return (
        <>
            <JobFormComponent
                text={"Job Role"}
                value={value}
                placeholder={"Add Job role"}
                OnChange={handleAddRole}
            />
        </>
    );
}

function JobAddLocation({ location, setLocation }) {
    const [value, setValue] = React.useState(location);

    function handleAddRole(e) {
        setValue(e.target.value);
        setLocation(e.target.value);
    }

    return (
        <>
            <JobFormComponent
                text={"Job Location"}
                value={value}
                placeholder={"Add Job locations"}
                OnChange={handleAddRole}
            />
        </>
    );
}

function JobAddlocationType({ locationType, setLocationType }) {
    const [value, setValue] = React.useState(locationType);

    function handleAddLocationType(e) {
        setValue(e.target.value);
        setLocationType(e.target.value);
    }

    return (
        <>
            <JobFormComponent
                text={"Job Location Type"}
                value={value}
                placeholder={"Add Job locations Type"}
                OnChange={handleAddLocationType}
            />
        </>
    );
}

function JobAddSalary({ salary, setSalary }) {
    const [value, setValue] = React.useState(salary);

    function handleAddSalary(e) {
        setValue(e.target.value);
        setSalary(e.target.value);
    }

    return (
        <>
            <JobFormComponent
                text={"Salary"}
                value={value}
                placeholder={"Set Salary Here"}
                OnChange={handleAddSalary}
            />
        </>
    );
}

function JobAddJobType({ JobType, setJobType }) {
    const [value, setValue] = React.useState(JobType);

    function handleAddJobType(e) {
        setValue(e.target.value);
        setJobType(e.target.value);
    }

    return (
        <>
            <JobFormComponent
                text={"Job Offer Type"}
                value={value}
                placeholder={"Set Job Type"}
                OnChange={handleAddJobType}
            />
        </>
    );
}

function JobAddDeadline({ deadline, setDeadline }) {
    //   const [value, setValue] = React.useState("");

    function handleAddDeadline(e) {
        setDeadline(e.target.value);
    }

    return (
        <div className="jobAddComponent">
            <Text mb="8px" className="jobComponentText">
                Deadline
            </Text>
            <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                variant="filled"
                onChange={(e) => handleAddDeadline(e)}
            />
        </div>
    );
}

function JobAddSkills({ skills, setSkills }) {
    const [value, setValue] = React.useState(skills);

    function handleAddSkills(e) {
        setValue(e.target.value);
        setSkills(e.target.value.split(" "));
    }

    return (
        <>
            <JobFormComponent
                text={"Skills"}
                value={value}
                placeholder={"Add Your Skills Here"}
                OnChange={handleAddSkills}
            />
        </>
    );
}

function JobAddDescription({ jobAddDescription, setJobAddDescription }) {
    const [value, setValue] = React.useState(jobAddDescription);

    function handleAddDescription(e) {
        setValue(e.target.value);
        setJobAddDescription(e.target.value);
    }

    return (
        <>
            <JobFormComponent
                text={"Description"}
                value={value}
                placeholder={"Add More details"}
                OnChange={handleAddDescription}
            />
        </>
    );
}

/***************************************************************************************************/
/*******************************         Job Addition Form Complete         ************************/
/***************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

/***************************************************************************************************/
/*******************************               Job Card                    *************************/
/***************************************************************************************************/

function JobItems({
    id,
    year,
    branch,
    logo,
    name,
    jobRole,
    location,
    locationType,
    salary,
    JobType,
    postingDate,
    deadline,
    skills,
    description,
    applicants,
    setIsEditing,
}) {
    function handleOnEdit(e) {
        setIsEditing((s) => !s);
    }

    return (
        <div className="jobDetailsInformation">
            <Grid
                h="min"
                templateRows="1fr"
                templateColumns="1fr  1fr"
                gap={4}
                mb="20px"
            >
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobYears year={year} />
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <div className="jobEdit">
                        <span className="jobEdit__Icon" onClick={(e) => handleOnEdit(e)}>
                            {" "}
                            ✒️
                        </span>
                    </div>
                </GridItem>
            </Grid>

            <Grid
                h="min"
                templateRows="1fr"
                templateColumns="1fr 1fr"
                gap={4}
                mb="20px"
            >
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobBranches branch={branch} />
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <PostingDate postingDate={postingDate} />
                </GridItem>
            </Grid>

            <Grid h="min" templateRows="1fr 1fr" templateColumns="1.5fr 1fr" gap={4}>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobProfile name={name} jobRole={jobRole} location={location} logo={logo}/>
                </GridItem>

                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobDetails
                        locationType={locationType}
                        salary={salary}
                        JobType={JobType}
                    />
                </GridItem>

                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobSkills skills={skills} />
                </GridItem>

                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobDeadline deadline={deadline} />
                </GridItem>
            </Grid>
            <Grid h="min" templateRows="repeat(1, 1fr)" templateColumns="1fr">
                <GridItem h="auto" rowSpan={1} colSpan={2}>
                    <Box>
                        <JobDescprition description={description} />
                    </Box>
                </GridItem>
            </Grid>
            <Grid h="min" templateRows="repeat(1, 1fr)" templateColumns="1fr">
                <GridItem h="auto" rowSpan={1} colSpan={2}>
                    <Box>
                        <JobApply applicants={applicants} id={id} />
                    </Box>
                </GridItem>
            </Grid>
        </div>
    );
}

function JobYears({ year }) {
    return (
        <div className="jobYears">
            <span className="jobYear">{year}</span>
        </div>
    );
}

function JobBranches({ branch }) {

    const branchAbbreviations = {
        "Information Technology": "IT",
        "Computer Science Engineering": "CSE",
        "Electronics and Communication Engineering": "ECE",
        // Add more branches and their abbreviations if needed
    };

    // Function to get the abbreviated form of a branch name
    const getAbbreviatedBranch = (branchName) => {
        return branchAbbreviations[branchName] || branchName; // Return abbreviation if found, otherwise return the original name
    };

    return (
        // Render function
        <div className="jobBranch">
            {branch.map((b) => (
                <span className="jobBranch__Name">{getAbbreviatedBranch(b)}</span>
            ))}
        </div>
    );
}

function PostingDate({ postingDate }) {
    return <div className="jobPostingDate">{postingDate}</div>;
}

function JobProfile({ name, jobRole, location, logo}) {
    return (
        <Grid templateColumns="auto 1fr" gap={1}>
            <GridItem colSpan={1}>
                <Avatar width='70px' height='70px' name={name} src={logo} />
            </GridItem>
            <GridItem colSpan={1}>
                <div className="jobNameRoleAndLocation">
                    <span className="jobName">{name}</span>
                    <span className="jobRole">{jobRole}</span>
                    <span className="jobLocation">{location}</span>
                </div>
            </GridItem>
        </Grid>
    );
}

function JobDetails({ locationType, salary, JobType }) {
    return (
        <div className="jobDetails">
            <span className="jobDetails__Type">{locationType}</span>
            <span>salary: {salary}</span>
            <span>{JobType}</span>
        </div>
    );
}

function JobSkills({ skills }) {
    return (
        <div className="skillList">
            {skills.map((s) => (
                <span className="skillItem">{s}</span>
            ))}
        </div>
    );
}

function JobDeadline({ deadline }) {
    return <div className="JobDeadline">Last date to apply: {deadline}</div>;
}

function JobDescprition({ description }) {
    return (
        <div>
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                                Job Description
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>{description}</AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

function JobApply({ applicants, id }) {
    return (
        <div>
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                                Applied Students
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <div className="jobApplicants__header">
                            <Grid templateColumns="0.25fr 0.25fr 1fr" gap={6}>
                                <GridItem w="100%" h="10">
                                    {" "}
                                    <span className="jobApplicants__Name">Student Name</span>
                                </GridItem>
                                <GridItem w="100%" h="10">
                                    <span className="jobApplicants__ScholarNumber">
                                        Scholar Number
                                    </span>
                                </GridItem>
                                <GridItem
                                    w="100%"
                                    h="10"
                                    className="jobApplicants__ViewProfile "
                                >
                                    <Button onClick={(e) => handleDownload(applicants)}>Download Data into CSV File</Button>
                                </GridItem>
                            </Grid>
                        </div>

                        {applicants.map((a) => (
                            <div className="jobApplicants">
                                <Grid templateColumns="0.25fr 0.25fr 1fr" gap={6}>
                                    <GridItem w="100%" h="10">
                                        {" "}
                                        <span className="jobApplicants__Name">{a.firstName + " " + a.lastName}</span>
                                    </GridItem>
                                    <GridItem w="100%" h="10">
                                        <span className="jobApplicants__ScholarNumber">
                                            {a.scholarNo}
                                        </span>
                                    </GridItem>
                                    <GridItem
                                        w="100%"
                                        h="10"
                                        className="jobApplicants__ViewProfile "
                                    >
                                        <button className="jobApplicants__Button">
                                            View Profile
                                        </button>
                                    </GridItem>
                                </Grid>
                            </div>
                        ))}

                        {/* <div className="jobApplicants__Profile">
                  <span className="jobApplicants__ProfileLogo">
                    {a.name.substring(0, 1)}
                  </span>
                  <span className="jobApplicants__Name">{a.name}</span>
                  <span className="jobApplicants__ScholarNumber">
                    {a.scholarNumber}
                  </span>
                </div>
                <button>View Profile</button> */}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

/***************************************************************************************************/
/*******************************          Job Card Completeion         *****************************/
/***************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

/***************************************************************************************************/
/*******************************             Job Card Edit                 *************************/
/***************************************************************************************************/

function JobItemsEdit({
    setIsEditing,
    companiesDetails,
    setCompaniesDetails,
    c,
}) {
    return (
        <div>
            <JobEditForm
                setIsEditing={setIsEditing}
                companiesDetails={companiesDetails}
                setCompaniesDetails={setCompaniesDetails}
                c={c}
            />
        </div>
    );
}

function JobEditForm({
    setIsEditing,
    companiesDetails,
    setCompaniesDetails,
    c,
}) {
    const [jobYear, setJobYear] = useState(c.allowedYear);
    const [jobBranch, setJobBranch] = useState(c.allowedBranches);
    const [companyName, setCompanyName] = useState(c.companyName);
    const [companyLogo, setCompanyLogo] = useState(c.companyLogo);
    const [jobRole, setJobRole] = useState(c.jobRole);
    const [location, setLocation] = useState(c.location);
    const [locationType, setLocationType] = useState(c.locationType);
    const [salary, setSalary] = useState(c.salary);
    const [JobType, setJobType] = useState(c.jobType);
    const [deadline, setDeadline] = useState(c.deadline);
    const [skills, setSkills] = useState(c.skills);
    const [jobAddDescription, setJobAddDescription] = useState(c.details);

    return (
        <>
            <div className="jobAddition">
                <JobUpdateEdit
                    jobId={c._id}
                    jobYear={jobYear}
                    jobBranch={jobBranch}
                    companyName={companyName}
                    companyLogoLink={companyLogo}
                    jobRole={jobRole}
                    location={location}
                    locationType={locationType}
                    salary={salary}
                    JobType={JobType}
                    deadline={deadline}
                    skills={skills}
                    jobAddDescription={jobAddDescription}
                    setJobYear={setJobYear}
                    setJobBranch={setJobBranch}
                    setCompanyName={setCompanyName}
                    setCompanyLogoLink={setCompanyLogo}
                    setJobRole={setJobRole}
                    setLocation={setLocation}
                    setLocationType={setLocationType}
                    setSalary={setSalary}
                    setJobType={setJobType}
                    setDeadline={setDeadline}
                    setSkills={setSkills}
                    setJobAddDescription={setJobAddDescription}
                    setCompaniesDetails={setCompaniesDetails}
                    setIsEditing={setIsEditing}
                />
                <JobAddYear jobYear={jobYear} setJobYear={setJobYear} />
                <JobAddBranch jobBranch={jobBranch} setJobBranch={setJobBranch} />
                <JobAddCompany
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                />
                <JobAddCompanyLogo
                    companyLogoLink={companyLogo}
                    setCompanyLogoLink={setCompanyLogo}
                />
                <JobAddRole jobRole={jobRole} setJobRole={setJobRole} />
                <JobAddLocation location={location} setLocation={setLocation} />
                <JobAddlocationType
                    locationType={locationType}
                    setLocationType={setLocationType}
                />
                <JobAddSalary salary={salary} setSalary={setSalary} />
                <JobAddJobType JobType={JobType} setJobType={setJobType} />
                <JobAddDeadline deadline={deadline} setDeadline={setDeadline} />
                <JobAddSkills skills={skills} setSkills={setSkills} />
                <JobAddDescription
                    jobAddDescription={jobAddDescription}
                    setJobAddDescription={setJobAddDescription}
                />
            </div>
        </>
    );
}

function JobUpdateEdit({
    jobId,
    jobYear,
    jobBranch,
    companyName,
    companyLogoLink,
    jobRole,
    location,
    locationType,
    salary,
    JobType,
    deadline,
    skills,
    jobAddDescription,
    setJobYear,
    setJobBranch,
    setCompanyName,
    setCompanyLogoLink,
    setJobRole,
    setLocation,
    setLocationType,
    setSalary,
    setJobType,
    setDeadline,
    setSkills,
    setJobAddDescription,
    setCompaniesDetails,
    setIsEditing,
}) {
    return (
        <div className="jobHeader">
            <Grid h="min" templateRows="1fr" templateColumns="1fr 1.5fr 1fr" gap={4}>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobDeleteEdit
                        jobId={jobId}
                        setJobYear={setJobYear}
                        setJobBranch={setJobBranch}
                        setCompanyName={setCompanyName}
                        setCompanyLogoLink={setCompanyLogoLink}
                        setJobRole={setJobRole}
                        setLocation={setLocation}
                        setLocationType={setLocationType}
                        setSalary={setSalary}
                        setJobType={setJobType}
                        setDeadline={setDeadline}
                        setSkills={setSkills}
                        setJobAddDescription={setJobAddDescription}
                        setCompaniesDetails={setCompaniesDetails}
                        setIsEditing={setIsEditing}
                    />
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1} className="JobHeader__title">
                    NEW FORM
                </GridItem>
                <GridItem h="min" rowSpan={1} colSpan={1}>
                    <JobSaveEdit
                        jobId={jobId}
                        jobYear={jobYear}
                        jobBranch={jobBranch}
                        companyName={companyName}
                        companyLogoLink={companyLogoLink}
                        jobRole={jobRole}
                        location={location}
                        locationType={locationType}
                        salary={salary}
                        JobType={JobType}
                        deadline={deadline}
                        skills={skills}
                        jobAddDescription={jobAddDescription}
                        setJobYear={setJobYear}
                        setJobBranch={setJobBranch}
                        setCompanyName={setCompanyName}
                        setCompanyLogoLink={setCompanyLogoLink}
                        setJobRole={setJobRole}
                        setLocation={setLocation}
                        setLocationType={setLocationType}
                        setSalary={setSalary}
                        setJobType={setJobType}
                        setDeadline={setDeadline}
                        setSkills={setSkills}
                        setJobAddDescription={setJobAddDescription}
                        setCompaniesDetails={setCompaniesDetails}
                        setIsEditing={setIsEditing}
                    />
                </GridItem>
            </Grid>
        </div>
    );
}

function JobDeleteEdit({
    jobId,
    setJobYear,
    setJobBranch,
    setCompanyName,
    setCompanyLogoLink,
    setJobRole,
    setLocation,
    setLocationType,
    setSalary,
    setJobType,
    setDeadline,
    setSkills,
    setJobAddDescription,
    setCompaniesDetails,
    setIsEditing,
}) {
    const handleDeleteForm = async (e) => {
        setJobYear([]);
        setJobBranch("");
        setCompanyName("");
        setCompanyLogoLink("");
        setJobRole("");
        setLocation("");
        setLocationType("");
        setSalary("");
        setJobType("");
        setDeadline("");
        setSkills("");
        setJobAddDescription("");

        console.log(jobId);
        let user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            if (user.token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const response = await axios.post('/api/jobs/deleteJob/', jobId, config);
                    if (response.data.message === "Job deleted successfully") {
                        const avljobs = await fetchJobs();
                        console.log(avljobs);
                        setCompaniesDetails(avljobs);
                    }

                    console.log(response);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        // Unauthorized access: Token failed or expired
                        localStorage.removeItem('userInfo');
                        // navigate('/login');
                    } else {
                        // Other errors: Network issue or server error
                        // toast({
                        //   title: "Error Occurred!",
                        //   description: "An unexpected error occurred. Please try again later.",
                        //   status: "error",
                        //   duration: 5000,
                        //   isClosable: true,
                        //   position: "bottom-left",
                        // });
                    }
                }
                finally {
                    //   setApplyLoadingId(null);
                }
            } else {
                localStorage.removeItem('userInfo');
                // navigate('/login');
            }
            setTimeout(() => {
                // setLoading(false);
            }, 1000);
        } else {
            //   navigate('/login');
            //   setLoading(false);
        }

        // setCompaniesDetails((c) => {
        //     let compaines = Object.assign([], c);

        //     return compaines.filter((obj) => obj.id !== jobId);
        // });

        setIsEditing((s) => !s);
    }
    return (
        <div className="jobDelete" onClick={(e) => handleDeleteForm(e)}>
            {" "}
            Delete ❌
        </div>
    );
}

function JobSaveEdit({
    jobId,
    jobYear,
    jobBranch,
    companyName,
    companyLogoLink,
    jobRole,
    location,
    locationType,
    salary,
    JobType,
    deadline,
    skills,
    jobAddDescription,
    setJobYear,
    setJobBranch,
    setCompanyName,
    setCompanyLogoLink,
    setJobRole,
    setLocation,
    setLocationType,
    setSalary,
    setJobType,
    setDeadline,
    setSkills,
    setJobAddDescription,
    setCompaniesDetails,
    setIsEditing,
}) {
    const handleSave = async (e) => {
        let newCompany = {
            jobId: jobId,
            companyName: companyName,
            companyLogo: companyLogoLink,
            jobRole: jobRole,
            jobType: JobType,
            location: location,
            locationType: locationType,
            salary: salary,
            deadline: deadline,
            skills: skills ? skills : [],
            details: jobAddDescription,
            allowedBranches: jobBranch ? jobBranch : [],
            allowedYear: jobYear,
        };

        let user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            if (user.token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const response = await axios.put('/api/jobs/editJob/', newCompany, config);
                    if (response.data.message === "Job updated successfully") {
                        const avljobs = await fetchJobs();
                        console.log(avljobs);
                        setCompaniesDetails(avljobs);
                    }

                    console.log(response);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        // Unauthorized access: Token failed or expired
                        localStorage.removeItem('userInfo');
                        // navigate('/login');
                    } else {
                        // Other errors: Network issue or server error
                        // toast({
                        //   title: "Error Occurred!",
                        //   description: "An unexpected error occurred. Please try again later.",
                        //   status: "error",
                        //   duration: 5000,
                        //   isClosable: true,
                        //   position: "bottom-left",
                        // });
                    }
                }
                finally {
                    //   setApplyLoadingId(null);
                }
            } else {
                localStorage.removeItem('userInfo');
                // navigate('/login');
            }
            setTimeout(() => {
                // setLoading(false);
            }, 1000);
        } else {
            //   navigate('/login');
            //   setLoading(false);
        }
        setJobYear("");
        setJobBranch("");
        setCompanyName("");
        setCompanyLogoLink("");
        setJobRole("");
        setLocation("");
        setLocationType("");
        setSalary("");
        setJobType("");
        setDeadline("");
        setSkills("");
        setJobAddDescription("");
        setIsEditing((s) => !s);
    }
    return (
        <div className="jobSave" onClick={(e) => handleSave(e)}>
            SAVE ✔️
        </div>
    );
}

/***************************************************************************************************/
/*******************************        Job Card Edit Completion           *************************/
/***************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
