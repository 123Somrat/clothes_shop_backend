const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT || 3000

//middleware 
app.use(cors())
app.use(express.json());

// create route 





app.listen(port,()=>{
     console.log(`app is listening on port ${port}`)
})