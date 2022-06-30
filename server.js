const express = require('express')
const app = express()
const path = require('path')

app.use(express.json())


var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// rollbar.log('Hello world!')
/*
Rollbar methods
rollbar.info() rollbar.log() rollbar.error() rollbar.warning() rollbar.critical()
*/


const items = ['Bread', 'Eggs', 'Milk']

app.use("/", express.static(path.join(__dirname, "/publictwo")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/publictwo/index.html'))
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/publictwo/index.css'))
})

app.get('/api/items', (req, res) => {
    rollbar.info('Item list was accessed')
    res.status(200).send(items)
})

app.post('/api/items', (req, res) => {
   let {name} = req.body

   const index = items.findIndex(items => {
       return items === name
   })

   try {
       if (index === -1 && name !== '') {
           rollbar.info('item was added to the list')
           items.push(name)
           res.status(200).send(items)
       } else if (name === ''){
           rollbar.error('Empty body was sent')
           res.status(400).send('You must enter an item.')
       } else {
           rollbar.warning('Item already exists')
           res.status(400).send('That item already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/items/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    items.splice(targetIndex, 1)
    res.status(200).send(items)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
