import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Alert, Keyboard, Button as NativeButton} from 'react-native';
import { Button } from 'react-native-elements';
import Axios from 'axios';

class signup extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    render() {
        const Signup = user =>{
            const obj = {
                username: user.username,
                password: user.password
            }
            const config = {
                header: {
                    'content-type' : 'application/json'
                }
            }
            return 
            /*Axios.post("http://192.168.1.175:3000/users/login", JSON.stringify(obj), config)
                .then(res => { return res.json()})
                .catch(err => { console.log(err)})*/
                fetch('192.168.1.175:3000/users/register', {
                    method: 'post',
                    body: JSON.stringify(obj)
                  }).then(response => {
                    return response.json();
                  }).catch(err => {
                      console.log(err)
                  });
        }

        const handleChange = (key, val) => {
            this.setState({[key]: val});
        }

        const handleSummit = () => {
            if( this.state.username.length > 4 && this.state.password.length > 6){
                const userInfo = {
                    username: this.state.username,
                    password: this.state.password
                }

                Signup(userInfo).then(res => {
                    if (res){
                        this.props.navigation.navigate('login');
                    } else { Alert.alert(res,[{text:'ok'}]) }
                })
            }
        }

        return (
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
                <View>
                    <Text>Username</Text>
                    <TextInput
                        placeholder='Type in your desire username'
                        onChangeText={(val) => handleChange('username', val)}
                    />
                    <Text>Password</Text>
                    <TextInput
                        placeholder='Type in your desire password'
                        onChangeText={(val) => handleChange('password', val)}
                        secureTextEntry={true}
                    />
                    <Button
                        title='Sign Up'
                        onPress={handleSummit}
                    />
                    <NativeButton
                        title='I already have an account, lemme sign in :)'
                        onPress={() => this.props.navigation.navigate('login')}
                    />
                </View>
            </TouchableWithoutFeedback>
        )

    }
}

export default signup;