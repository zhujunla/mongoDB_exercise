var LoginInterception = function (req, res, next) {
    var url = req.originalUrl;
    // console.info(req);
    if(url != '/com/user_login/login' && url != '/com/user_login/register'){
        var session_id_header = req.headers.session_id;
        if(!req.session || !session_id_header){
            return res.send({code:-1,msg:'未登录'});
        }else {
            var session_id_session = req.session.session_id;
            if( !session_id_session && session_id_header!== session_id_session){
                return res.send({code:-1,msg:'未登录'});
            }
        }
    }

    next();
}



module.exports = LoginInterception;