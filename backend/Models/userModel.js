const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firstName : {type : String, required : true},
    middleName : {type : String, default : ""},
    lastName : {type : String, default : ""},
    description : {type  : String, default : ""},
    scholarNo : {type : String, unique : true},
    scholarStatus : {type : String},
    fatherName : {type : String},
    motherName : {type : String},
    gender : {type : String},
    dateOfBirth : {type : Date},
    category : {type : String},
    community : {type : String},
    nationality : {type : String},
    aadharCardNo : {type : String},
    contactNo : {type : Number},
    email : {type : String, required : true, unique : true},
    course : {type : String},
    department : {type : String},
    specialization : {type : String},
    admissionYear : {type : Number},
    additionalContactNo : {type : Number},
    education: [{
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy : {type : String},
        startDate : {type : String},
        endDate : {type : String},
        grade : {type : Number},
    }],
    experience: [{
        title: { type: String, required: true },
        employmentType: { type: String, required: true },
        companyName : {type : String},
        location : {type : String},
        locationType : {type : String},
        currentlyWorking : {type : Boolean },
        startDate : {type : String},
        endDate : {type : String},
        description : {type : String},
        skills : [{type : String}],
        link : {type : String},
    }],
    project : [{
        projectName : {type : String},
        projectURL : {type : String},
        description : {type : String},
        currentlyWorking : {type : Boolean},
        startDate : {type : String},
        endDate : {type : String},
        contributors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    }],
    password: {type: String, required: true},
    role : {type : String, required : true},
    pic: {type: String, default: 
        "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"},
},
{
    timestamps: true
});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
const User = mongoose.model("User", userSchema);
module.exports = User;