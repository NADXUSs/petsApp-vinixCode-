import express from "express";
import pets from "./../controllers/pets_controller.js";
import user from "./../controllers/users_controller.js";
const petsFunctions = new pets()
const userFunctions = new user()
const router = express.Router()


//rutas de mascotas
router.get('/pets', (req, res) => {
    petsFunctions.showAllPets("pets", res)
})

router.get('/pet/findByStatus/:status', (req, res) => {
    petsFunctions.findPetByStatus(req.params.status, res)
})

router.get('/pet/:petId', (req, res) => {
    petsFunctions.findPetById(req.params.petId, res)
})

router.post('/pet', (req, res) => {
    petsFunctions.addpets(req.body, res)
})

router.put('/pet', (req, res) => {
    petsFunctions.updatePet(req.body, res)
})

router.post('/pet/:petId', (req, res) => {
    petsFunctions.updatePetName_status(req.body, req.params.petId, res)
})

router.delete('/pet/:petId', (req, res) => {
    petsFunctions.deletePet(req.params.petId, res)
})


//rutas de usuarios
router.post('/userRegister', (req, res) => {
    userFunctions.register(req.body, res)
})
router.post('/userLogin', (req, res) => {
    userFunctions.login(req.body, res)
})
router.post('/imagePet', petsFunctions.uploadImg().single("petImage"), (req, res) => {
    const file = req.file
    if (file) {
        res.json({
            ok: true,
            message: "La imagen se ha guardado con exito",
            imageName: file.filename
        })
    }
})

router.get('/petsCategories', (req, res) => {
    petsFunctions.showAllPets("pet_category", res)
})
router.get('/petsTags', (req, res) => {
    petsFunctions.showAllPets("pet_tags", res)
})


export default router 