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
    session.executeRead(txc=> txc.run('match(n:Person) return n').then(result=> {
      const recordsName:any[] = result.records.map(r => r.get('n').properties.name);
      const responseData:QueryPayload = {
        payload:recordsName
      }
      res.json(responseData);
    }))
 
  }catch(e){
    console.log("Query Failed!");
    session.close();
    res.status(500)
    res.render('error', { error: e })
  }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});