const express = require('express')
const bodyParser = require('body-parser');
const { request } = require('express');
const mongoose = require('mongoose')
const _ = require('lodash')
const date = require(__dirname + '/date.js')

const cool = require('cool-ascii-faces');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))




mongoose.connect('mongodb+srv://Jigar:My@pc111@democluster.uond2.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true})

const itemsceham = mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemsceham)

const item1 = new Item({
    name: 'Welcome to todolist'
})
const item2 = new Item({
    name: 'Welcome to todolist1'
})

const item3 = new Item({
    name: 'Welcome to todolist2'
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsceham]
}

const List = mongoose.model("List", listSchema)

app.get('/', (req, res) => {

    Item.find({}, function (err, foundItems) { 
    
        if(foundItems.length === 0){      
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("Successfully inserted")
                }    
            })
            res.redirect('/')
        }else{
            res.render('list', {listTitle : "Today", newListItems : foundItems})
        }
    })
    // mongoose.connection.close()
})

app.get('/:customListName', function (req, res) { 

    const customListName = _.capitalize(req.params.customListName)

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect('/'+customListName)
            }else{
                //show an existing list
                res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    })

 
})

app.post('/', function (req, res) {  

    const itemName = req.body.newItem
    const listName = req.body.list

    const newItem = Item({
        name: itemName
    })

    if(listName === 'Today'){
        newItem.save()
        res.redirect('/')
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(newItem)
            foundList.save()
            res.redirect('/'+listName)
        })
    }

   
    

    // if(req.body.list === "Work"){
    //     if(item !== ""){
    //         Item.insertOne({name: item}, function (err) { 
    //             if(err){
    //                 console.log(err)
    //             }else{
    //                 res.redirect('/work')
    //             }
    //         })
    //     }
    // }else{
    //     if(item !== ""){
    //         Item.insertOne({name: item}, function (err) { 
    //             if(err){
    //                 console.log(err)
    //             }else{
    //                 res.redirect('/')
    //             }
    //         })
    //     }    
    // }
})

app.post('/delete', function(req, res){
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName

    if(listName === 'Today'){
        Item.findByIdAndDelete(checkedItemId, function (err) {  
            if(!err){
                console.log("Successfully deleted item")
                res.redirect('/')
            }
        })
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function (err, foundList) {  
            if(!err){
                res.redirect('/'+listName)
            }
        })
    }
    
})

// app.get('/work', function (req, res) { 
//     res.render('list', {listTitle: "Today Work List", newListItems : workItems})
// })

// app.post('/work', function (req, res) {
//     const item = req.body.newItem
//     workItems.push(item)
//     res.redirect('/work')
// })
// let port = process.env.PORT
// if(port === null || port === ""){
//     port = 3000
// }

// app.listen(port, function () { 
//     console.log('Server started on port 3000');
//  })
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));