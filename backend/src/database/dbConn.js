import mysql from "mysql";
import * as dotenv from 'dotenv';
dotenv.config();

var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

class databaseFunctions {
    constructor() { }

    getAll(table) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `' + table + '`;', function (error, results, fields) {
                if (error) throw error;
                resolve(results)
            })
        })
    }

    showData(table, input, value) {
        return new Promise((resolve) => {
            connection.query(`SELECT * FROM ${table} WHERE ${input} = '${value}'`, function (error, results, fields) {
                if (error) { resolve({ ok: false, response: error }) }
                if (results) { resolve({ ok: true, response: results }) }
            })
        })
    }

    insertData(table, data) {
        return new Promise((resolve) => {
            connection.query(`INSERT INTO ${table} SET ?`, data, function (error, results, fields) {
                if (error) { resolve({ ok: false, response: error }) }
                if (results) { resolve({ ok: true, response: "Se han agregado los datos correctamente" }) }
            })
        })
    }

    updateData(table, data) {
        return new Promise((resolve) => {
            connection.query(`UPDATE ${table} SET ? WHERE id=${data.id}`, data, function (error, results, fields) {
                if (error) { resolve({ ok: false, response: error }) }
                if (results) { resolve({ ok: true, response: "Se han actualizado los datos correctamente" }) }
            })
        })
    }

    deleteData(table, id) {
        return new Promise((resolve) => {
            connection.query(`DELETE FROM ${table} WHERE id = ${id}`, function (error, results, fields) {
                if (error) { resolve({ ok: false, response: error }) }
                if (results) { resolve({ ok: true, response: "Se han borrado los datos correctamente" }) }
            })
        })
    }
}

export { databaseFunctions }

