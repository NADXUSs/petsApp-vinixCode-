import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, FlatList, TouchableHighlight, Image } from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import CheckBox from '@react-native-community/checkbox';
import { FetchFunctionGet, FetchFunctionPostForm, FetchFunctionPost, FetchFunctionDelete, FetchFunctionPut } from "./../components/fetch";
import DocumentPicker from 'react-native-document-picker';
import { genericAlerts } from "./../components/alerts";

var resImage = [];
var deletePetsId = null
var updatePetsId = null
export default function Home({ navigation }) {

    const [pets, setPets] = useState([]);
    const [petsCategories, setpetsCategories] = useState([]);
    const [petsTags, setpetsTags] = useState([]);
    const [showModalPets, setshowModalPets] = useState({ display: 'none', opacity: 0 });
    const [showModalDeletePets, setshowModalDeletePets] = useState({ display: 'none', opacity: 0 });
    const [showModalUpdatePets, setshowModalUpdatePets] = useState({ display: 'none', opacity: 0 });

    const [petName, setpetName] = useState('');
    const [available, setAvailable] = useState(false);
    const [Noavailable, setNoavailable] = useState(false);
    const [category, setCategory] = useState('');
    const [tagsValue, settagsValue] = useState([]);

    const [statusImage, setStatusImage] = useState({ name: 'Subir imagen de mascota', color: '#0984e314', textColor: '#0984e3' });


    /* funcion para seleccionar una imagen desde el dispositivo */
    async function selectImagePet() {
        try {
            resImage = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }

        setStatusImage({ name: resImage[0].name, color: '#25ff0045', textColor: '#179c00' })
    }

    /* funcion para mandar la imagen de la mascota al servidor */
    async function sendFile() {
        try {
            const data = new FormData();
            console.log(resImage);
            data.append('petImage', {
                uri: resImage[0].uri,
                type: resImage[0].type,
                name: resImage[0].name,
            });

            FetchFunctionPostForm('/imagePet', data, {
                'Content-Type': 'multipart/form-data',
            }).then(data => {
                if (data.ok) {
                    let imageNameServer = data.imageName
                    FetchFunctionPost('/pet', {
                        name: petName,
                        photoUrls: imageNameServer,
                        status: available == true ? 'Disponible' : 'No disponible',
                        tags: JSON.stringify(tagsValue),
                        category: category
                    }, {
                        "Content-Type": "application/json"
                    }).then(response => {
                        if (response.ok == true) {
                            genericAlerts('Felicidades', 'Se ha agregado la mascota correctamente', 'Home', navigation)
                            resImage = []
                            setStatusImage({ name: 'Subir imagen de mascota', color: '#0984e314', textColor: '#0984e3' })
                            setpetName('')
                            setAvailable(false)
                            setNoavailable(false)
                            setCategory('')
                            settagsValue([])
                            showAddPets(false)
                            getPets()
                        }
                    })
                }
            })

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }

    /* funcion para actualizar los datos de una mascota */
    function updatePet() {
        if (updatePetsId) {
            FetchFunctionPut('/pet', {
                id: updatePetsId,
                name: petName,
                status: available == true ? 'Disponible' : 'No disponible',
                category: category
            }, {
                "Content-Type": "application/json"
            }).then(response => {
                if (response.ok == true) {
                    genericAlerts('Felicidades', 'Se ha actualizado la mascota correctamente', 'Home', navigation)
                    setpetName('')
                    setAvailable(false)
                    setNoavailable(false)
                    setCategory('')
                    settagsValue([])
                    showEditPets(false)
                    getPets()
                }
            })
        }
    }

    /* funcion que obtiene/actualiza la lista de mascotas */
    function getPets() {
        FetchFunctionGet('/pets', {}).then(res => {
            setPets(res.response)

            FetchFunctionGet('/petsCategories', {}).then(categories => {
                setpetsCategories(categories.response)

                FetchFunctionGet('/petsTags', {}).then(tags => {
                    setpetsTags(tags.response)
                })
            })
        })

    }

    /*  funciona para guardar una lista de tags localmente */
    var tags = []
    function saveTags(tagName) {
        let added = false
        if (tagName.id !== null) {
            tagsValue.forEach(el => { if (el.name == tagName.name) { added = true } })
            if (added == false) {
                tags.push(tagName)
                if (tagName !== 0) {
                    var joined = tagsValue.concat({ id: tagName.id, name: tagName.name });
                    settagsValue(joined)
                    added = false
                }
            }
        }

    }

    /*    funciona para ver el modal de agregar mascotas */
    function showAddPets(show) {
        if (show == true) {
            setshowModalPets({ display: 'flex', opacity: 1 })
        } else {
            setshowModalPets({ display: 'none', opacity: 0 })
        }
    }

    /* funciona para mostrar u ocultar el modal de eliminar mascotas */
    function showDeletePets(show, id) {
        if (show == true) {
            setshowModalDeletePets({ display: 'flex', opacity: 1 })
        } else {
            setshowModalDeletePets({ display: 'none', opacity: 0 })
        }

        if (id) {
            deletePetsId = id
        }
    }

    /*   funciona para eliminar mascotas */
    function deletePets() {
        if (deletePetsId) {
            FetchFunctionDelete(`/pet/${deletePetsId}`).then(response => {
                if (response.ok == true) {
                    getPets()
                    showDeletePets(false)
                }
            })
        }
    }

    function showEditPets(show, id) {
        if (show == true) {
            setshowModalUpdatePets({ display: 'flex', opacity: 1 })
        } else {
            setshowModalUpdatePets({ display: 'none', opacity: 0 })
        }

        if (id) {
            updatePetsId = id
        }
    }

    function filterStatus(statusName) {
        /* esto es lo que falta por desarrollar */
    }

    useEffect(() => {
        getPets()
    }, [])

    //nota =======================
    //los estilos y componentes no estan separados para disminuir el tiempo de desarrollo
    return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', backgroundColor: "white", minHeight: 700, width: "100%" }}>
            <View>
                <Text style={{ backgroundColor: '#0984e314', color: '#0984e3', width: 300, marginTop: 20, padding: 10, borderRadius: 5 }}>Filtrar mascotas por status</Text>
                <RNPickerSelect
                    onValueChange={(value) => { filterStatus(value) }}
                    placeholder={{ label: "Seleccionar status", value: 0 }}
                    items={[
                        { label: 'Ninguno', value: 'Ninguno' },
                        { label: 'No disponible', value: 'No disponible' },
                        { label: 'Disponible', value: 'Disponible' },
                    ]}
                    value={category}
                />
            </View>
            {/* lista de mascotas agregadas ================================ */}
            <Text style={{ marginTop: 50, width: "85%", fontSize: 15, marginBottom: 20 }}>Mascotas</Text>
            <FlatList
                style={{ width: "90%" }}
                data={pets}
                renderItem={({ item }) => (
                    <View style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7, borderRadius: 10, marginHorizontal: 10, marginVertical: 10, display: 'flex', flexDirection: 'row', alignItems: "center", backgroundColor: "white" }}>
                        <View>
                            <Image
                                style={{ width: 95, height: 95, marginTop: 0, marginRight: 10 }}
                                source={{
                                    uri: 'http://10.0.2.2:3000/imagePets/' + item.photoUrls,
                                }}
                            />
                        </View>
                        <View style={{ marginTop: 0, flex: 0.9 }}>
                            <Text style={{ color: "#0984e3", fontSize: 15 }}>{item.name}</Text>
                            <Text style={{ backgroundColor: '#0984e314', color: "#0984e3", textAlign: "center", width: 100, padding: 4, borderRadius: 5, marginTop: 10 }}>{item.status}</Text>
                            {/* <Text>{item.tags}</Text> */}
                        </View>
                        <View>
                            <TouchableHighlight underlayColor="#46aeff" onPress={() => { showEditPets(true, item.id) }} >
                                <Text style={{ borderRadius: 5, backgroundColor: "#0984e3", color: "white", padding: 5, marginVertical: 3, width: 70, textAlign: "center" }}>Editar</Text>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="#46aeff" onPress={() => { showDeletePets(true, item.id) }} >
                                <Text style={{ borderRadius: 5, backgroundColor: "#ff00002e", color: "#ff0000", padding: 5, marginVertical: 3, width: 70, textAlign: "center" }}>Eliminar</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                )}
            />
            {/* =========================================================== */}

            {/* boton para mostrar modal de agregar mas mascotas ========== */}
            <TouchableHighlight onPress={() => { showAddPets(true) }} style={{ top: "90%", left: "82%", backgroundColor: "#0984e3", borderRadius: 200, width: 50, height: 50, alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                <Text style={{ fontSize: 25, color: "white" }}>+</Text>
            </TouchableHighlight>
            {/* =========================================================== */}


            {/* modal para agregar mascotas con su respectiva imagen ====== */}
            <View style={{ opacity: showModalPets.opacity, display: showModalPets.display, top: "0%", left: "0%", backgroundColor: "#0000004f", width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                <View style={{ padding: 20, backgroundColor: "white", width: 350, height: 650, borderRadius: 10, alignItems: 'center', }}>

                    <TouchableHighlight
                        underlayColor="#0984e336"
                        style={{ width: "100%", marginBottom: 20, backgroundColor: statusImage.color, padding: 10, borderRadius: 10, marginTop: 10 }}
                        onPress={() => { selectImagePet() }}>
                        <Text style={{ textAlign: "center", color: statusImage.textColor }}>{statusImage.name}</Text>
                    </TouchableHighlight>

                    <Text style={{ width: "100%" }}>Nombre de la mascota</Text>
                    <TextInput
                        style={{ marginVertical: 8, borderColor: "#0984e3", borderWidth: 1, borderRadius: 10, height: 40, width: "100%", padding: 0, paddingHorizontal: 10 }}
                        placeholder="Ingrese el nombre de la mascota"
                        onChangeText={(text) => { setpetName(text) }}
                        value={petName}
                    />

                    <Text style={{ width: "100%" }}>Estado</Text>
                    <View style={{ width: "100%", display: 'flex', flexDirection: "column", alignItems: "flex-start" }}>
                        <View style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                            <CheckBox
                                value={available}
                                onValueChange={() => { setAvailable(true); setNoavailable(false) }}
                            />
                            <Text>Disponible</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                            <CheckBox
                                value={Noavailable}
                                onValueChange={() => { setAvailable(false); setNoavailable(true) }}
                            />
                            <Text>No DIsponible</Text>
                        </View>
                    </View>

                    <Text style={{ width: "100%", marginTop: 10 }}>Categoria</Text>
                    <RNPickerSelect
                        onValueChange={(value) => { setCategory(value) }}
                        placeholder={{ label: "Selecciona una categoria", value: 0 }}
                        items={petsCategories.map(el => {
                            return { label: el.name, value: el.id }
                        })}
                        value={category}
                    />

                    <Text style={{ width: "100%", marginTop: 10 }}>Tags</Text>
                    <RNPickerSelect
                        onValueChange={(value) => saveTags(value)}
                        placeholder={{ label: "Seleccionar tags", value: { id: null, name: 'Seleccionar tags' } }}
                        items={petsTags.map(el => {
                            return { label: el.name, value: { id: el.id, name: el.name } }
                        })}
                        value={petsTags}
                    />

                    <View style={{ flex: 0.7, flexDirection: "row", backgroundColor: "#0984e314", padding: 10, borderRadius: 10 }}>
                        <FlatList
                            data={tagsValue}
                            renderItem={({ item }) => (
                                <Text>{item.name}</Text>
                            )}
                        />
                    </View>

                    <TouchableHighlight
                        keyboardType="numeric"
                        value={""}
                        underlayColor="#46aeff"
                        style={{ width: 250, backgroundColor: "#0984e3", padding: 10, borderRadius: 10, marginTop: 20 }}
                        onPress={() => { sendFile() }}>
                        <Text style={{ textAlign: "center", color: "white" }}>Agregar mascota</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor="#0984e336"
                        style={{ width: 250, backgroundColor: "#0984e314", padding: 10, borderRadius: 10, marginTop: 10 }}
                        onPress={() => { showAddPets(false) }}>
                        <Text style={{ textAlign: "center", color: "#0984e3" }}>Cerrar</Text>
                    </TouchableHighlight>
                </View>
            </View>
            {/* =========================================================== */}


            {/* modal para eliminar una mascota por id ==================== */}
            <View style={{ opacity: showModalDeletePets.opacity, display: showModalDeletePets.display, top: "0%", left: "0%", backgroundColor: "#0000004f", width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                <View style={{ padding: 20, backgroundColor: "white", width: 300, height: 150, borderRadius: 10, alignItems: 'center', justifyContent: "center" }}>
                    <Text>Desea eliminar esta mascota?</Text>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <TouchableHighlight
                            underlayColor="#0984e336"
                            style={{ marginTop: 20, borderRadius: 5, padding: 7 }}
                            onPress={() => { showDeletePets(false) }}>
                            <Text style={{ borderRadius: 5, backgroundColor: "#0984e3", color: "white", padding: 5, marginVertical: 3, width: 90, textAlign: "center" }}>Cancelar</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor="#0984e336"
                            style={{ marginTop: 20, borderRadius: 5, padding: 7 }}
                            onPress={() => { deletePets() }}>
                            <Text style={{ borderRadius: 5, backgroundColor: "#ff00002e", color: "#ff0000", padding: 5, marginVertical: 3, width: 90, textAlign: "center" }}>Eliminar</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
            {/* =========================================================== */}


            {/* modal para editar la publicacion de mascotas ============== */}
            <View style={{ opacity: showModalUpdatePets.opacity, display: showModalUpdatePets.display, top: "0%", left: "0%", backgroundColor: "#0000004f", width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                <View style={{ padding: 20, backgroundColor: "white", width: 350, height: 400, borderRadius: 10, alignItems: 'center', }}>

                    <Text style={{ width: "100%" }}>Nombre de la mascota</Text>
                    <TextInput
                        style={{ marginVertical: 8, borderColor: "#0984e3", borderWidth: 1, borderRadius: 10, height: 40, width: "100%", padding: 0, paddingHorizontal: 10 }}
                        placeholder="Ingrese el nuevo nombre de la mascota"
                        onChangeText={(text) => { setpetName(text) }}
                        value={petName}
                    />

                    <Text style={{ width: "100%" }}>Estado</Text>
                    <View style={{ width: "100%", display: 'flex', flexDirection: "column", alignItems: "flex-start" }}>
                        <View style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                            <CheckBox
                                value={available}
                                onValueChange={() => { setAvailable(true); setNoavailable(false) }}
                            />
                            <Text>Disponible</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                            <CheckBox
                                value={Noavailable}
                                onValueChange={() => { setAvailable(false); setNoavailable(true) }}
                            />
                            <Text>No DIsponible</Text>
                        </View>
                    </View>

                    <Text style={{ width: "100%", marginTop: 10 }}>Categoria</Text>
                    <RNPickerSelect
                        onValueChange={(value) => { setCategory(value) }}
                        placeholder={{ label: "Selecciona una categoria", value: 0 }}
                        items={petsCategories.map(el => {
                            return { label: el.name, value: el.id }
                        })}
                        value={category}
                    />

                    <TouchableHighlight
                        keyboardType="numeric"
                        value={""}
                        underlayColor="#46aeff"
                        style={{ width: 250, backgroundColor: "#0984e3", padding: 10, borderRadius: 10, marginTop: 20 }}
                        onPress={() => { updatePet() }}>
                        <Text style={{ textAlign: "center", color: "white" }}>Actualizar</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor="#0984e336"
                        style={{ width: 250, backgroundColor: "#0984e314", padding: 10, borderRadius: 10, marginTop: 10 }}
                        onPress={() => { showEditPets(false) }}>
                        <Text style={{ textAlign: "center", color: "#0984e3" }}>Cerrar</Text>
                    </TouchableHighlight>
                </View>
            </View>
            {/* =========================================================== */}
        </View>
    );
}
