const mongoose = require('mongoose');
const userModule = require('../../../modules/user');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const bcrypt = require('bcrypt');

env.config();

exports.signup = (req, res) => {
    userModule.findOne({ email: req.body.email })
        .exec(async(err, user) => {
            if (user) {
                return res.status(400).json({
                    error: "User Already Registered"
                });
            }

            const {
                firstname,
                lastname,
                email,
                password,
                confirmpassword
            } = req.body;

            if (password === confirmpassword) {
                const hash_password = await bcrypt.hash(password, 10);
                const userDetails = new userModule({
                    firstname,
                    lastname,
                    email,
                    hash_password,
                    username: shortid.generate(),
                    role: 'admin'
                })

                userDetails.save()
                    .then(data => {
                        res.status(201).json({
                            message: "Admin Created Successfully",
                            result: data
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            message: "Something  went wrong",
                            error: err
                        })
                    })
            }

        })
}


exports.login = (req, res) => {
    userModule.findOne({ email: req.body.email })
        .exec(async(error, user) => {
            if (error) return res.status(400).json({ error });
            if (user) {
                const isPassword = await user.authenticate(req.body.password);
                if (isPassword && user.role === 'admin') {
                    const token = jwt.sign(
                        {
                            _id: user._id,
                            role: user.role,
                            firstname: user.firstname
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '1d'
                        });
                    res.cookie(token, 'token', { expiresIn: '1d' });

                    const { _id, firstname, lastname, email, role, fullname } = user;

                    res.status(200).json({
                        token: token,
                        user: {
                            _id, firstname, lastname, email, role, fullname
                        }
                    });
                }
                else {
                    return res.status(400).json({
                        message: "Invalid Password"
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: "Something went wrong"
                })
            }
        });
}

exports.logout=(req,res)=>{
    res.clearCookie('token');
    res.status(202).json({
        message:"User LoggedOut Successfully"
    })
}

