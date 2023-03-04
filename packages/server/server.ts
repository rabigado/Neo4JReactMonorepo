import express from 'express';
import cors from 'cors';
import { snakeCase } from 'lodash';
import {QueryPayload} from 'shared';
import neo4j from 'neo4j-driver';

const app = express();
app.use(cors());
const port = 3001;

app.get("/", (req, res) => {
  const responseData: QueryPayload = {
    payload: snakeCase("Server data returned successfully"),
  };

  res.json(responseData);
});

app.get("/neo4j",(req,res)=>{
  const  driver =neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic("neo4j", "password"))
  const session = driver.session();
  try{
    console.log("starting session!!")
    session.run('match(n) return n')
    .then(result => {
      console.log("result!",result);
      const recordsName:any[] = result.records;
      const responseData:QueryPayload = {
        payload:recordsName
      }
      res.json(responseData);
    }).then(()=>session.close())
 
  }catch(e){
    console.log("Query Failed!");
    session.close();
    res.status(500)
    res.render('error', { error: e })
  }finally{
    console.log("close session");
  
  }
   

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});