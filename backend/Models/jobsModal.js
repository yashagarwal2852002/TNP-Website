const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    companyName: { type: String, required: true },
    companyLogo: {type : String, default: "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"},
    jobRole: { type: String, required: true },
    jobType: { type: String, required: true },
    location: { type: String, required: true },
    locationType: { type: String, required: true },
    salary: { type: String, required: true },
    deadline: { type: Date, required: true },
    skills: [{ type: String }],
    details: { type: String },
    allowedBranches: [{type: String}],
    allowedYear: {type : Number},
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
{
    timestamps: true
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
