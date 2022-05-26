import { databaseFunctions } from "./../database/dbConn.js";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();
const database = new databaseFunctions()


class user {
    constructor() { }

    //registrar usuario con correo y contraseña
    register(data, res) {
        if (data.name && data.lastName && data.email && data.password) {
            database.insertData("users", {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                password: jwt.sign({ password: data.password }, process.env.USER_SECRET)
            }).then(response => {
                res.json(response)
            })
        } else {
            res.json({ ok: false, response: "No se enviaron los datos correspondientes!" })
        }
    }


    //iniciar sesion con usuario y contraseña (retorna token de usuario)
    login(data, res) {
        if (data.email && data.password) {
            database.showData("users", "email", data.email).then(response => {
                if (response.response[0]) {
                    if (this.verifyToken(data.password, response.response[0].password).ok === true) {
                        res.json({ ok: true, api_key: jwt.sign({ id: response.response[0].id }, process.env.USER_SECRET) })
                    } else {
                        res.json({ ok: false, response: "Contraseña incorrecta" })
                    }
                } else {
                    res.json({ ok: false, response: "No se ha encontrado un correo con esta direccion" })
                }
            })
        } else {
            res.json({ ok: false, response: "No se enviaron los datos correspondientes!" })
        }
    }

    validateUserToken(userToken) {
        if (userToken) {
            let tokenID = this.verifyToken(null, userToken).value

            return new Promise(resolve => {
                database.showData("users", "id", tokenID).then(response => {
                    if (tokenID) {
                        if (response.ok === true) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    } else {
                        resolve(false)
                    }
                })
            })
        }
    }

    //verifica que el token sea igual a un valor asignado
    verifyToken(valueVerify, token) {
        return jwt.verify(token, process.env.USER_SECRET, function (err, decoded) {
            if (decoded) {
                if (valueVerify == Object.values(decoded)[0]) {
                    return { ok: true, value: Object.values(decoded)[0] }
                } else {
                    return { ok: false, value: Object.values(decoded)[0] }
                }
            } else {
                return { ok: false, value: null }
            }
        });
    }
}

export default user