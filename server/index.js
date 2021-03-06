const express = require("express")

const app = express()

app.set("secret","asfdgsadg")

app.use(require("cors")())

app.get('/',(req,res)=>{
    res.send("你好")
})

app.use(express.json())

app.use("/uploads",express.static(__dirname + "/uploads"))

require("./plugins/db")(app)

require("./routes/admin")(app)
require("./routes/web")(app)


app.listen(3000, () => {
    console.log("http://localhost:3000");

})