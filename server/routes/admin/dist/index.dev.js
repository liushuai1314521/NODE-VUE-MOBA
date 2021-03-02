"use strict";

module.exports = function (app) {
  var express = require("express");

  var jwt = require("jsonwebtoken");

  var assert = require("http-assert");

  var AdminUser = require("../../models/AdminUser");

  var router = express.Router({
    mergeParams: true
  }); //创建资源

  router.post("/", function _callee(req, res) {
    var model;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(req.Model.create(req.body));

          case 2:
            model = _context.sent;
            res.send(model);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  }); //更新资源

  router.put("/:id", function _callee2(req, res) {
    var model;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(req.Model.findByIdAndUpdate(req.params.id, req.body));

          case 2:
            model = _context2.sent;
            res.send(model);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    });
  }); //删除资源

  router["delete"]("/:id", function _callee3(req, res) {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(req.Model.findByIdAndDelete(req.params.id, req.body));

          case 2:
            res.send({
              success: true
            });

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    });
  }); //资源列表,校验登录

  router.get("/", function _callee4(req, res) {
    var queryOptions, items;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            queryOptions = {};

            if (req.Model.modelName === "Category") {
              queryOptions.populate = "higher";
            }

            _context4.next = 4;
            return regeneratorRuntime.awrap(req.Model.find().setOptions(queryOptions).limit(200));

          case 4:
            items = _context4.sent;
            res.send(items);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  }); //查找资源

  router.get("/:id", function _callee5(req, res) {
    var model;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(req.Model.findById(req.params.id));

          case 2:
            model = _context5.sent;
            res.send(model);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    });
  }); //登录校验中间件

  var authMiddleware = require("../../middleware/auth");

  var resorceMiddleware = require("../../middleware/resource");

  app.use("/admin/api/rest/:resource",
  /* authMiddleware() */
  resorceMiddleware(), router);

  var multer = require("multer");

  var upload = multer({
    dest: __dirname + "/../../uploads"
  });
  app.post("/admin/api/upload", authMiddleware(), upload.single("file"), function _callee6(req, res) {
    var file;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            file = req.file;
            file.url = "http://localhost:3000/uploads/" + file.filename;
            res.send(file);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    });
  }); // 登录

  app.post("/admin/api/login", function _callee7(req, res) {
    var _req$body, username, password, user, isValid, token;

    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$body = req.body, username = _req$body.username, password = _req$body.password; //检验用户名和密码方法一
            //-2,根据用户名找用户

            _context7.next = 3;
            return regeneratorRuntime.awrap(AdminUser.findOne({
              username: username
            }).select('+password'));

          case 3:
            user = _context7.sent;
            assert(user, 419, '用户不存在'); //-1,校验密码

            isValid = require("bcryptjs").compareSync(password, user.password);
            assert(isValid, 419, '密码错误'); //2,返回token

            token = jwt.sign({
              id: user._id
            }, app.get("secret"));
            res.send({
              token: token
            }); //检验用户名和密码方法二
            // await AdminUser.findOne({ username: username }).then(res => {
            //     if (res.username == username && require('bcryptjs').compareSync(password, res.password)) {
            //         res.send({
            //             code: 199,
            //             messsge: "登录成功"
            //         })
            //     } else {
            //         res.send({
            //             code: 201,
            //             message: "账号或密码错误，请重试"
            //         })
            //     }
            // })

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    });
  }); //错误处理

  app.use(function _callee8(err, req, res, next) {
    return regeneratorRuntime.async(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            res.status(err.statusCode || 500).send({
              message: err.message
            });

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    });
  });
};