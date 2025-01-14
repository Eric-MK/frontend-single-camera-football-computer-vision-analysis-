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
          <button @click="showDeleteModal(video.id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>

    <!-- Modal for confirmation -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this video?</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="confirm-btn">Yes</button>
          <button @click="closeModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Modal for error messages -->
    <div v-if="errorMessage" class="modal-overlay">
      <div class="modal-content">
        <h3>Error</h3>
        <p>{{ errorMessage }}</p>
        <button @click="closeErrorModal" class="confirm-btn">Close</button>
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
      showModal: false,
      errorMessage: "",
      videoToDelete: null,
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
          this.videos = response.data; // Store the fetched videos
        }
      } catch (error) {
        console.error("Error fetching uploaded videos:", error);
        this.errorMessage = "There was an error fetching your uploaded videos.";
      }
    },

    showDeleteModal(videoId) {
      this.videoToDelete = videoId;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.videoToDelete = null;
    },

    closeErrorModal() {
      this.errorMessage = "";
    },

    async confirmDelete() {
      if (!this.videoToDelete) return;

      try {
        const response = await axios.delete(`http://localhost:5000/delete-video/${this.videoToDelete}`);
        this.closeModal(); // Close the modal
        alert(response.data.message); // Display success message
        this.fetchUploadedVideos(); // Refresh the video list
      } catch (error) {
        console.error("Error deleting video:", error);
        this.errorMessage = "There was an error deleting the video.";
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

  /* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.confirm-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn {
  background-color: #007bff;
  color: #fff;
}

.cancel-btn {
  background-color: #e74c3c;
  color: #fff;
}

.confirm-btn:hover {
  background-color: #0056b3;
}

.cancel-btn:hover {
  background-color: #c0392b;
}
  </style>
  