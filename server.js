const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { 
  getUser,
  getVolatility,
  updateUserPW
} = require('./database');


const app = express();
app.use(express.json());
app.use(bodyParser.json());

const accessTokenSecret = 'optionlyticsLiteTokenSecret';
const refreshTokenSecret = 'optionlyticsLiteRefreshTokenSecret';
const refreshTokens = [];

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }
          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Methods', 'POST')
  next();
});

const port = 8080;

app.get('/', (req, res) => res.send('server status okay'));

function apiResponse(data, stat = true) {
  return {
      status: stat,
      msg: stat ? "success" : "failure",
      data
  };
}

app.post('/api/auth/login', async (req, res)=> {
  // Read username and password from request body
  const { email, password } = req.body;

  let user = await getUser(email);

  // let result = user.email === email && user.password === password;
  let result = user[0].email === email;

  if (result) {
      // Generate an access token
      // const accessToken = jwt.sign({ email: user[0].email }, accessTokenSecret, { expiresIn: '1m'});
      const accessToken = jwt.sign({ email: user[0].email }, accessTokenSecret);

      const refreshToken = jwt.sign({ email: user[0].email }, refreshTokenSecret);
      refreshTokens.push(refreshToken);

      res.json({
        accessToken
      });
  } else {
      return res.sendStatus(401);
  }
});

app.post('/api/token', (req, res) => {
  const { token } = req.body;

  if(!token) return res.sendStatus(401);

  if(!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }

      const accessToken = jwt.sign({ email: user.email }, accessTokenSecret, { expiresIn: '20m' });

      res.json({
          accessToken
      });
  });
});

app.post('/api/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(token => t !== token);

  res.send("Logout successful");
});

app.get('/api/me',authenticateJWT, async (req, res) => {

    let { email } = req.user;

    let user = await getUser(email);
    res.json({...user[0], hashedPassword: undefined, salt: undefined, active: undefined, create_at: undefined})
});

// app.get('/users', async (req, resp)=>{
//   let user = await getUser("ppgjsc@outlook.com1");

//   if(user.length >0){
//     resp.json({...user[0], hashedPassword: undefined, salt: undefined, active: undefined, create_at: undefined})
//   }else{
//     resp.status(401).json({ error: 'Issue in DB connection' });
//   }
// });

app.post('/api/udpate_password',authenticateJWT, async (req, res)=> {
  let { currentpw, newpw } = req.body;
  let { email } = req.user;
  let isValid = false;

  // get user password from database
  let user = await getUser(email);
  let hashedPassword = user[0].hashedPassword;

  if(currentpw === hashedPassword) {
    isValid = true;
    updateUserPW(email, newpw).then((err, rows, fields) => {
      if(err) throw err;
      updateStatus = true;
    }).catch(err=>{
      console.log(err)
    });
  }

  res.json(isValid);
});

app.get('/api/profile', authenticateJWT, (req, res) => {
  res.send("profile data");
});

app.get('/api/volatility', authenticateJWT, (req, resp)=>{
  getVolatility().then(function(rows, fields){
    resp.send(rows)
  }).catch((err) =>{
    // console.log(err);
    resp.status(400).json({ error: 'Issue in DB connection' });
  });
});

app.listen(port, () => console.log(`bot app listening on port ${port}!`));