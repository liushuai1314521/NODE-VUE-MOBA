module.exports = app => {
    const express = require("express")
    const jwt = require("jsonwebtoken")
    const assert = require("http-assert")
    const AdminUser = require("../../models/AdminUser")

    const router = express.Router({
        mergeParams: true
    })

    //创建资源
    router.post("/", async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })
    //更新资源
    router.put("/:id", async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    //删除资源
    router.delete("/:id", async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })
    //资源列表,校验登录
    router.get("/", async (req, res) => {
        const queryOptions = {}
        if (req.Model.modelName === "Category") {
            queryOptions.populate = "higher"
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(200)
        res.send(items)
    })
    //查找资源
    router.get("/:id", async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
    //登录校验中间件
    const authMiddleware = require("../../middleware/auth")
    const resorceMiddleware = require("../../middleware/resource")

    app.use("/admin/api/rest/:resource", /* authMiddleware() */ resorceMiddleware(), router)

    const multer = require("multer")
    const upload = multer({ dest: __dirname + "/../../uploads" })
    app.post("/admin/api/upload", authMiddleware(), upload.single("file"), async (req, res) => {
        const file = req.file
        file.url = "http://localhost:3000/uploads/" + file.filename
        res.send(file)
    })

    // 登录
    app.post("/admin/api/login", async (req, res) => {
        const { username, password } = req.body

        //检验用户名和密码方法一
        //-2,根据用户名找用户
        const user = await AdminUser.findOne({ username }).select('+password')
        assert(user, 419, '用户不存在')
        //-1,校验密码
        const isValid = require("bcryptjs").compareSync(password, user.password)
        assert(isValid, 419, '密码错误')
        //2,返回token
        const token = jwt.sign({ id: user._id }, app.get("secret"))
        res.send({ token })

        //检验用户名和密码方法二
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
    })
    //错误处理
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })

} 