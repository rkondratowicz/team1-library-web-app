const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.post("/api/greet", (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(200).send(`Hello, ${name}!`);
});
app.get("/api/greet2", (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(200).send(`Hello, ${name}!`);
});
app.post('/api/calculate',(req,res)=>{
    const {expression,num1,num2} = req.body;
    let result;
    if(!expression.trim()){
        return res.status(400).json({error:"Expression is required"});
    }
    else if(!num1){
        return res.status(400).json({error:"num1 is required"});
    }
    else if(!num2){
        return res.status(400).json({error:"num2 is required"});
    }
    try{
        if(expression === "add"){
            result = num1 + num2;
        }else if(expression === "subtract"){
            result = num1 - num2;
        }else if(expression === "multiply"){
            result = num1 * num2;
        }else if(expression === "divide"){
            if(num2 === 0){
                return res.status(400).json({error:"Cannot divide by zero"});
            }
            result = num1 / num2;
        }else{
            return res.status(400).json({error:"Invalid expression"});
        }
        return res.status(200).json({result});
    }catch(err){
        return res.status(400).json({error:"Invalid expression"});
    }
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
