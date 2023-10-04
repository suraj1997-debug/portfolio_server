const mongoose = require('mongoose');
var projectModule = require('../../modules/project');
const slugify = require('slugify');
const shortid = require('shortid');
const env = require('dotenv');
// const {getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
// const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
// const { auth } = require('../../config/firebase.config');
// const path = require('path');


env.config();

const downloadUrl = async (storageRef) => {
    let resultUrl = "";
    await new Promise(async(resolve,reject) =>{
      let url = await getDownloadURL(storageRef);
      return url;
    }).then(data =>{
        resultUrl = data;
    }) 
    return resultUrl;
}

exports.addProject = async(req,res)=>{
    // const storageFB = getStorage();
    // await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);
    // console.log('req.files123', req.files);
    const {
        title,
        type,
        category,
        description,
        url
    } = req.body;
  
    const { frontend, admindashboard } = req.files;
    // let screenshots = [];

    // screenshots = req.files.map(file=>{
    //     return {img: file.filename}
    // })
    // let frontendUrl = [];
    // let dashboardUrl = [];
    if(frontend.length > 0){
        req.body.frontend = frontend.map((frontendPic,index)=> ({
            img: `${frontendPic.filename}`

        }))
       
    //    await frontend.map(async(frontendPic,index) => {
    //         const dateTime = Date.now();
    //         const extName =  path.extname(frontendPic.originalname).toLowerCase();
    //         const fileName = `websiteImages/image/${title}/${index+1}-${dateTime}.${extName}`;
    //         const storageRef = ref(storageFB, fileName);
    //         const metadata = {
    //             contentType : "image/jpeg"
    //         }

    //       await uploadBytesResumable(storageRef, frontendPic.buffer,metadata);

        //    const photoURL = await getDownloadURL(storageRef);
        //    const photoURL = await downloadUrl(storageRef);
        
        // //    console.log(`Website images fileData${index + 1}`, photoURL);
        //    photoURL && frontendUrl.push({img: `${photoURL}`});
        // })
    }

    if(admindashboard.length > 0){
        req.body.admindashboard = admindashboard.map((admindashboardPic,index)=> ({
            img: `${admindashboardPic.filename}`
        }))

    //   await admindashboard.map(async(admindashboardPic,index)=> {
        //     const dateTime = Date.now();
        //     const extName = path.extname(admindashboardPic.originalname).toLowerCase();
        //     const fileName = `adminDashboardImages/image/${title}/${index+1}-${dateTime}.${extName}`;
        //     const storageRef = ref(storageFB, fileName);
        //     const metadata = {
        //         contentType : "image/jpeg"
        //     }
          
        //    await uploadBytesResumable(storageRef, admindashboardPic.buffer,metadata);

        //    const photoURL = await getDownloadURL(storageRef);
           
        //    const photoURL = await downloadUrl(storageRef);
         
        //     // console.log(`Dashboard images fileData${index + 1}`, photoURL);
        //     photoURL && dashboardUrl.push({img: `${photoURL}`});
        //         // img: `${admindashboardPic.filename}`
        //     })
    }
    // req.body.frontend = frontendUrl && frontendUrl;
    // req.body.admindashboard =  dashboardUrl && dashboardUrl;
    // if(req.body.admindashboard && req.body.frontend){
   
    var ProjectDetails = new projectModule({
        projectTitle:title,
        slug:`${slugify(title)}-${shortid.generate()}`,
        category,
        projectType:type,
        description,
        url,
        frontend:req.body.frontend,
        admindashboard:req.body.admindashboard,
        date: new Date()
    });

    ProjectDetails.save()
    .then(project=>{
        res.status(201).json({
            message:"Project Added Successfully",
            project:project,
            files:req.files
        })
    }).catch(error=>{
        res.status(400).json({
            error:error
        })
    })
// }
    
}

exports.getProjects = (req,res)=>{
    projectModule.find()
    .sort({createdAt:-1})
    .select('_id projectTitle slug  projectType description url frontend admindashboard date category')
    .populate({path:'category',select:'_id Category slug'})
    .exec()
    .then(data=>{
        res.status(200).json({
            projects:data
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}

exports.getprojectBySlug=(req,res)=>{
    const {slug} = req.params;
    projectModule.findOne({slug:slug})
    .exec()
    .then(data=>{
        res.status(200).json({
            message:"Project Founded Successfully",
            project:data
        })
    })
    .catch(error=>{
        res.status(400).json({
            error:error
        })
    })
}