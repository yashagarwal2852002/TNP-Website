const Job = require('../Models/jobsModal.js');
const User = require('../Models/userModel.js');

const allJobs = async (req, res) => {
    try {
        let query = {};

        // Check if the user is a student
        if (req.user.role === 'Student') {
            // Calculate the graduation year by adding 4 to the admission year
            const graduationYear = req.user.admissionYear + 4;

            // Construct the query to find jobs based on the user's specialization and graduation year
            query = {
                $and: [
                    { allowedBranches: { $in: req.user.specialization } }, // Use $in to match any of the user's specializations
                    { allowedYear: graduationYear }
                ]
            };
        }

        // Fetch all jobs based on the constructed query
        let jobs;
        if(req.user.role == "Student"){
            jobs = await Job.find(query);
        } else{
            jobs = await Job.find().populate('applicants', '-password -additionalContactNo -admissionYear -category -community -createdAt -experience -project -role -scholarStatus -updatedAt -department -description');
        }
        const responseData = {
            jobs: jobs,
            userId: req.user._id
        };

        // Send the jobs data along with user ID in the response
        res.json(responseData);
    } catch (error) {
        // If an error occurs, send a 500 status code with the error message
        res.status(500).json({ error: error.message });
    }
};


const applyJob = async (req, res) => {
    try {
        // Get the user ID from req.user
        const userId = req.user._id;
        
        // Get the job ID from req.body
        const jobId = req.body.jobId;

        // Find the job by ID
        const job = await Job.findById(jobId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        // Check if the user already applied for this job
        if (job.applicants.includes(userId)) {
            return res.status(400).json({ error: "User already applied for this job" });
        }

        // Add the user ID to the applicants array
        job.applicants.push(userId);

        // Save the updated job details
        await job.save();

        // Send a success response
        res.json({ message: "Applied successfully" });
    } catch (error) {
        // If an error occurs, send a 500 status code with the error message
        res.status(500).json({ error: error.message });
    }
};


const addJob = async (req, res) => {
    try {
        // Check if user is authorized to add a job
        // if (req.user.role !== 'Student') {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }

        // Extract job details from the request body
        const {
            companyName,
            companyLogo,
            jobRole,
            jobType,
            location,
            locationType,
            salary,
            deadline,
            skills,
            details,
            allowedBranches,
            allowedYear
        } = req.body;

        console.log(jobType);

        // Create a new Job document
        const newJob = new Job({
            companyName,
            companyLogo,
            jobRole,
            jobType,
            location,
            locationType,
            salary,
            deadline,
            skills,
            details,
            allowedBranches,
            allowedYear,
            postedBy: req.user._id, // Assuming postedBy is the ID of the authenticated user
            applicants: [] // Initialize applicants as an empty array
        });

        // Save the new job to the database
        const savedJob = await newJob.save();
        // Send a success response with the saved job object
        res.status(201).json(savedJob);
    } catch (error) {
        // If an error occurs, send a 500 status code with the error message
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};


const editJob = async (req, res) => {
    try {
      // Assuming the updated job information is sent from the frontend in the request body
      const updatedJobData = req.body;
      console.log(updatedJobData);
  
    //   // Extract the jobId from the updated job data
      const { jobId } = updatedJobData;
  
    //   // Find the job in your database using the jobId
      const existingJob = await Job.findById(jobId);
  
    //   // Check if the job exists
      if (!existingJob) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
    //   // Update the existing job with the updated job data
    //   // You may want to validate and sanitize the updated job data before updating
    //   // For simplicity, I'm assuming the updatedJobData contains all the fields needed to update the job
    //   Object.assign(existingJob, updatedJobData);
  
    // Update specific fields in the existing job with the updated job data
if (updatedJobData.companyName !== undefined) {
    existingJob.companyName = updatedJobData.companyName;
  }
  if (updatedJobData.companyLogo !== undefined) {
    existingJob.companyLogo = updatedJobData.companyLogo;
  }
  if (updatedJobData.jobRole !== undefined) {
    existingJob.jobRole = updatedJobData.jobRole;
  }
  if (updatedJobData.jobType !== undefined) {
    existingJob.jobType = updatedJobData.jobType;
  }
  if (updatedJobData.location !== undefined) {
    existingJob.location = updatedJobData.location;
  }
  if (updatedJobData.locationType !== undefined) {
    existingJob.locationType = updatedJobData.locationType;
  }
  if (updatedJobData.salary !== undefined) {
    existingJob.salary = updatedJobData.salary;
  }
  if (updatedJobData.deadline !== undefined) {
    existingJob.deadline = updatedJobData.deadline;
  }
  if (updatedJobData.skills !== undefined) {
    existingJob.skills = updatedJobData.skills;
  }
  if (updatedJobData.details !== undefined) {
    existingJob.details = updatedJobData.details;
  }
  if (updatedJobData.allowedBranches !== undefined) {
    existingJob.allowedBranches = updatedJobData.allowedBranches;
  }
  if (updatedJobData.allowedYear !== undefined) {
    existingJob.allowedYear = updatedJobData.allowedYear;
  }
  
    //   // Save the updated job
      await existingJob.save();
  
    //   // Fetch all the jobs after updating the existing job
    //   const allJobs = await JobModel.find();
  
      // Send the updated job or all jobs back to the frontend
      res.status(200).json({ message: 'Job updated successfully'});
    } catch (error) {
      console.error('Error editing job:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        // Convert jobId to ObjectId
        const jobIdObject = ObjectId(jobId);
        await Job.findOneAndDelete({ _id: jobIdObject });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { allJobs, addJob, editJob, applyJob, deleteJob };