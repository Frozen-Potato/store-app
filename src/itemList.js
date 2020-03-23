import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import {Button} from 'react-native-elements';
import axios from 'axios';

export default class itemList extends Component {
    constructor(props){
        super(props);

        this.state={
            items: [],
            isLoggedIn: false,
            username: ''
        }
    }

    async componentDidMount() {
        this.props.navigation.addListener('didFocus', () => 
        AsyncStorage.getItem('token').then(token => {
            if(token){
                this.setState({isLoggedIn: true})
                AsyncStorage.getItem('username').then(user => {this.setState({username: user})})
            }
            console.log(token)
        }) );
        /*axios.get('http://192.168.1.175:3000/items')
            .then((res) => {
                this.setState({
                    items: res.data,
                    searchTerm: ''
                });
                console.log(items);
            })
            .catch((error) => { console.log(error)});
            */
        try {
            const response = await fetch('http://192.168.1.175:3000/items');
            const data = await response.json();
            console.log(data.items);
            this.setState({
                items: [...data.items],
                searchTerm: ''
            });
    
          } catch(error) {
              console.log(error)
          }
        };
    

    async logout() {
        try{
            await AsyncStorage.removeItem('token').then(() => this.props.navigation.navigate('login'))
        } catch(error) {console.error()};
    };

    render(){
        const handleChange = (val) => {
            this.setState({
                searchTerm: val
            })
        }

        const deletePost = (id) => {
            AsyncStorage.getItem('token').then(token => {
                /*axios.delete('http://192.168.1.175:3000/items/{$id}',{
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }).then(res => {console.log(res)})
                .catch(err => {console.log(err)})
            })*/
                return fetch(`http://192.168.1.175:3000/items/${id}`, {
                    method: 'delete',
                    headers: {
                        'Authentication': 'Bearer' + token
                    },
                    body: JSON.stringify(obj)
                }).then(response => {
                    console.log(response)
                }).catch(err => {
                    console.log(err)
                });

            });
        }
        const user = this.state.username;
        const filteredKey = ['category','postDate','location','title'];
        const filteredItems = this.state.items.filter(createFilter(this.state.searchTerm, filteredKey));
        const isLoggedIn = this.state.isLoggedIn;

        
        if(isLoggedIn) {return(
            <View>
                <SearchInput
                    placeholder='Type something in here'
                    onChangeText={(val) => handleChange(val)}
                />
                <Button
                    title='logout'
                    onPress={this.logout}
                />
                <Button
                    title='Add Item'
                    onPress={this.props.navigation.navigate('NewItem')}
                />

                <ScrollView>
                    {
                        filteredItems.map(item => {
                                return(
                                    <View key={item.id}>
                                        <Text>Title: {item.title}</Text>
                                        <Text>Description: {item.description}</Text>
                                        <Text>Category: {item.category}</Text>
                                        <Text>Location: {item.location}</Text>
                                        <Text>Price: {item.price}</Text>
                                        <Text>Delivery Type : {item.deliveryType}</Text>
                                        <Text>Seller : {item.sellerName}</Text>
                                        <Text>Contact Number: 0{item.contactNumber}</Text>
                                        {user == item.sellerName ? (
                                            <Button 
                                                title='Modify'
                                                onPress={() => this.props.navigation.navigate('modifyItem',{
                                                    id: item.id,
                                                    title: item.title,
                                                    description:item.description,
                                                    category: item.category,
                                                    location: item.location,
                                                    images: item.images,
                                                    price: item.price,
                                                    deliveryType: item.deliveryType,
                                                    sellerName: item.sellerName,
                                                    contactNumber: item.contactNumber
                                                })}
                                            /> 
                                        ) : (null)}
                                        {user == item.sellerName ? (
                                            <Button
                                                title='Delete'
                                                onPress={() => deletePost(item.id)}
                                            />
                                        ) : (null)}
                                    </View>
                                )
                            }
                            )
                    }
                </ScrollView>
            </View>)
        } else {
            return (
            <View>
                <SearchInput
                    placeholder='Type something in here'
                    onChangeText={(val) => handleChange(val)}
                />
                <Button
                    title='login'
                    onPress={() => this.props.navigation.navigate('login')}
                />
                <ScrollView>
                    {
                        filteredItems.map(item => {
                                return(
                                    <View key={item.id}>
                                        <Text>Title: {item.title}</Text>
                                        <Text>Description: {item.description}</Text>
                                        <Text>Category: {item.category}</Text>
                                        <Text>Location: {item.location}</Text>
                                        <Text>Price: {item.price}</Text>
                                        <Text>Delivery Type : {item.deliveryType}</Text>
                                        <Text>Seller : {item.sellerName}</Text>
                                        <Text>Contact Number: 0{item.contactNumber}</Text>
                                    </View>
                                )
                            })
                    }
                </ScrollView>
            </View>
            )}
        
    }
}