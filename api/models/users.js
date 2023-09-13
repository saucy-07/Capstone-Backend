const db = require("../config")
const{hash, compare, hashSync} = require('bcrypt')
const{createToken} = require('../middleware/AuthenticateUser')
class Users{
    fetchUsers(req, res){
        const query = `
        SELECT userID,
        firstName,
        lastName,
        gender,
        emailAddress,
        profileUrl,
        userPass
        FROM Users;
        `
        db.query(query, (err, results)=>{
            if(err) throw err
            res.json({
                status: res.statusCode, results
            })
        })
    }
    fetchUser(req, res){
        const query = `
        SELECT userID,
        firstName,
        lastName,
        gender,
        emailAddress,
        profileUrl,
        userPass
        FROM Users
        WHERE userID = ${req.params.id}; 
        `
        db.query(query, (err, results)=>{
            if(err) throw err
            res.json({
                status: res.statusCode, results
            })
        })
    }
    login(req, res){
    }
    async register(req, res){
        const data = req.body
        data.userPass = await hash(data.userPass, 15)
        const user = {
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            emailAddress: data.emailAddress,
            profileUrl: data.profileUrl,
            userPass: data.userPass
        }
        const query = `
        INSERT INTO Users
        SET ?;
        `
        db.query(query, [data], (err)=> {
            if(err) throw err
            let token = createToken(user)
            res.cookie("LegitUser", token,
            {
                maxAge: 360000,
                httpOnly: true
            })
        })
    }
    updateUser(req, res){
        const query = `
        UPDATE Users
        SET ?
        WHERE userID = ?
        `
        db.query(query, [req.body, req.params.id], (err)=> {
            if(err) throw err
            res.json({
                status:res.statusCode,
                msg: "The user record has been updated."
            })
        })
    }
    deleteUser(req, res){
        const query = `
        DELETE FROM Users
        WHERE userID = ${req.params.id};
        `
        db.query(query, (err)=> {
            if(err) throw err
            res.json({
                status: res.statusCode,
                msg: "A user record has been deleted."
            })
        })
    }
}
module.exports = Users