import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Appbar } from 'react-native-paper';
import api from '../../../reducer/ActionCreator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from "react-native-gesture-handler";

export default function Contactos({ navigation }) {

  const [text, setText] = useState({ email: "", alias: "" });
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const contactos = useSelector(state => state.contactos)
  const { CONTACTOS } = api;
  const [ visible, setVisible ] = useState(false)

  const addContact = () => {
    axios
      .get(`http://192.168.0.2:3001/users/getUserByEmail/?email=${text.email}`)
      .then(({ data }) => {
        axios
          .post(
            `http://192.168.0.2:3001/contacts/${user.id}?contactId=${data.id}`
          )
          .then(({ data }) => {
            dispatch({
              type: CONTACTOS,
              payload: data
            })
            setVisible(!visible)
            setText({email: "", alias: ""})
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (contacto) => {
    axios
      .delete(`http://192.168.0.2:3001/contacts/${user.id}?contactId=${contacto}`)
      .then(({ data }) => {
        dispatch({
          type: CONTACTOS,
          payload: data
        })
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://192.168.0.2:3001/contacts/${user.id}`)
      .then(({data}) => {
        dispatch({
          type: CONTACTOS,
          payload: data
        })
      })
      .catch((err) => console.error(err));
  },[]);

  const handleTextChange = (name, value) => {
    setText({ ...text, [name]: value });
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
        <Appbar.Content title="Contactos" />
      </Appbar.Header>
      <View style={s.container}>
        <ScrollView>
          {
            contactos.length && contactos.map(el =>
              <View key={el.id} style={s.containerView}>
                <View style={s.containerNameAvatar}>
                <Avatar.Image size={50} source="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGT5W0D9qW_SkbX2W1OR7vC_ttDmX0mNnBPg&usqp=CAU" />
                <View style={s.containerNameEmail}>
                    {
                      !el.alias ?
                        <Text style={s.name}>{el.user.firstName} {el.user.lastName}</Text>
                        :
                        <Text style={s.name}>{el.alias}</Text>
                    }
                    <Text>{el.user.email}</Text>
                </View>
                </View>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                  <TouchableOpacity onPress={() => navigation.navigate('ModificarContacto', {id: el.contactId, idUser: user.id, firstName: el.user.firstName, lastName: el.user.lastName, alias: el.alias})} style={s.buttonEdit} >
                    <Text><MaterialCommunityIcons name="pencil" size={15} /></Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(el.contactId)} style={s.buttonDelete} >
                    <Text><MaterialCommunityIcons name="delete" size={15} color="#a44"/></Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </ScrollView>
          <TouchableOpacity onPress={() => setVisible(!visible)} style={s.button} >
            <Text><MaterialCommunityIcons name="plus" size={26} /></Text>
          </TouchableOpacity>
      </View>
      {
        visible ?
          <View style={s.containerAgregar}>
            <View style={s.containerAgregar2}>
              <TouchableOpacity onPress={() => setVisible(!visible)} style={s.buttonClose}>
                <Text><MaterialCommunityIcons name="close" size={26} /></Text>
              </TouchableOpacity>
              <Text style={{marginTop: 40, marginBottom: 10}}>Agregar Contacto</Text>
              <TextInput
                value={text.email}
                placeholder="Ingrese el email"
                onChangeText={(value) => handleTextChange("email", value)}
              />
              <TouchableOpacity onPress={() => addContact()} style={s.buttonAceptarCambios}>
                <Text>Agregar Contacto</Text>
              </TouchableOpacity>
            </View>
          </View>
          : null
      }
    </>
  );
}
const s = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  containerNameAvatar:{
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  containerNameEmail:{
    display: "flex", 
    alignItems: "flex-start", 
    justifyContent: "space-between", 
    marginTop: "auto", 
    marginBottom: "auto", 
    marginLeft: 5
  },
  name:{
    fontSize: 16,
    fontWeight: '600',
  },
  email:{
    fontSize: 12,
    fontWeight: "400",
    color: "#ddd"
  },
  containerView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttonEdit: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width: 30,
    height:30,
    backgroundColor:'#fff',
    borderRadius:50,
  },
  buttonDelete: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width: 30,
    height:30,
    backgroundColor:'#fff',
    borderRadius:50,
  },
  button: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width: 60,
    position: 'absolute',                                          
    bottom: 10,                                                    
    right: 10,
    height:60,
    backgroundColor:'#fff',
    borderRadius:80,
  },
  containerAgregar:{
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    position: "absolute", 
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    width: '100%',
  },
  containerAgregar2:{
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  buttonClose:{
    position: "absolute",
    right: 10,
    top: 10,
    justifyContent:"center",
    alignItems: "center",
    borderWidth:1,
    width: 40,
    height:40,
    backgroundColor:'#fff',
    borderRadius: 60,
  },
  buttonAceptarCambios: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 30,
    marginLeft: "auto",
    marginRight: 'auto',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 80,
    marginTop: 20,
  }
});

