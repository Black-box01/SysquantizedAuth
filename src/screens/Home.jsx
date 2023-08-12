import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { View, SafeAreaView, Image, TextInput, StyleSheet, Text, TouchableOpacity, FlatList, RefreshControl, Button, Switch, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect, useContext } from 'react'
import SysquantizedAuth from '../../assets/icon.png'
import { Feather, Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import totp from "totp-generator";
import { useNavigation, useIsFocused } from '@react-navigation/native'
import * as SQLite from 'expo-sqlite';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import themeContext from "../config/themeContext";
import * as Clipboard from "expo-clipboard";


const Home = () => {
  const theme = useContext(themeContext);
  const navigation = useNavigation()
  const focused = useIsFocused()

  const [db, setDb] = useState(SQLite.openDatabase('SysquantizedAuth2.db'));
  const [names, setNames] = useState([]);

  const [bg, setBg] = useState(true)
  const BottomSheetModalRef = useRef(null);
  const snapPoints = ['30%'];
  let [toggle, setToggle] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState('')
  const [sec, setSec] = useState(30);
  const [tC, setTC] = useState(false)
  const [copy, setCopy] = useState(true)
  let numColumns = 2

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM names', null,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
  }, [focused]);

  const deleteName = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM names WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter(name => name.id !== id);
            setNames(existingNames);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }
  // TOTP GENERATOR
  setInterval(() => {
    const totpg = totp('YEHJU3UEGH5JUD5R')
  }, 30000);


  // MODEL BACKGROUND DARK COLOR
  const handlePresentModal = () => {
    BottomSheetModalRef.current?.present();
    setBg(false)
  }


  // TIMER SECTION
  setTimeout(() => {
    const current = new Date();
    const time = current.toLocaleTimeString("en-US");
    var tt1 = time.slice(6, 8)
    setSec(tt1)
  }, 1000);
  
  var t1 = sec
  if (t1 >= 30) {
    var t2 = t1 - 30
    var t3 = 30 - t2
  } else {
    var t2 = t1
    var t3 = 30 - t2
  }

  setTimeout(() => {
    if(t3 <= 11){
      setTC(true)
    }else if(t3 >=11 || t3 == 30){
      setTC(false)
    }else{
      setTC(false)
    }
  }, 1000)
  
  const copyText = (text) => {
    Clipboard.setStringAsync(text);
    setCopy(true)
    setTimeout(() => {
      setCopy(false)
    }, 3000)
  }
  
    

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={[{ backgroundColor: bg ? theme.background : 'gray', flex: 1, color: bg ? 'black' : 'white' }]}>
        <Text style={{  color: 'white', fontSize: 28, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#0078d4', lineHeight: 40,}}>Sysquantized Auth</Text>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={styles.container}>
            <Image source={SysquantizedAuth} style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: 'white' }} />
            <TextInput placeholder='Search...' onChangeText={(text) => setQuery(text)} style={{ flex: 1, width: '50%', fontSize: 13, paddingHorizontal: 20, }} />
            <Feather name="search" size={18} color="black" />
          </View>
        </View>
        {refreshing ? null :
          <View style={{marginHorizontal: 10}}>
            <FlatList
              data={names}
              extraData={names}
              numColumns={numColumns}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              renderItem={({ item, index }) => {
                let hi = totp(item.token)
                if (item.name.toLowerCase().includes(query.toLowerCase())) {

                  return (
                    <TouchableOpacity onPress={(index) => {setToggle(!toggle), copyText(hi)}} style={{ width: '48%', borderRadius: 15, backgroundColor: theme.theme, marginHorizontal: 3, borderWidth: 2, borderColor: tC ? 'red' : 'white', marginBottom: 10}} key={index}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15}}>
                        <View>
                          <Image source={SysquantizedAuth} style={{ width: 35, height: 35, borderRadius: 10, backgroundColor: 'white' }} />
                          <Text style={{  fontSize: 12, letterSpacing: 1.2, color: theme.background, textAlign: 'center', marginTop: 5 }}>{item.name}</Text>
                        </View>
                        <View style={{ borderWidth: 2, borderRadius: 50, borderColor: tC ? 'red' : '#0078d4', width: 25, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 13, color: tC ? 'red' : '#0078d4' }}>{t3}</Text>
                        </View>
                      </View>

                      <View style={{backgroundColor: '#0078d4', borderBottomLeftRadius: 15, borderBottomRightRadius: 15}}>
                        <View>
                          <Text style={{ fontSize: 21,  letterSpacing: 5, color: tC ? '#A52A2A' : 'white', textAlign: 'center', paddingTop: 10, paddingBottom: 5, fontWeight: 'bold' }} selectable={true}>{hi}</Text>
                        </View>
                        {toggle ?
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingBottom: 5}}>
                            <Text style={{ color: '#ADF802' }}>{item.note}</Text>
                            <MaterialIcons name="delete" size={20} color="red" onPress={() => deleteName(item.id)} />
                          </View>
                          : null}
                      </View>
                    </TouchableOpacity>
                  )
                }
              }}
            />
            
        {copy ? 
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50,}}><Text style={{color: theme.background, padding: 10, borderRadius: 30, backgroundColor: theme.color, fontWeight: 'bold', width: 140, textAlign: 'center'}}>Token Copied!</Text></View> : null}
          </View>
        }

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
          <View style={{ padding: 0, backgroundColor: 'red', borderRadius: 50, alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderWidth: 2, borderColor: '#fff' }}>
            <Ionicons onPress={handlePresentModal} name="add" size={35} color="white" />
          </View>
        </View>
        <BottomSheetModal
          ref={BottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 50, backgroundColor: 'white' }}
          onDismiss={() => setBg(true)}
        >
          <View style={styles.list_container}>
            <TouchableOpacity style={styles.list} onPress={() => navigation.navigate('AddToken')}>
              <FontAwesome name="pencil-square-o" size={30} color="red" />
              <Text style={styles.text}>Add Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.list} onPress={() => navigation.navigate('Barcode')} >
              <FontAwesome name="qrcode" size={30} color="red" />
              <Text style={styles.text}>QR SCAN</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    backgroundColor: '#f2f4f2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 0,
  },
  list_container: {
    marginLeft: '12.5%'
  },
  list: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
    width: '70%',
  },
  text: {
    letterSpacing: 0.5,
    fontSize: 18,
    paddingLeft: 40,
  },
})

export default Home