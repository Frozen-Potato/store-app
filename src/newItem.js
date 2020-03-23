import react, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Alert, Keyboard, Button as NativeButton, AsyncStorage, CameraRoll} from 'react-native';
import { Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Axios from 'axios';

export default class itemList extends Component {
    constructor(props){
        super(props);

        this.state = {
            title: '',
            description: '',
            category: '',
            location: '',
            image: [],
            price: '',
            deliveryType: '',
            sellerName: '',
            contactNumber: '',
            token: '',
            username: ''
        }

    }

    render() {
        const addItem = itemInfo => {
            const obj = {
                title: itemInfo.title,
                description: itemInfo.description,
                category: itemInfo.category,
                location: itemInfo.location,
                image: itemInfo.image,
                price: itemInfo.price,
                deliveryType: itemInfo.deliveryType,
                sellerName: itemInfo.sellerName,
                contactNumber: itemInfo.contactNumber
            }
            AsyncStorage.getItem('token').then(token => {
                this.setState({token : token})
            })
            
            const config = {
                header: {
                    Authorization: 'Bearer ' + this.state.token,
                    'content-type' : 'application/json',
                    'content-type' : 'application/form-data'
                }
            }
            /*Axios.post('http://192.168.1.175:3000',JSON.stringify(obj),config).then(res => {return res.json()}).catch(err =>{console.log(err)})*/
            fetch('http://192.168.1.175:3000/items', {
                method: 'post',
                headers: {
                    'Authentication': 'Bearer' + this.state.token,
                    'Content-Type': 'multipart/form-data',
                    'Content-Type': 'application/json'
                  },
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
            AsyncStorage.getItem('username').then(user => {
                this.setState({username: user})
            })
            const itemInfo = {
                title: this.state.title,
                description: this.state.description,
                category: this.state.category,
                location: this.state.location,
                image: this.state.image,
                price: this.state.price,
                deliveryType: this.state.deliveryType,
                sellerName: this.state.username,
                contactNumber: this.state.contactNumber
            }
            addItem(itemInfo).then(item => {
                if(item){
                    this.props.navigation.navigate('itemList');
                    Alert.alert('Item has been uploaded :p','your item is up and running',[{text: 'Ok'}])
                }
                else {
                    Alert.alert('Failed, pls try again', "pls try again", [{text: 'ok'}])
                };
            })
        }

        const chooseImage = async() => {
            let cameraRoll = await ImagePicker.requestCameraPermissionsAsync();
            if(cameraRoll.granted === false){
                Alert.alert("unaccessable","the app could not access your photos", [{text: 'ok'}])
            }
            let photo = await ImagePicker.launchImageLibraryAsync();
            if (photo.cancelled == true){
                Alert.alert('Sorry','we could not display yo photos', [{text: 'ok'}])
            } else {
                this.setState({image: photo.uri})
            }
        }

        return(
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();} }>
                <View>
                    <Text>Title of Item:</Text>
                    <TextInput
                        placeholder='Enter da title'
                        onChangeText={(val) => handleChange('title', val)}
                    />
                    <Text>Description of Item:</Text>
                    <TextInput
                        placeholder='Enter da description'
                        onChangeText={(val) => handleChange('description', val)}
                    />
                    <Text>Category of Item:</Text>
                    <TextInput
                        placeholder='Enter da category'
                        onChangeText={(val) => handleChange('category', val)}
                    />
                    <Text>Location of Item:</Text>
                    <TextInput
                        placeholder='Enter da location'
                        onChangeText={(val) => handleChange('location', val)}
                    />
                    <Text>Image of Item:</Text>
                    <Button
                        onPress={chooseImage}
                    />
                    <Text>Price of Item:</Text>
                    <TextInput
                        placeholder='Enter da price'
                        onChangeText={(val) => handleChange('price', val)}
                    />
                    <Text>Delivery Type of Item:</Text>
                    <TextInput
                        placeholder='Enter da delivery type' 
                        onChangeText={(val) => handleChange('deliveryType', val)}
                    />
                    <Text>Contact Number:</Text>
                    <TextInput
                        placeholder='Enter da Contact Number'
                        onChangeText={(val) => handleChange('contactNumber', val)}
                    />
                    <Button
                        title='Summit'
                        onPress={handleSummit}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }

}