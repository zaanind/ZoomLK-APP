import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';  // Import WebView



export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const handleNavigation = (event) => {
    // Block navigation outside of 'zoom.lk'
    if (event.url.indexOf('zoom.lk') === -1) {
      return false;  
    }
    return true;  // Allow navigation if the URL is inside the zoom.lk domain
  };

 
  const injectedJavaScript = `
  window.open = function() { return false; };  // Block popups by overriding window.open
  true;  // Ensure the injected script executes successfully
`;

  return (
    <SafeAreaView style={styles.container}>
       <StatusBar hidden={true} />
        <WebView
        source={{ uri: 'https://zoom.lk' }}  // URL of the Zoom.lk website
        style={styles.webview}
        onShouldStartLoadWithRequest={handleNavigation} 
        injectedJavaScript={injectedJavaScript}
       // javaScriptEnabled={true}  
        onLoadStart={() => setLoading(true)}  // Start loading
        onLoadEnd={() => setLoading(false)}  // End loading
       // startInLoadingState={true}  // Show loading indicator while loading
      />

    
      {loading && (
        <View style={styles.loadingBar}>
          <View style={styles.loadingIndicator}></View>
        </View>
      )}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,  
     backgroundColor: '#43484e', 
   },
  webview: {
    flex: 1,  // WebView takes up the full screen
  },
  loadingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#ffffff',  // Set background color of the loading bar
  },
  loadingIndicator: {
    width: '100%',
    height: '100%',
    backgroundColor: '#007bff',  // Set the blue color for the loading bar
    animation: 'loading 3s infinite',
  },

  
});
