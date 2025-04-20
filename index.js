import 'dotenv/config'
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );


//--------  just some basic stuff
// app.get("/", (req, res) => {
//     res.send("Hello guys from Amit Kumar!")
// })

// app.get("/ice-tea", (req, res) => {
//     res.send("What ice tea you need ?")
// })


let teaData = []
let nextId = 1

//method to add new tea
app.post('/teas', (req, res) => {
    const {price, name} = req.body
    const newTea = {id: nextId++, name, price}
    teaData.push(newTea)
    res.status(201).send(newTea)
})

//to get all tea
app.get('/teas', (req,res) => {
    res.status(200).send(teaData)
})

//to get a tea with id
app.get('/teas/:id', (req,res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id))
    if(!tea){
        return res.status(404).send("Hurray , Tea found !")
    }
    res.status(200).send(tea)
})

//to update a tea
app.put("/teas/:id", (req,res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id)) 
    if(!tea){
        return res.status(404).send("Hurray , Tea found !")
    }
    const {name, price} = req.body
    tea.name = name 
    tea.price = price
    res.send(200).send(tea)
})
//to delete tea
app.delete("/teas/:id", (req, res) => {
    const index = teaData.findIndex(t => t.id === parseInt(req.params.id))
    if(index === -1) {
        return res.status(404).send("Tea not found")
    }
    teaData.splice(index, 1)
    return res.status(204).send("Deleted the tea")
}) 

app.listen(port,() => {
    console.log(`Server is running at port : ${port}...`)
})