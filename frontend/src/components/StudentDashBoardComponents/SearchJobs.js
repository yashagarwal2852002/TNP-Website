import React, { useState, useEffect } from "react";
import { Box, Text, Avatar, Button, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialogCloseButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon, ExternalLinkIcon, ChevronUpIcon, CheckIcon } from '@chakra-ui/icons';
import './SearchJobs.css';
import axios from 'axios';
import Loader2 from './Loader2.js';

export default function SearchJobs(props) {
  const [jobList, setJobList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [applyLoadingId, setApplyLoadingId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Function to handle View Details of Job Posts
  const handleViewDetails = (jobId) => {
    setExpandedJob(jobId === expandedJob ? null : jobId);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
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
          setUserId(response.data.userId);
          console.log(response.data.jobs);
          setJobList(response.data.jobs.reverse());
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Unauthorized access: Token failed or expired
            localStorage.removeItem('userInfo');
            navigate('/login');
          } else {
            // Other errors: Network issue or server error
            toast({
              title: "Error Occurred!",
              description: "An unexpected error occurred. Please try again later.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }
        }
        finally {
          setApplyLoadingId(null);
        }
      } else {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      navigate('/login');
      setLoading(false);
    }
  };

  const isUserApplied = (applicants, userId) => {
    return applicants.includes(userId);
  };

  const handleApply = async () => {
    setApplyLoadingId(selectedJobId);
    setIsConfirmOpen(false);
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      if (!user || !user.token) {
        navigate('/login');
        localStorage.removeItem('userInfo');
        setApplyLoadingId(null);
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post('/api/jobs/applyJob', { jobId: selectedJobId }, config);
      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      // Refresh job list after applying
      fetchJobs();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized access: Token failed or expired
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        // Other errors: Network issue or server error
        toast({
          title: "Error Occurred!",
          description: "Apologies for the inconvenience. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };

  const onClose = () => setIsConfirmOpen(false);

  const onOpen = (jobId) => {
    setSelectedJobId(jobId);
    setIsConfirmOpen(true);
  };

  if (loading) {
    return <Loader2 />;
  }

  return (
    <div className="jobs" style={{ minHeight: props.windowSize[1] - 2 }}>
      {jobList.length === 0 ? (
        <div className="noJobsMessage">
          <pre>
            Currently no job opportunities available.{"\n"}
            Stay tuned for future updates!
          </pre>
        </div>
      ) : (
        jobList.map((job, index) => (
          <div key={index} className="jobItem">
            <Box className="firstBox">
              <Box>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Box>
                    <Avatar width='70px' height='70px' name={job.companyName} src={job.companyLogo} />
                  </Box>
                  <Box style={{ marginLeft: '20px' }}>
                    <Text className="companyName">{job.companyName}</Text>
                    <Text className="jobRole">{job.jobRole}</Text>
                    <Text className="location">{job.location}</Text>
                  </Box>
                </Box>
              </Box>
              <Box style={{ marginRight: '40px' }}>
                <Text className="locationType">{job.locationType}</Text>
                <Text className="salary">{job.salary}</Text>
                <Text className="jobType">{job.jobType}</Text>
              </Box>
            </Box>
            <Box className="secondBox">
              <Box className="skills">
                {job.skills.map((skill, idx) => (
                  <Text key={idx} className="skill">{skill}</Text>
                ))}
              </Box>
              <Box className="applyDate">
                <Box className="postDate">
                  <Text>Apply By {new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} · Posted {Math.floor((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - new Date(new Date(job.createdAt).getFullYear(), new Date(job.createdAt).getMonth(), new Date(job.createdAt).getDate())) / (1000 * 60 * 60 * 24))} Days Ago</Text>
                </Box>
                <Box className="buttonFunctions">
                  <Button onClick={() => handleViewDetails(job._id)}>
                    View Details {expandedJob === job._id ? <ChevronUpIcon style={{ fontSize: '22px', marginTop: '2.2px' }} /> : <ChevronDownIcon style={{ fontSize: '22px', marginTop: '2.2px' }} />}
                  </Button>
                  {
                    isUserApplied(job.applicants, userId) ? (
                      <Button style={{ background: '#edf2f7', cursor: 'not-allowed', opacity: '0.7' }}>
                        Applied &nbsp;<CheckIcon />
                      </Button>
                    ) : (
                      <Button colorScheme='blue' onClick={() => onOpen(job._id)} isLoading={applyLoadingId === job._id}>
                        Apply Now &nbsp;<ExternalLinkIcon fontSize="xl" fontWeight="bold" />
                      </Button>
                    )
                  }
                </Box>
              </Box>
            </Box>
            {expandedJob === job._id && (
              <Box className="thirdBox">
                {job.details}
              </Box>
            )}
          </div>
        ))
      )}
      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={undefined}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Apply
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to apply? Please make sure your resume is up to date.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" ml={3} onClick={handleApply}>
                Apply
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}