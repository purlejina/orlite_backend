require('dotenv').config();
const mysql = require('mysql');

const dbConfig = {
  host: '69.46.24.234',
  user: 'ercotm',
  password: '99ercotemail991',
  database: 'predictably_admin'
};
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'predictably-admin'
// };

const connection = mysql.createConnection(dbConfig);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

const getUser = function getUser(email){
  let sqlStr = `SELECT * from user_optionlytics where email="${email}"`;
  return new Promise(function(resolve, reject) {
    connection.query(sqlStr, function(err, rows, fields) {
      if(err) return reject(err);
      resolve(rows, fields);
    });
  });
};

const updateUserPW = function updateUserPW(email, newpw){
  let sqlStr = `UPDATE user_optionlytics SET hashedPassword = "${newpw}" WHERE email="${email}" `;
  return new Promise(function(resolve, reject) {
    connection.query(sqlStr, function(err, rows, fields) {
      if(err) return reject(err);
      resolve(rows, fields);
    });
  });
}

const getVolatility = function getVolatility(){
  let sqlStr = `SELECT
  IF(hub = 'NYH (RBOB)','Gasoline',
  IF(hub = 'NYH', 'Heating Oil',
  IF(hub = 'Dominion-South', 'Dominion South',
  IF(hub = 'ERCOT North 345KV Hub DA', 'ERCOT North',
  IF(hub = 'Nepool MH DA', 'Nepool',
  IF(hub = 'PJM WH RT (800 MWh)', 'PJM WH',
  IF(hub = 'North Sea', 'Brent',
  IF(hub = 'Argus LLS', 'LLS',
  IF(hub = 'Permian (EP)', 'Permian',
  IF(hub = 'Brent 1st Line', 'Brent CMA',
  IF(hub = 'Dubai 1st Line', 'Dubai CMA',
  IF(hub = 'AB-NIT', 'Aeco 7a (US/MM)',
  IF(hub = 'AD Hub DA', 'AD Hub',
  IF(hub = 'Indiana Hub DA', 'Indiana Hub',
  IF(hub = 'NGPL-Midcont Pool', 'NGPL Midcont Pool',
  IF(hub = 'NGPL-TxOk', 'NGPL TxOk',
  IF(hub = 'NNG-Ventura', 'NNG Ventura',
  IF(hub = 'REX-Z3', 'REX Z3',
  IF(hub = 'TETCO-M3', 'TETCO M3',
  IF(hub = 'Transco-Leidy', 'Transco Leidy',
  IF(hub = 'Permian WTI', 'MEH',
  IF(hub = 'Permian WTI 1st Line', 'MEH CMA',
  IF(hub = 'WTI 1st Line', 'WTI CMA', hub))))))))))))))))))))))) AS 'hub',
  strip, strike,
  ROUND(option_volatility / 100, 3) AS 'ImpVol'
  FROM predictably.icecleared_options
  WHERE trade_date=(SELECT MAX(trade_date) FROM predictably.icecleared_options)
  AND (product_id = 261 OR product_id = 254
  OR product_id = 425 OR product_id = 495
  OR product_id = 491 OR product_id = 3088
  OR product_id = 20472 OR product_id = 20474
  OR product_id = 2611 OR product_id = 21721
  OR product_id = 21723 OR product_id = 317
  OR product_id = 21727 OR product_id = 286
  OR product_id = 21733 OR product_id = 10
  OR product_id = 1464 OR product_id = 753
  OR product_id = 21725 OR product_id = 22262
  OR product_id = 22260 OR product_id = 2159
  OR product_id = 1613 OR product_id = 22268
  OR product_id = 22270
  OR product_id = 22266 OR product_id = 289
  OR product_id = 290 OR product_id = 22160
  OR product_id = 23416 OR product_id = 22274
  OR product_id = 22276 OR product_id = 21731
  OR product_id = 22277 OR product_id = 13)
  AND contract_type = 'P'
  AND strip != '0000-00-00'`;

  return new Promise(function(resolve, reject) {
    connection.query(sqlStr, function(err, rows, fields) {
      if(err) return reject(err);
      resolve(rows, fields);
    });
  });
}

module.exports.getUser = getUser;
module.exports.getVolatility = getVolatility;
module.exports.updateUserPW = updateUserPW;
