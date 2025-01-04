<template>
    <div class="user-videos-container">
      <h2>Your Uploaded Videos</h2>
  
      <!-- If there are no videos, show a message -->
      <div v-if="videos.length === 0" class="no-videos-message">
        <p>You haven't uploaded any videos yet.</p>
      </div>
  
      <!-- List of videos -->
      <div v-else class="video-list">
        <div v-for="video in videos" :key="video.id" class="video-item">
          <video 
            :src="`http://localhost:5000${video.video_path}`" 
            controls 
            class="video-thumbnail"
          ></video>
          <div class="video-details">
            <p>{{ video.processed_at }}</p>
            <button @click="deleteVideo(video.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        videos: [],
      };
    },
    mounted() {
      this.fetchUploadedVideos();
    },
    methods: {
      async fetchUploadedVideos() {
        try {
          const userId = localStorage.getItem("user_id");
          if (userId) {
            const response = await axios.get(`http://localhost:5000/user-uploads/${userId}`);
            this.videos = response.data;  // Store the fetched videos
          }
        } catch (error) {
          console.error("Error fetching uploaded videos:", error);
          alert("There was an error fetching your uploaded videos.");
        }
      },
  
      async deleteVideo(videoId) {
        const confirmDelete = confirm("Are you sure you want to delete this video?");
        if (confirmDelete) {
          try {
            const response = await axios.delete(`http://localhost:5000/delete-video/${videoId}`);
            alert(response.data.message);  // Display success message
            this.fetchUploadedVideos();    // Refresh the video list
          } catch (error) {
            console.error("Error deleting video:", error);
            alert("There was an error deleting the video.");
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .user-videos-container {
    max-width: 800px;
    margin: 50px auto;
    font-family: Arial, sans-serif;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
  }
  
  h2 {
    text-align: center;
    color: #333;
  }
  
  .no-videos-message {
    text-align: center;
    font-size: 16px;
    color: #888;
  }
  
  .video-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  .video-item {
    max-width: 200px;
    text-align: center;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: #fff;
  }
  
  .video-thumbnail {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
  
  .video-details {
    margin-top: 10px;
  }
  
  .delete-btn {
    background-color: #e74c3c;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .delete-btn:hover {
    background-color: #c0392b;
  }
  </style>
  