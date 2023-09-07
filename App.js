import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import AppNavigation from "./src/AppNavigation";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "./src/config/themeContext";
import theme from "./src/config/theme";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const [mode, setMode] = useState(false);
  const [isAuth, setIsAuth] = useState(false)
  useEffect(() => {
    async function authenticate() {
      const result = await LocalAuthentication.authenticateAsync();
      setIsAuth(result.success)
    }
    authenticate();
  }, []);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeTheme",
      (data) => {
        setMode(data);
      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  return (
    <themeContext.Provider value={mode === true ? theme.dark : theme.light}>
      {isAuth ? <AppNavigation /> : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{textAlign: 'center', fontSize: 25}}>USER NOT AUTHENTICATED!</Text></View>}
      <StatusBar hidden={true} />
    </themeContext.Provider>
  );
}
