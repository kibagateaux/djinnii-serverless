""'use strict'
import fs from 'fs';
import https from 'https';
import Moves from 'moves';
import axios from "axios";
import express from 'express';


var PORT = 3000;
var optionsSSL = {
  key: fs.readFileSync('privateKey.key'),
  cert: fs.readFileSync('certificate.crt'),
  requestCert: false,
  rejectUnauthorized: false
};
const app = express();
var secureServer = https.createServer(optionsSSL, app).listen(PORT);
console.log('secure server on port ', PORT);


const moves = new Moves({
  "client_id": "kdiz90L264WQ72Sc7OO0_0IUM4ZRrcB6",
  "client_secret": "ctvltqaFM1y6BaEe1IdE7_c7St82X6sHmIuD4597QAQr4zl930o23F8mnF3t7NEn",
  "redirect_uri": `https://localhost:${PORT}/auth/moves`,
  "access_token": "rg7MKs3O09lVvkAKLL4Q3WnBEop0eWczB0RX8cEGemfgGcNfARl34_TT4u0HC3MN"
});

app.get("/", (req, res) => {
  if (!req.query.code) {
    const url = moves.authorize({
      scope: ["activity", "location"]
    });
    console.log('url', url);
    return res.send(url); // send to RN for Linking
  }
  res.redirect("/moves/any");
})

app.get("/auth/moves", function(req,res){
  moves.token(req.query.code, function(error, response, body) {
    const { access_token, refresh_token } = JSON.parse(response.body);
    moves.access_token = access_token;
    moves.refresh_token = refresh_token;
    console.log('token', access_token);
    
    axios.head(
      "https://us-central1-djinn-64564.cloudfunctions.net/setMovesApiToken", 
      { 
        headers:{token: access_token, uid: 0} 
      }
    ).then((res) => console.log('send token res', res))
    .catch((err) => console.log('cld func  err'));
    ;
    res.send(access_token);
  });
})

app.get("/moves/:any", function(req,res){
/* 
  token currently saved on server but obv with serverless must be saved
  const token = axios.head('https://us-central1-djinn-64564.cloudfunctions.net/setMovesApiToken');
  if(!token){
    const token = res.send(axios.head('moves/auth/'));
  }
*/
  console.log('/moves/:any req');
  
  moves.get(
    '/user/storyline/daily?pastDays=3&trackPoints=false',
    moves.access_token,
    function(error, response){
      console.log('getting move=es data');
      
      if(error) { console.log('error', error); return error; }
      const data = (response.body != null) ?
        JSON.parse(response.body) :
        "Moves API response did not return data. Check your request or api credentials";
        
      console.log('moves data', data);
      
      res.send(data);
      console.log('api res data', data);    
    });
    
});