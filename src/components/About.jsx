import React, {useContext} from 'react'
import { View, Text } from 'react-native'
import themeContext from '../config/themeContext';

const About = () => {
  const theme = useContext(themeContext);
    return (
        <View style={{backgroundColor: theme.background, flex: 1}}>
            <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', marginTop: 10, marginBottom: 5 }}>About Sysquantized Auth</Text>
            <Text style={{color: theme.color, fontSize: 17, marginHorizontal: 20}}>Sysquantized Auth is an Authenticator app that generates TOTP (Time based One Time Password) for the security of other applications. This application has the functionality of generating TOTP, Tokens count down timer (time remaining for the tokens or TOTP to be changed), search functionality, QR CODE scanner, notification session to pass information to application users, finger print authentication (biometric scanner), theming (light and dark mode), importing and exporting of tokens, deleting token in database, and most importantly security (secure key security).</Text>
        </View>
    )
}

export default About
