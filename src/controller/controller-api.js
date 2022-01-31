const express = require('express');
const router = express.Router();
const db  = require('../config/dbConnection');
const { signupValidation, loginValidation } = require('../config/validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports={
    add(req, res){
        db.query(
            `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
              req.body.email
            )});`,
            (err, result) => {
              if (result.length) {
                return res.status(409).send({
                  msg: 'Email sudah digunakan'
                });
              } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                  if (err) {
                    return res.status(500).send({
                      msg: err
                    });
                  } else {
                    db.query(
                      `INSERT INTO users (username, email, password) VALUES ('${req.body.username}', ${db.escape(
                        req.body.email
                      )}, ${db.escape(hash)})`,
                      (err, result) => {
                        if (err) {
                          throw err;
                          return res.status(400).send({
                            msg: err
                          });
                        }
                        return res.status(201).send({
                          msg: 'Berhasil tambah data'
                        });
                      }
                    );
                  }
                });
              }
            }
          );
    },

    login(req, res){
        db.query(
            `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
            (err, result) => {
              if (err) {
                throw err;
                return res.status(400).send({
                  msg: err
                });
              }
              if (!result.length) {
                return res.status(401).send({
                  msg: 'Email atau password salah'
                });
              }
              bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                  if (bErr) {
                    throw bErr;
                    return res.status(401).send({
                      msg: 'Email atau password salah'
                    });
                  }
                  if (bResult) {
                    const token = jwt.sign({id:result[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
                    db.query(
                      `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
                    );
                    return res.status(200).send({
                      msg: 'Berhasil login',
                      token,
                      user: result[0]
                    });
                  }
                  return res.status(401).send({
                    msg: 'Email atau password salah'
                  });
                }
              );
            }
          );
    },

    getDataApi(req, res){
        db.query(
                `SELECT * FROM users;`,
                function (error, result){
                    if(error) throw error;
                    res.send({
                        success: true,
                        message: 'Berhasil tampil data',
                        data: result
                    });
                });
                
        },
}
