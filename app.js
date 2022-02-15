const express=require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const filePath = './data.json';

const getData=()=>{
    const jsonData = fs.readFileSync(filePath)
    return JSON.parse(jsonData);
}

const writeData = (data)=>{
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(filePath,stringifyData);
}
app.get('/books',(req,res)=>{
        let myObj;
        let bookName=[];
           myObj = getData();
           for(let i=0;i<myObj.books.length;i++){
            bookName.push(myObj.books[i].name);
           }
        res.send(bookName);
});

app.get('/books/details/:bookName', (req,res)=>{
        let dataObj,steps,finalData;
        let top = [];
        let topics=[];
        
           dataObj = getData();
           let bookName = req.params.bookName;

           for(let i=0;i<dataObj.books.length;i++){
                if(dataObj.books[i].name == bookName){
                        top.push(dataObj.books[i].topics)
                        topics = dataObj.books[i].topics;
                        prob = dataObj.books[i].problems.length;
                        finalData={details:{topics:topics,numProblems:prob}};
                } else{
                    finalData = JSON.parse(JSON.stringify({}))
                }
           }
        res.send(finalData);
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/books', (req,res)=>{
    let dataObj;
            dataObj = getData();
            let requestBody=req.body;
            let name = requestBody.name;
            let nameArray = [];
            for(let i=0;i<dataObj.books.length;i++){
                nameArray.push(dataObj.books[i].name)
            }
            if(nameArray.includes(name)){
                res.status(400).send({
                    message:'Book already exists'
                })
            } else {
                dataObj.books.push(requestBody);
                writeData(dataObj);
                res.status(201).json();
            }
})

app.put('/books', (req,res)=>{
            let dataObj = getData();
            let requestBody= req.body;
            let nameArray = [];
            for(let i=0;i<dataObj.books.length;i++){
                nameArray.push(dataObj.books[i]);
            }

            if(!nameArray[0].name.includes(requestBody.name)){
                dataObj.books.push(requestBody);
                writeData(dataObj);
                res.status(201).json();
            } else {
                let temp = nameArray.filter((item)=>item.name == requestBody.name);
                console.log("temp: ",temp)
                Object.keys(temp[0]).forEach(function (key){
                    temp[0][key] = requestBody[key] !=null ? requestBody[key]:"";
                })
                console.log("nameArray: ",nameArray);
                writeData(dataObj);
                res.status(204).json();
                }      
});

app.listen(3000,'localhost',()=>{
    console.log('Server started');
});