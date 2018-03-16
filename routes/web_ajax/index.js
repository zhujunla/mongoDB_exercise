var express = require('express');
var router = express.Router();
var zjl_mongodb_Show = require('../../zjl_config/mongodb');
var zjl_code = require('../../zjl_config/code');
var UUID = require('uuid')


/* GET 登陆 page. */
router.post('/login', function(req, res, next) {
    // var res_data = null;
    var object = {
        username:req.body.username,
        password:req.body.password
    };

    zjl_mongodb_Show(function (db,dbo) {
        dbo.collection("userInformation").find(object).toArray(function(err, result) { // 返回集合中所有数据
            db.close();
            if (err) throw err;
            if(result.length== 0){
                return res.send({
                    msg:'登录失败',
                    code:-5,
                    data:result
                })
            }else {
                var session_id = UUID.v1();
                console.info(session_id)
                req.session.session_id = session_id;
                var resdata = result[0];
                resdata.session_id = session_id;
                return res.send({
                    msg:'登录成功',
                    code:1,
                    data:resdata
                })

            }


        });
    })

});


/* GET home page. */
router.post('/cheshi', function(req, res, next) {
    // var res_data = null;
    zjl_mongodb_Show(function (db,dbo) {
        dbo.collection("strpeople").aggregate([{ $match : { age : {$gt:0} } },{$project:{"_id":0}},{
                  $lookup:
               {
                   from:"runboos",
                   localField:"id",
                   foreignField:"id",
                   as: "inventory_docs"
                     }
            }]).toArray(function(err, result) { // 返回集合中所有数据
            db.close();
            if (err) throw err;
            return res.send({
                msg:'查询成功',
                code:1,
                data:result
            })

        });
    })

});

//注册
router.post('/register', function(req, res, next) {
    // var res_data = null;
    var flag = true;
    function isImpty(name,req) {
        if(!req[name]){
            flag = false;
            return res.end({
                msg:'必填参数未填',
                code:13,
            })

        }else{
            console.info(req[name])
            return req[name];
        }
    }
    var myobjName = isImpty('username',req.body);
    var myobj = {
        username:isImpty('username',req.body),
        password:isImpty('password',req.body)
    }
    var name = {"username":myobjName};
    if(flag){
        zjl_mongodb_Show(function (db,dbo) {
            dbo.collection("userInformation").find(name).toArray(function(err, result) { // 返回集合中所有数据
                db.close();
                if (err) throw err;
                // res_data = result;
                // res.render('index', { title: 'Express',result: result});
                if(result.length==0){
                    insert(myobj)
                }else {
                    return res.send({
                        msg:"用户名已存在",
                        code:-5,
                        data:result
                    })

                }


            });
        })
        function insert(myobj) {
            zjl_mongodb_Show(function (db,dbo) {
                dbo.collection("userInformation").insertOne(myobj,function(err, result) { // 返回集合中所有数据
                    db.close();
                    if (err) throw err;
                    console.info(result);
                    // res_data = result;
                    // res.render('index', { title: 'Express',result: result});
                    return res.send({
                        msg:'新增成功',
                        code:1,
                        data:result
                    })

                });
            })
        }
    }



});


/* GET home page. */
router.post('/chaxunChange', function(req, res, next) {
    // var res_data = null;
    var name = req.body.username;
    var information =req.body;
    console.info(name)
    zjl_mongodb_Show(function (db,dbo) {
        dbo.collection("strpeople").update({ "username" :name },{"$set":information},{upsert:true},function(err, result) { // 返回集合中所有数据

            db.close();
            if (err) throw err;
            return res.send({
                msg:'更新成功',
                code:1,
                data:result
            })
        });
    })

});




module.exports = router;
