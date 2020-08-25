

import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';

import HttpUtils from './HttpUtils';
import Geolocation from 'react-native-geolocation-service';



const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

var map1 = new Map();
var response;


export default class App extends Component
{
  constructor(props){
    
    super(props);
    this.state = {
        myCity:"",
        lon:"",
        lat:"",
        isLoading:false,
        response:[],
        temp:"",
    };
    
    
  }

  componentDidMount()
  {
    this.findCoordinates();
  }
  
 
  findCoordinates = () => {

      PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        Geolocation.getCurrentPosition(
        (pos) => {
        const lon = JSON.stringify(pos.coords.longitude);
        const lat = JSON.stringify(pos.coords.latitude);
        this.setState({ lat: lat, lon: lon });
        this.forceUpdate();
        this.getData();
      },
      error => alert("permission denied go to settings and enable permission."),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

 async getData(){
   await HttpUtils.get('/data/2.5/forecast?lon='+this.state.lon+'&lat='+this.state.lat+'&APPID=94f7b7462a8b3ff39cdd63dc14de8de2').
   then(response => this.setState({myCity:response.data.city.name, response:response,temp:parseInt(response.data.list[0].main.temp-273)
    
  }))
  this.fun1();
  this.setState({isLoading:false});
 }


fun1()
 {
   response = this.state.response;
   var i;
   for(i=0;i<40;i=i+8)
    {
        var timestamp = response.data.list[i].dt_txt;
        var date = new Date(timestamp);
        //var day = date.toDateString().substring(0,3);
        var temp = parseInt(response.data.list[i].main.temp-273);
        map1.set(i,timestamp.substring(0,10)+"                          "+temp);
    }
 }




  
  render()
  {
    return(
       <View style = {styles.mainPanel}>
            <View style = {styles.tempArea}>
                 <Text style={{fontSize:100,textAlign:"center"}}>{this.state.myCity}</Text>
                 <Text style={{fontSize:50,textAlign:"center"}}>{this.state.temp+"c"}</Text>
                 
            </View>
            <View style = {styles.restArea}> 
            <View>
              <Text style={{fontSize:20,textAlign:'center'}}>{map1.get(0)}</Text>
              <View style={{borderBottomColor: 'black',borderBottomWidth: 1,margin:20}}></View>
              <Text style={{fontSize:20,textAlign:'center'}}>{map1.get(8)}</Text>
              <View style={{borderBottomColor: 'black',borderBottomWidth: 1,margin:20}}></View>
              <Text style={{fontSize:20,textAlign:'center'}}>{map1.get(16)}</Text>
              <View style={{borderBottomColor: 'black',borderBottomWidth: 1,margin:20}}></View>
              <Text style={{fontSize:20,textAlign:'center'}}>{map1.get(24)}</Text>
              <View style={{borderBottomColor: 'black',borderBottomWidth: 1,margin:20}}></View>
              <Text style={{fontSize:20,textAlign:'center'}}>{map1.get(32)}</Text>
            </View>
            
            <Text></Text>
            </View>
       </View>
       
    );
  }
}

const styles = StyleSheet.create({
    
  mainPanel :{
     height: windowHeight,
     width : windowWidth,
  },
  tempArea: {
     height : 4*windowHeight/10,
     width : windowWidth,
     backgroundColor: 'white'
  },

  restArea:{
    height: 6*windowHeight /10,
    width : windowWidth,
    backgroundColor: 'gray',
    justifyContent:'center'
  },

})


