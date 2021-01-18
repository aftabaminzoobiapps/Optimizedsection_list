  import React, { useState, useEffect, useRef, useMemo } from 'react';
  import { SafeAreaView,Dimensions, SectionList, TextInput, FlatList,ActivityIndicator, Animated, StyleSheet, View, Text, PermissionsAndroid, StatusBar, NativeModules, TouchableOpacity} from 'react-native';
  const { MyCustomWindowManager } = NativeModules;
  import CallDetectorManager from 'react-native-call-detection'
  import Contacts from 'react-native-contacts';
  import FontAwesome  from 'react-native-vector-icons/FontAwesome';
  import EvilIcon from 'react-native-vector-icons/EvilIcons'
  import Entypo from 'react-native-vector-icons/Entypo'
  import Icon from 'react-native-vector-icons/Ionicons'

  // const RenderItem = ({item}) => {
  //   if(item.phoneNumbers.length !== 0){
  //     return useMemo(() => {
  //     return (
  //         item.phoneNumbers.map(phone => (
  //         <TouchableOpacity key={phone}  style={styles.single_contact_style}>
  //           <EvilIcon name='user' size={40} color='#fff' style={{alignSelf:"center"}}/> 
  //           <View style={styles.name_number_view}>
  //             <Text style={[styles.text, {fontWeight:"bold"}]}>{item.name}</Text>
  //             <Text style={styles.text}>{phone}</Text>
  //           </View>        
  //       </TouchableOpacity>
  //     ))
  //     )
  //   }, []);
  // }else{ return null}
  // }

  class RenderItem extends React.PureComponent {
    render(){
      const {item} = this.props;
      return (
          item.phoneNumbers.map(phone => (
            <TouchableOpacity key={phone}  style={styles.single_contact_style}>
              <EvilIcon name='user' size={40} color='#fff' style={{alignSelf:"center"}}/> 
              <View style={styles.name_number_view}>
                <Text style={[styles.text, {fontWeight:"bold"}]}>{item.name}</Text>
                <Text style={styles.text}>{phone}</Text>
              </View>        
            </TouchableOpacity>
          ))
      )
    }
  }

  const App = () => {

    const [contacts,setContacts] = useState([])
    const [searchdata,setSearchData] = useState([])
    const [loading, setLoading] = useState(true)
    const [search_text, setSearch_text] = useState("")
    const [permission , setPermission] = useState(false)
    
    useEffect(() => {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      ]).then((result) =>{
        setPermission(result['android.permission.READ_CONTACTS']);
      
      }).catch((err) => {
        console.log(err)
      })
    },[]);

    
    useEffect(() =>{
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then((res) =>{
        if(res){
          Contacts.getAll().then(contacts1 => {
            let items = []
            contacts1.forEach((item,index) =>{
              items.push({
                key:index,
                name:item.displayName,
                phoneNumbers:[...new Set(item.phoneNumbers.map(x => x.number.replace(/-|\s/g,"")))]
              })
            })
            setContacts(items)
            getData();
          })
        }else{
            alert("Please Enable Permission");
        }
      })    
    },[loading])
    
    const getData = () => {
    
      let contactArr = [];
      let aCode  = "A".charCodeAt(0); 
        for(let  i = 0 ; i<26 ;i++){
          let currChar  = String.fromCharCode(aCode+i);
          let obj ={
              title:currChar
          }
    

      let currContacts  = contacts.filter(item => {
          return item.name[0].toUpperCase() === currChar;
      });

      if(currContacts.length > 0){
          currContacts.sort((a,b) => a.name.localeCompare(b.name))
          obj.data = currContacts;
          contactArr.push(obj);
        }
      }
    setSearchData(contactArr)
    setLoading(false);
    }
   
   
    const renderMessage = () => {
      return (
          <View style={{flex:1, marginTop:'20%', justifyContent:"center", alignItems:"center"}}>
              <Icon name="md-alert-circle-outline" color="red" size={50} />
              <Text style={{color:'white',fontSize:20}}>
                  No Contact
              </Text>
          </View>
      );
  };


    const searchFilterFunction = (text) => {
      console.log('We Well Implement this later')
      // setSearch_text(text);  
      //   const newData = contacts.filter(item => {      
      //     const itemData = `${item.name.toUpperCase()} ${item.phoneNumbers.map(phone => phone.toUpperCase())}`
      //     const textData = text.toUpperCase();
      //     return itemData.indexOf(textData) > -1;    
      //   });
      // setSearchData(newData)
    };

    // const _renderItem = ({item}) => (
    //   <RenderItem  item={item} />
    // );
   if(searchdata.length){
    return (
      <View style={styles.container}> 
        <StatusBar barStyle="dark-content" backgroundColor="#99c0ff"  /> 
        <SafeAreaView>
        
          <View style={styles.search_view} >
              <FontAwesome name='search' size={20} color='#fff' style={{}} />
              <TextInput 
                style={{
                  backgroundColor:"rgba(135, 135, 135, .1)", 
                  height:35,
                  borderRadius:10,
                  paddingHorizontal:10,
                  fontSize:12, 
                  color:"#fff",
                  minWidth:Dimensions.get("screen").width - 90 
                }}
                placeholder="Search contact here"
                placeholderTextColor="#fff"
                value={search_text}
                onChangeText={(text) => searchFilterFunction(text)}
              />
              <Entypo name="cross" size={20} color={search_text.length === 0 ?'black':'#fff'}
                onPress={() => searchFilterFunction("")}
              />
          </View>
      
          {!loading 
          ? 
            <SectionList
              sections={searchdata}
              renderItem={({item}) => (
                <RenderItem  item={item} />
                 )} 
             // renderItem={_renderItem}
              legacyImplementation={false}
              horizontal={false}
              windowSize={121}
              removeClippedSubviews={false}
              initialNumToRender={30}
              updateCellsBatchingPeriod={1}
            //  numColumns={1}
              onEndReachedThreshold={1}
               getItemLayout={(data, index) => (
                 {length: 54, offset: 54 * index, index}
               )}
              //refreshing={true}
              maxToRenderPerBatch={50}
              viewabilityConfig={{ 
                waitForInteraction: true,
                viewAreaCoveragePercentThreshold: 95}}
              keyExtractor={(item) =>{
                return item.key.toString()
              }}
              renderSectionHeader={({section}) =>(
                <View style={styles.section_title}>
                    <Text style={[styles.text,{color:"#fff", fontWeight:"bold", fontSize:16,}]}>{section.title}</Text>
                </View>
            )}
              ListEmptyComponent={renderMessage}                                       
            />
          :
          <ActivityIndicator size="large" color="red" />
          }
        </SafeAreaView>
      </View>
    )}else{
      return(
        <View style={styles.container}>
            <Text>Loading</Text>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container:{
      flex:1,
      alignItems:"center",
      backgroundColor:"#8ab7ff",
    // backgroundColor:"white",
      justifyContent:"center",
    },
    search_view:{
      flexDirection:"row",
      backgroundColor:"black",
      minWidth:Dimensions.get('screen').width-10,
      borderRadius:10,
      marginTop:2,
      paddingHorizontal:5,
      marginHorizontal:5,
      paddingVertical:2, 
      alignItems:"center",
      justifyContent:"space-evenly"
    },
    section_title:{
      backgroundColor:"rgba(204, 223, 252, .2)",
      borderRadius:5,
      marginTop:5,
      minWidth:Dimensions.get('screen').width-10,
      paddingHorizontal:15,
      marginHorizontal:5,
      paddingVertical:3, 
    },
    text:{
      fontSize:12,
      color:'white',
    },
    single_contact_style:{
      backgroundColor: '#6b6b6b', 
      borderRadius:10,
      maxHeight:50,
      paddingHorizontal:10,
      marginVertical:4,
      minWidth:Dimensions.get('screen').width-10,
      marginHorizontal:5,
      flexDirection: 'row',
    },
    name_number_view:{
      justifyContent:'space-around',
      paddingVertical:5, 
      paddingHorizontal:10, 
      flexDirection: 'column'
    }
  });

  export default App;
