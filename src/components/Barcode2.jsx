import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import scan from '../../assets/stocks/scan.png'

const Barcode2 = () => {
    const navigation = useNavigation()
    const [hasPermission, setHasPermission] = useState(false);
    const [scanData, setScanData] = useState();

    useEffect(() => {
        (async() => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted')
        })();
    }, []);

    if(!hasPermission){
        return(
            <View style={styles.container}>
                <Text>Please Grant Camera Permission for QR CODE to function!</Text>
            </View>
        )
    }

    const handleBarCodeScanner = ({type, data}) => {
        setScanData(data);
    }

    if (scanData){
        navigation.navigate('Barcode_item', {secure: scanData})
    }

  return (
    <View style={styles.container}>
      <BarCodeScanner 
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanData ? undefined : handleBarCodeScanner}
      />
        <Image source={scan} style={{height: 200, width: '100%'}} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Barcode2