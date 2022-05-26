import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Image } from 'react-native';
import { FetchFunctionPost } from "./../components/fetch.js";
import { genericAlerts } from "./../components/alerts";

export default function Login({ navigation }) {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');

    function loginUser() {
        FetchFunctionPost(
            "/userLogin",
            {
                email: email,
                password: password
            },
            {
                "Content-Type": "application/json"
            }
        ).then(data => {
            if (data.ok == true) {
                setemail('')
                setpassword('')
                navigation.navigate('Home');
            } else {
                genericAlerts('No ha iniciado sesion', data.response, 'Login', navigation)
            }
        }).catch(err => console.log(err))
    }

    //nota =======================
    //los estilos y componentes no estan separados para disminuir el tiempo de desarrollo
    return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', backgroundColor: "white", minHeight: 700 }}>

            <Image
                style={{ width: 100, height: 100, borderRadius: 200, marginBottom: 50, marginTop: -80 }}
                source={require('./../assets/paw.png')}
            />

            <View style={{ width: 250 }}>
                <Text style={{ color: "#0984e3", fontSize: 15, marginBottom: 10 }}>Email</Text>
                <TextInput
                    style={{ borderColor: "#0984e3", borderWidth: 1, borderRadius: 10, height: 40, padding: 0, paddingHorizontal: 10 }}
                    placeholder="example@gmail.com"
                    onChangeText={(text) => { setemail(text) }}
                />
            </View>
            <View style={{ width: 250, marginVertical: 10 }}>
                <Text style={{ color: "#0984e3", fontSize: 15, marginBottom: 10 }}>Password</Text>
                <TextInput
                    style={{ borderColor: "#0984e3", borderWidth: 1, borderRadius: 10, height: 40, padding: 0, paddingHorizontal: 10 }}
                    placeholder="*********"
                    onChangeText={(text) => { setpassword(text) }}
                />
            </View>

            <TouchableHighlight
                keyboardType="numeric"
                value={""}
                underlayColor="#46aeff"
                style={{ width: 250, backgroundColor: "#0984e3", padding: 10, borderRadius: 10, marginTop: 20 }}
                onPress={() => loginUser()}>
                <Text style={{ textAlign: "center", color: "white" }}>Iniciar sesion</Text>
            </TouchableHighlight>


            <Text style={{ textAlign: "center", color: "black", width: 250, padding: 0, marginTop: 20 }}>
                No tienes cuenta?
            </Text>

            <TouchableHighlight
                underlayColor="#0984e336"
                style={{ width: 250, backgroundColor: "#0984e314", padding: 10, borderRadius: 10, marginTop: 20 }}
                onPress={() => { navigation.navigate('Register'); }}>
                <Text style={{ textAlign: "center", color: "#0984e3" }}>Registrate</Text>
            </TouchableHighlight>
        </View>
    );
}
