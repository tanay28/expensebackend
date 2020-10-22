const request = require('request');

module.exports = function(req,res,next){

    var jwt = require('jsonwebtoken');
    //let API_SECRET = process.env.API_SECRET;

    //console.log(process.env);
    let API_SECRET = "TANAY123";
    let token = req.headers['authorization'];
    
    let tokArr = token.split(" ");
   
    if(tokArr[1].length>0){
        token = tokArr[1];
    }
    //console.log("token1",token);
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token,API_SECRET,function (err, decoded) {
        //console.log(err);
		if (err) {
			return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
		} else {

            var refreshedToken = jwt.sign(
                {
                    id    : decoded._id,
                    role  : decoded.role,
                    email : decoded.email,
                    name  : decoded.firstname
                },
                API_SECRET,
                {
                    expiresIn: '2m'  // expires in 24 hours 86400
                }   
            );
			next();


		}
	})
}