import { Image, StyleSheet, Platform } from'react-native';

import React, { useState, useEffect } from'react';

import axios from 'axios';
import {  TouchableOpacity ,Button, ScrollView, StatusBar, View, Text } from'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';






export default function HomeScreen() {
  const [currentpage, setCurrentPage] = useState('1');
  const [posts, setPosts] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const handlePostPress = (postId) => {
    navigation.navigate('viewpost', { postId: postId });
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://zoom.lk/wp-json/wp/v2/posts?page='+ currentpage);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message || 'An error occurred while fetching posts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentpage]);

  const renderPosts = () => {
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    const getFeaturedImage = async (post) => {
      try {
        const imageResponse = await axios.get(post._links['wp:featuredmedia'][0].href);
        return imageResponse.data.guid.rendered;
      } catch (error) {
        console.error('Error fetching featured image:', error);
        return null;
      }
    };

    const [images, setImages] = useState({});
    useEffect(() => {
      const fetchImages = async () => {
        const newImages = {};
        for (const post of posts) {
          const imageUri = await getFeaturedImage(post);
          newImages[post.id] = imageUri;  // Store image URI with post ID as key
        }
        setImages(newImages);
      };

      if (posts.length > 0) {
        fetchImages();
      }
    }, [posts]);

    return (
      <View style={styles.postList}>
        {posts.map((post) => (
          <TouchableOpacity onPress={() => handlePostPress(post.id)}>
          <View key={post.id} style={styles.postItem} >
            <Image source={{ uri: images[post.id] }} style={styles.image}
             resizeMode='contain' />
            <Text style={styles.postTitle}>{post.title.rendered}</Text>
          </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  function prev_page_btn() {
    if (currentpage > 1) {
      setCurrentPage((prevPage) => (parseInt(prevPage) - 1).toString());
    }
  }
  function next_page_btn(){
    setCurrentPage((prevPage) => (parseInt(prevPage) + 1).toString());
  }

  return (
    <ScrollView  style={styles.container}>
       <StatusBar hidden={true} />
       <Image source={{ uri: 'https://zoom.lk/wp-content/uploads/2024/12/14th-Ann-logo.png' }} resizeMode='contain' style={styles.logo} />


       {renderPosts()}


       {!loading && (
  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: '20px'}}>
    <Button
      onPress={prev_page_btn}
      title="Previous Page"
      color="#841584"
      accessibilityLabel="Previous Page"
      hidden={currentpage === '1'} // Disable the button on the first page
    />
    <Button
      onPress={next_page_btn}
      title="Next Page"
      color="#841584"
      accessibilityLabel="Next Page"
    />
  </View>
)}


{loading && (
        <View style={styles.loadingBar}>
          <View style={styles.loadingIndicator}></View>
        </View>
      )}

    </ScrollView>
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
    backgroundColor: '#007bff',  // Set background color of the loading bar
  },
  loadingIndicator: {
    width: '100%',
    height: '100%',
    backgroundColor: '#007bff',  // Set the blue color for the loading bar
   // animation: 'loading 3s infinite',
  },
  postList: {
    padding: 20,
  },
  postItem: {
    marginBottom: 20,
    borderBottomWidth: 0,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  postTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  postExcerpt: {
    color: '#fff',
    marginTop: 5,
  },
  errorText: {
    color:'red',
    padding: 20,
  },
   image: {
    width: '100%',
    height: '200px',  
   },
   
    logo: {
      width: '200px',
      height: '80px', 
      alignSelf:'center',
   },
    
});