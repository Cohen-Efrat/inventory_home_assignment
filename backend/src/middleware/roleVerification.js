
const  authRole= (roles) =>{
    return (req, res, next) => {
        if(!req.user)
            return next()
        if (!roles.includes(req.user.role)) {
            res.status(403)
            return res.send({error:"Not Authorized"})
        }
        next()
    }
}

module.exports = {authRole}