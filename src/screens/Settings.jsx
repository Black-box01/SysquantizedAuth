import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import { Feather, MaterialIcons, MaterialCommunityIcons, Entypo, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners'
import themeContext from "../config/themeContext";
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const Settings = (props) => {
  const navigation = useNavigation()
  const theme = useContext(themeContext);
  const [mode, setMode] = useState(true)
  const [bio, setBio] = useState(true)
  
  const exportDb = async () => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + 'SQLite/SysquantizedAuth2.db',
          {
            encoding: FileSystem.EncodingType.Base64
          }
        );

        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, 'SysquantizedAuth2.db', 'application/octet-stream')
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding : FileSystem.EncodingType.Base64 });
        })
      } 
    } else {
      await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/SysquantizedAuth2.db');
    }
  }


  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <MaterialIcons name="security" size={31} color="#0078d4" />
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between', color: theme.color }}>
        <Text style={{ paddingLeft: 30, fontSize: 20, letterSpacing: 1, color: theme.color }}>Security</Text>
        <Switch value={bio} onValueChange={() => {
            setBio((value) => !value);
          }}/>
        </View>
      </View>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <MaterialCommunityIcons name="theme-light-dark" size={31} color="#0078d4" />
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between', color: theme.color }}>
          <Text style={{ paddingLeft: 30, fontSize: 20, letterSpacing: 1, color: theme.color }}>Appearance</Text>
          <Switch value={mode} onValueChange={() => {
            setMode((value) => !value);
            EventRegister.emit('changeTheme', mode)
          }}
          />
        </View>
      </View>
      <TouchableOpacity style={[styles.container, { backgroundColor: theme.background }]} onPress={exportDb}>
        <AntDesign name="export" size={29} color="#0078d4" />
        <Text style={{ paddingLeft: 30, fontSize: 20, letterSpacing: 1, color: theme.color }}>Export Token</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.container, { backgroundColor: theme.background }]} onPress={() => {Alert.alert('Database Deleted!')}}>
        <Feather name="trash-2" size={31} color="#0078d4" />
        <Text style={{ paddingLeft: 30, fontSize: 20, letterSpacing: 1, color: theme.color }}>Trash</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.container, { backgroundColor: theme.background }]} onPress={() => navigation.navigate('About')}>
        <Entypo name="info" size={29} color="#0078d4" />
        <Text style={{ paddingLeft: 30, fontSize: 20, letterSpacing: 1, color: theme.color }}>About</Text>
      </TouchableOpacity>

      <View style={styles.icons}>
        <Entypo name="youtube" size={45} color="red" />
        <Entypo name="twitter" size={35} color="blue" />
        <FontAwesome5 name="discord" size={35} color="skyblue" />
        <Entypo name="github" size={35} color="purple" />
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 16,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: '20%',
    marginTop: 60
  }
})

export default Settings