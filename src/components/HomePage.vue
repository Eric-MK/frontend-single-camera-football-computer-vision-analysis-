<template>
  <div class="container">
    <form @submit.prevent="submitVideo" class="form-container">
      <h2>Video Processing Input</h2>
      <div class="form-group">
        <label for="video-upload">Upload Video:</label>
        <input id="video-upload" type="file" @change="handleFile" class="input-file" aria-required="true" />
      </div>
      <div class="form-group">
        <label for="team1-player">Team 1 Player Color:</label>
        <input
          id="team1-player"
          type="color"
          v-model="team1PlayerColorHex"
          @input="convertHexToRGB('team1PlayerColor', team1PlayerColorHex)"
          class="color-picker"
        />
        <input type="text" :value="team1PlayerColor" readonly class="readonly-input" />
      </div>
      <div class="form-group">
        <label for="team1-goalkeeper">Team 1 Goalkeeper Color:</label>
        <input
          id="team1-goalkeeper"
          type="color"
          v-model="team1GoalkeeperColorHex"
          @input="convertHexToRGB('team1GoalkeeperColor', team1GoalkeeperColorHex)"
          class="color-picker"
        />
        <input type="text" :value="team1GoalkeeperColor" readonly class="readonly-input" />
      </div>
      <div class="form-group">
        <label for="team2-player">Team 2 Player Color:</label>
        <input
          id="team2-player"
          type="color"
          v-model="team2PlayerColorHex"
          @input="convertHexToRGB('team2PlayerColor', team2PlayerColorHex)"
          class="color-picker"
        />
        <input type="text" :value="team2PlayerColor" readonly class="readonly-input" />
      </div>
      <div class="form-group">
        <label for="team2-goalkeeper">Team 2 Goalkeeper Color:</label>
        <input
          id="team2-goalkeeper"
          type="color"
          v-model="team2GoalkeeperColorHex"
          @input="convertHexToRGB('team2GoalkeeperColor', team2GoalkeeperColorHex)"
          class="color-picker"
        />
        <input type="text" :value="team2GoalkeeperColor" readonly class="readonly-input" />
      </div>
      <button type="submit" class="submit-btn">Submit</button>
    </form>

    <div v-if="uploadProgress > 0" class="progress-bar">
      <div :style="{ width: `${uploadProgress}%` }" class="progress-bar-fill"></div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Processing your video, please wait...</p>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>

    <div v-if="outputVideoUrl" class="output-container">
      <div class="success-message">
        <p>Video processed successfully! Download it below.</p>
      </div>
      <h3>Processed Video:</h3>
      <video controls :src="outputVideoUrl" width="600" class="output-video"></video>
      <a :href="outputVideoUrl" download="processed_video.mp4" class="download-link">Download Video</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      video: null,
      team1PlayerColor: "",
      team1PlayerColorHex: "#000000",
      team1GoalkeeperColor: "",
      team1GoalkeeperColorHex: "#000000",
      team2PlayerColor: "",
      team2PlayerColorHex: "#000000",
      team2GoalkeeperColor: "",
      team2GoalkeeperColorHex: "#000000",
      outputVideoUrl: null,
      uploadProgress: 0,
      isLoading: false,
      showModal: false,
      modalMessage: "",
    };
  },
  methods: {
    handleFile(event) {
      this.video = event.target.files[0];
    },
    convertHexToRGB(property, hexColor) {
      const bigint = parseInt(hexColor.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      this[property] = `${r},${g},${b}`;
    },
    async submitVideo() {
      if (!this.video) {
        this.modalMessage = "Please upload a video.";
        this.showModal = true;
        return;
      }

      const formData = new FormData();
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        this.modalMessage = "User ID is required. Please log in.";
        this.showModal = true;
        return;
      }

      formData.append("user_id", userId);
      formData.append("video", this.video);
      formData.append("club1_player_color", this.team1PlayerColor);
      formData.append("club1_goalkeeper_color", this.team1GoalkeeperColor);
      formData.append("club2_player_color", this.team2PlayerColor);
      formData.append("club2_goalkeeper_color", this.team2GoalkeeperColor);

      this.isLoading = true;
      try {
        const response = await axios.post("http://localhost:5000/process-video", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          },
        });
        this.outputVideoUrl = `http://localhost:5000${response.data.output_video}`;
        this.modalMessage = "Video processed successfully!";
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        this.modalMessage = "Error processing video. Please try again.";
      } finally {
        this.isLoading = false;
        this.uploadProgress = 0;
        this.showModal = true;
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.input-file {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.color-picker {
  width: 50px;
  height: 30px;
  border: none;
  cursor: pointer;
}

.readonly-input {
  margin-top: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.submit-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #f3f3f3;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 15px;
}

.progress-bar-fill {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.output-container {
  margin-top: 30px;
  text-align: center;
}

.output-container h3 {
  margin-bottom: 15px;
  color: #333;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  border: 1px solid #d6e9c6;
  border-radius: 5px;
  margin-bottom: 15px;
}

.output-video {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.download-link {
  display: inline-block;
  margin-top: 10px;
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  transition: color 0.3s ease;
}

.download-link:hover {
  color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
}

.modal p {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.modal button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.modal button:hover {
  background-color: #0056b3;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
