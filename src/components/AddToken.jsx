import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View, TextInput, Button, Platform, ScrollView, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import themeContext from "../config/themeContext";

export default function AddToken() {
  const theme = useContext(themeContext);
  const navigation = useNavigation()
  const [db, setDb] = useState(SQLite.openDatabase('SysquantizedAuth2.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);
  const [currentSecureId, setCurrentSecureId] = useState(undefined);
  const [currentNote, setCurrentNote] = useState(undefined);

  const importDb = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true
    });

    if (result.type === 'success') {
      setIsLoading(true);

      if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
      }

      const base64 = await FileSystem.readAsStringAsync(
        result.uri,
        {
          encoding: FileSystem.EncodingType.Base64
        }
      );

      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'SQLite/SysquantizedAuth2.db', base64, { encoding: FileSystem.EncodingType.Base64 });
      await db.closeAsync();
      setDb(SQLite.openDatabase('SysquantizedAuth2.db'));
    }
  };

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, token TEXT, note TEXT)')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM names', null,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });

    setIsLoading(false);
  }, [db]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading names...</Text>
      </View>
    );
  }

  const addName = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO names (name, token, note) values (?,?,?)', [currentName, currentSecureId, currentNote],
        (txObj, resultSet) => {
          let existingNames = [...names];
          existingNames.push({ id: resultSet.insertId, name: currentName, token: currentSecureId, note: currentNote });
          setNames(existingNames);
          setCurrentName(undefined);
          setCurrentSecureId(undefined);
          setCurrentNote(undefined);
          navigation.navigate('Home2')
        },
        (txObj, error) => console.log(error)
      );
    });
  }


  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={{ alignItems: 'center', justifyContent: 'center', }}>
        <TouchableOpacity style={{ width: '70%', alignItems: 'center', backgroundColor: 'red', height: 30, justifyContent: 'center', borderRadius: 10}} onPress={() => importDb()}><Text style={{color: '#fff', fontWeight: 'bold', letterSpacing: 0.7, fontSize: 15}}>Import DataBase</Text></TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: '80%' }}>
          <Text style={{ fontSize: 20, marginVertical: 30, letterSpacing: 1, color: theme.color, textAlign: 'center', }}>Service Information</Text>
          <Text style={styles.name}>Service Name</Text>
          <TextInput style={[styles.input, { backgroundColor: 'white' }]} placeholder='Application Name' value={currentName} onChangeText={txt => setCurrentName(txt)} />
          <Text style={styles.name}>Secret Name </Text>
          <TextInput style={[styles.input, { backgroundColor: 'white' }]} placeholder='Secure ID' value={currentSecureId} onChangeText={txt => setCurrentSecureId(txt)} />
          <Text style={styles.name}>Application Info</Text>
          <TextInput style={[styles.area, { backgroundColor: 'white' }]} multiline={true}
            numberOfLines={4} placeholder='More Personal Info' value={currentNote} onChangeText={txt => setCurrentNote(txt)} />
          <Button title="Add Token" onPress={addName} />
        </View>
      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  name: {
    color: 'white',
    letterSpacing: 1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    marginBottom: 30
  },
  area: {
    height: 90,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    marginBottom: 20
  }
})
