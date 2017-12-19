'use strict';

const express = require('express');
const queryString = require('query-string');
const morgan = require('morgan');

const app = express();


const USERS = [{
  id: 1,
  firstName: 'Joe',
  lastName: 'Schmoe',
  userName: 'joeschmoe@business.com',
  position: 'Sr. Engineer',
  isAdmin: true,
  // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
  password: 'password'
},
{
  id: 2,
  firstName: 'Sally',
  lastName: 'Student',
  userName: 'sallystudent@business.com',
  position: 'Jr. Engineer',
  isAdmin: true,
  // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
  password: 'password'
},
  // ...other users
];

function getQueryParams(req, res, next) {
  console.log('getQueryParams');
  return (queryString.parse(req.get('x-username-and-password')));
}

function gateKeeper(req, res, next) {
  //check username and password, then add user to object

  let userName = getQueryParams(req).user;
  let password = getQueryParams(req).pass;
  console.log(userName, password);
  USERS.find(user => { //user was found
    if (user.userName === userName && user.password === password) {

      console.log('in the true if statement');
      console.log(user.userName);
      req.user = user;
      console.log('!!!!');

    }

    // users.find returns obj
    //then req.user = user.find
  });

  /* 
 
    USERS.find(user => {
      //no ifs
      
      return 
    })
 
 
    */
  next();
}

app.get('/', function(req, res) {
  res.send('Home.');
});

app.use(gateKeeper);

app.get('/api/users/me', (req, res) => {
  console.log('in this endpoint');
  if (req.user === undefined) {
    return res.status(401).json({ message: 'Must supply valid user credentials' });
  }
  const { firstName, lastName, id, userName, position } = req.user;
  return res.json({ firstName, lastName, id, userName, position });
});

// ... start the app
app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});