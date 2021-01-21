import * as React from 'react';
import { StatusBar, FlatList, Image, ImageBackground, Animated, Text, View, Dimensions, StyleSheet, TouchableOpacity, Easing, SafeAreaViewBase, SafeAreaView } from 'react-native';
const { width, height } = Dimensions.get('screen');
import faker from 'faker'

faker.seed(10);
const DATA = [...Array(500).keys()].map((_, i) => {
    return {
        key: faker.random.uuid(),
        image: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
        name: faker.name.findName(),
        jobTitle: faker.name.jobTitle(),
        email: faker.internet.email(),
        
    };
});

const  BG_IMG ='https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg';
const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING+3;

export default () => {


  const scrollY = React.useRef(new Animated.Value(0)).current;
    return (
      <ImageBackground 
        source={{uri:BG_IMG}}
        style={{...StyleSheet.absoluteFillObject}}
        blurRadius={10}
      >    
      <StatusBar hidden />
        <Animated.FlatList 
          data={DATA}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver:true},          
          )}
          contentContainerStyle={{
            padding:SPACING,
            paddingTop:StatusBar.height,
          }}
         
          legacyImplementation={true}
          horizontal={false}
          windowSize={50}
          removeClippedSubviews={true}
          initialNumToRender={26}
          updateCellsBatchingPeriod={30}
          numColumns={1}
          onEndReachedThreshold={0.7}
          refreshing={true}
          maxToRenderPerBatch={20}
          keyExtractor={item => item.key}
          renderItem={({item, index} ) =>{
            const inputRange = [
              -1, 
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index +2)
            ]
            const scale = scrollY.interpolate({
              inputRange,
              outputRange:[1,1,1,0]
            })
            const opacityinputRange = [
              -1, 
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index +1)
            ]
            const opacity = scrollY.interpolate({
              inputRange:opacityinputRange,
              outputRange:[1,1,1,0]
            })
            return(
              <Animated.View style={{
                flexDirection:'row',
                marginBottom:SPACING,
                borderRadius:12,
                alignItems:"center",
                //justifyContent:"center",
                backgroundColor:"rgba(0,0,0,.3)",
                shadowColor:"#000",
                shadowOffset:{
                  width:0, height:10
                },
                shadowOpacity:.4,
                shadowRadius:20,
                opacity,
                transform:[{scale}]
              }}>
                <Image 
                 source={{uri:item.image}}
                 style={{
                   width:AVATAR_SIZE, 
                   height:AVATAR_SIZE, 
                   borderRadius:AVATAR_SIZE,
                   marginRight:SPACING/2,
                   
                  }}
                />
                <View>
                  <Text style={{fontSize:22, fontWeight:'700'}}>{item.name}</Text>
                  <Text style={{fontSize:18, opacity:.7}}>{item.jobTitle}</Text>
                  <Text style={{fontSize:14, opacity:.7 , color:"#0099cc"}}>{item.email}</Text>
                </View>
                
              </Animated.View>
            )
          }}
        />
      </ImageBackground>
    )
}

/**
 * 
 * 
 * 
 */
