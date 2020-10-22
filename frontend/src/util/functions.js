
//change file name to helpr functions
const isRole=(roles,userRole)=>{
    if (!roles.includes(userRole)) {
        return false
    }
    return true
}


export {
    isRole
};
