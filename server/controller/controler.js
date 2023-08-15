
exports.sessionChecker = (req, res, next)=> {
    
    if(!req.session.userId){
        
          res.redirect('/')
    }else{
          next()
    }
}
