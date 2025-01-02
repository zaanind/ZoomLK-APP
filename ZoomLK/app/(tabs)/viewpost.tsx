import { Image, StyleSheet, Platform } from'react-native';

import React, { useState, useEffect } from'react';

import axios from 'axios';
import {  Button, ScrollView, StatusBar, View, Text } from'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';


export default function FullPostScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setIsLoading] = useState(true);
    const { postId } = route.params;

    const [post, setPost] = useState(null);
    useEffect(() => {
      // Fetch the post data using the postId
      const fetchPost = async () => {
        try {
          const response = await fetch(`https://zoom.lk/wp-json/wp/v2/posts/${postId}`);
          //console.log(response);
          const data = await response.json();
          console.log(data);
  
          setPost(data);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
      fetchPost();
    }, [postId]);
  
    if (!post) {
      return (<Text style={styles.title} >>Loading...</Text>);
    }

    const backbtnpress = () => {
      navigation.navigate('index');
    };

    const tagsStyles = {
      div: {     
        color: '#fff'
      },
      span: {     
        color: '#fff'
      }, 
    }

   // var stylehtml = "<style>.css-text-146c3p1 {color: #fff;}</style>";

  
    return (
      <ScrollView style={styles.container}>
               <Image source={{ uri: 'https://zoom.lk/wp-content/uploads/2024/12/14th-Ann-logo.png' }} resizeMode='contain' style={styles.logo} />

            <Button
             onPress={backbtnpress}
             title="Back"
             color="#841584"
             marginBottom="20px"
             hidden
            accessibilityLabel="Previous Page"
              />
         <Text style={styles.title}> {post.title.rendered} </Text>
         <Image source={{ uri: post.jetpack_featured_media_url }} style={styles.image}
             resizeMode='contain' />

  
        <RenderHtml style={styles.content} source={{html: post.content.rendered }} tagsStyles={tagsStyles} />

          
       </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#43484e', 
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#fff',
    },
    content: {
      fontSize: 16,
    },
    
   image: {
    width: '100%',
    height: '200px',
    marginBottom: '30px',
   
    },
    loadingBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 6,
      backgroundColor: '#007bff',  // Set background color of the loading bar
    },
    loadingIndicator: {
      width: '100%',
      height: '100%',
      backgroundColor: '#007bff',  // Set the blue color for the loading bar
      animation: 'loading 3s infinite',
    },
    logo: {
      width: '200px',
      height: '80px', 
      alignSelf:'center',
      marginBottom: '10px',
   },
   content: {
    color: '#fff'
   }

  });
  

  

 