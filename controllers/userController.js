const User = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    validationResult
} = require("express-validator")
const mongoose = require("mongoose")

const signUp = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const user = await User.findOne({
            username: req.body.username
        })
        if (user) {
            return res.json({
                msg: 'username already in use'
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role || 'basic'
        })
        await newUser.save()
        return res.json({
            msg: 'success, You can login now',
            _id: newUser._id,
        })
    } catch (err) {
        return res.json({
            msg: err.message
        })
    }
}

const signIn = async (req, res) => {
    try {
        // check for validatin errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        //get user from database
        const user = await User.findOne({
            username: req.body.username
        })
        // check if user exists
        if (!user) {
            return res.json({
                msg: 'username is not registered'
            })
        }
        // check for valid password
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            res.json({
                msg: "wrong password"
            })
        }
        const accessToken = jwt.sign({
            id: user._id,
            role: user.role,
            username: user.username
        }, process.env.SECRET, {
            expiresIn: 3600
        });
        return res.json({
            msg: 'success!',
            accessToken: accessToken,
        })
    } catch (err) {
        return res.json({
            msg: err.message
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        let id = req.params.id
        let isValid = mongoose.Types.ObjectId.isValid(id)
        if (!isValid) {
            console.log(isValid)
            throw new Error("invalid object id")
        }
        let status = await User.findByIdAndDelete({
            _id: id
        })
        if (!status) {
            return res.json({
                msg: `User does not Exists wit id:${id}`
            })
        }
        res.json({
            msg: "user deleted successfully"
        })
    } catch (err) {
        res.json({
            msg: err.message
        })
    }

}
const allUsers = async (req, res) => {
    try {
        let users = await User.find({})
        return res.json(users)
    } catch (err) {
        res.json({
            msg: err.message
        })
    }
}

module.exports = {
    signUp,
    signIn,
    deleteUser,
    allUsers
}