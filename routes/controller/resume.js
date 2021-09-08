const mongoose = require('mongoose');
var resumeModule = require('../../modules/resume');
const env = require('dotenv');
var pdf = require("pdf-creator-node");
var fs = require("fs");
const objectId = mongoose.Types.ObjectId;

env.config();

exports.addResume=(req,res)=>{
    const {
        FullName,
        Designation,
        Address,
        Contact,
        Email,
        SkillSets,
        Interests,
    PersonalStrengths,
    Social,
    About,
    Internship,
    Education,
    Projects,
    Achievements
    }  = req.body;

    var resumeDetails = new resumeModule({
        FullName,
        Designation,
        Address,
        Contact,
        Email,
        SkillSets,
        Interests,
        PersonalStrengths,
        Social,
        About,
        Internship,
        Education,
        Projects,
        Achievements
    })

    resumeDetails.save()
    .then(data=>{
        res.status(201).json({
            message:"Resume Added Successfully",
            resume:data
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}

exports.getResume = (req,res) =>{
    resumeModule.find({})
    .exec()
    .then(data=>{
        res.status(200).json({
            message:"OK",
            getResume:data
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}


exports.addProfile =(req,res)=>{

    var id= req.body._id;
    var profilepic =  req.file.location;
    resumeModule.findById(id,(err,data)=>{

        data.profile = profilepic?profilepic:data.profile;
        
     data.save()
    .then(doc=>{
        res.status(201).json({
            message:"Profile image updated Successfully!!",
            profile:doc,
            file:req.file
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
})
}

exports.generateResumePdf = (req,res) =>{
 
    const {resume } = req.body;
    const id = objectId(resume._id);

    var options = {
        format: "A4",
        orientation: "portrait",
        border: "8mm",
        color: "black",
        footer: {
            height: "2mm",
        },
    };

    // let pdfLogo = `${process.env.URL}/backend/public/images/PRATC-logo.png`;
    // let pdfLogo =
    //   path.join(__dirname, '..', '/public') + `/images/PRATC-logo.png`;
    // let appStore = 'https://localhost:8443/images/appstore.png';

    //console.log(pdfLogo);

    var fileName = "resumeform" + "-" + new Date().getTime();
    var html = fs.readFileSync(__dirname + "/resume.html", "utf8");
    var filePath = "pdf/" + fileName + ".pdf";

    // let fdate,tdate;

    // fdate = req.body.fromDate.split('-');
    // tdate = req.body.toDate.split('-');

    var document = {
        html: html,
        data: resume,
        path: "./public/uploads/" + filePath,
    };
    resumeModule.findById({_id:id})
    .then(resumepdf=>{
        if(resumepdf.pdf === ''){
    pdf.create(document, options).then(() => {
        resumeModule.findByIdAndUpdate({_id:id},{pdf:fileName})
        .then((p)=>{
        return res.status(201).json({
            status: true,
            message: "pdf generated successfully",
            fileName: fileName,
        });
      
    })
    .catch(err => {
        console.log('err', err)
        return res.status(400).json({
            success: false,
            errorMessage: 'Something went wrong',
            errorLog: err
        })
    })
    
})
    .catch(err => {
        console.log('err', err)
        return res.status(400).json({
            success: false,
            errorMessage: 'Something went wrong',
            errorLog: err
        })
    })
}
else{
    fs.unlink("./public/uploads/pdf/"+resumepdf.pdf+ ".pdf", (err) => {
        if (err) {
            console.log("failed to delete local image:"+err);
        } else {
            pdf.create(document, options).then(() => {
                resumeModule.findByIdAndUpdate({_id:id},{pdf:fileName})
                .then((p)=>{
                return res.status(201).json({
                    status: true,
                    message: "pdf generated successfully",
                    fileName: fileName,
                });
            })
            .catch(err => {
                console.log('err', err)
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Something went wrong',
                    errorLog: err
                })
            })
            
        })
            .catch(err => {
                console.log('err', err)
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Something went wrong',
                    errorLog: err
                })
            })
        }
})
}
})
.catch(err => {
    console.log('err', err)
    return res.status(400).json({
        success: false,
        errorMessage: 'Something went wrong',
        errorLog: err
    })
})
}

exports.downloadResumePdf = (req,res) =>{
    return res.download(`./public/uploads/pdf/${req.params.filename}.pdf`)
}