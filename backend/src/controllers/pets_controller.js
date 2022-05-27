import { databaseFunctions } from "./../database/dbConn.js";
import user from "./../controllers/users_controller.js";
import multer from "multer";
const userFunctions = new user()
const database = new databaseFunctions()

class pets {
    constructor() { }

    showAllPets(table, res) {
        database.getAll(table).then(response => {
            res.json({
                ok: true,
                response: response
            })
        })
    }

    //agregar mascotas a la tienda
    addpets(data, res) {
        if (data.name && data.photoUrls && data.status && data.tags && data.category) {
            database.insertData("pets", {
                name: data.name,
                photoUrls: data.photoUrls,
                status: data.status,
                tags: data.tags,
                category: data.category
            }).then(response => {
                res.json(response)
            })
        } else {
            res.json({ ok: false, response: "No se enviaron los datos correspondientes!" })
        }
    }

    //actualizar mascota en la tienda
    updatePet(data, res) {
        if (data.id && data.name && data.status && data.category) {
            database.updateData("pets", {
                id: data.id,
                name: data.name,
                status: data.status,
                category: data.category
            }).then(response => {
                res.json(response)
            })
        } else {
            res.json({ ok: false, response: "No se enviaron los datos correspondientes!" })
        }
    }

    //actualizar nombre de mascota y estado
    updatePetName_status(data, petId, res) {
        if (data.name && data.status && petId) {
            database.updateData("pets", {
                id: petId,
                name: data.name,
                status: data.status,
            }).then(response => {
                res.json(response)
            })
        } else {
            res.json({ ok: false, response: "No se enviaron los datos correspondientes!" })
        }
    }

    //eliminar mascota por id
    deletePet(petId, res) {
        if (petId) {
            database.deleteData("pets", petId).then(response => {
                res.json(response)
            })
        } else {
            res.json({ ok: false, response: "No se enviaron los datos correspondientes!" })
        }


    }

    uploadImg() {
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './src/userFiles/imagePets')
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + "-" + file.originalname)
            }
        })

        let upload = multer({ storage: storage })
        return upload
    }

    findPetByStatus(status, res) {
        database.showData('pets', 'status', status).then(data => {
            res.json({
                ok: true,
                response: data.response
            })
        })
    }
    findPetById(id, res) {
        database.showData('pets', 'id', id).then(data => {
            res.json({
                ok: true,
                response: data.response
            })
        })
    }
}

export default pets