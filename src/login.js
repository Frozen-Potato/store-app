import React, { useReducer, useState, Component } from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Alert, Keyboard, Button as NativeButton} from 'react-native';
import { Button } from 'react-native-elements';
import Axios from 'axios';

class login extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: ''
        }
    }

    async saveItem(item, selectedValue) {
        try{
            await AsyncStorage.setItem(item, selectedValue)
        } catch(error) {
            console.error();
        }
    }
    render() {
        const Login = async user => {
            const obj = {
                username: user.username,
                password: user.password
            }
            try {
                const response = await fetch('http://192.168.1.175:3000/users/login', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj)
                });
                const data = await response.json();
                this.saveItem('token', data.Token);
                console.log(data.Token);
            }
            catch (err) {
                console.log(err);
            }
        }

        const handleChange = (key, val) => {
            this.setState({[key] : val})
        }

        const handleSummit = () => {
            const userInfo = {
                username: this.state.username,
                password: this.state.password
            }

            Login(userInfo).then(res => {
                if (!res){
                    this.props.navigation.navigate('itemList');
                } //else {Alert.alert(res,[{text:'ok'}])}
                else {}
            })
        }
        return(
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
                <View>
                    <Text>Username</Text>
                    <TextInput 
                        placeholder='Enter your username'
                        onChangeText={(val => handleChange('username', val))}
                    />
                    <Text>Password</Text>
                    <TextInput
                        placeholder='Enter your password'
                        onChangeText={(val => handleChange('password',val))}
                        secureTextEntry={true}
                    />
                    <Button
                    title='Login'
                    onPress={handleSummit}
                    />
                    <NativeButton 
                    title='create a new account'
                    onPress={() => this.props.navigation.navigate('signup')}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

export default login;
