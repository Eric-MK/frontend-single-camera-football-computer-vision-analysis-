<template>
  <div class="container">
    <form @submit.prevent="submitVideo" class="form-container">
      <h2>Video Processing Input</h2>
      <div class="form-group">
        <label for="video-upload">Upload Video:</label>
        <input id="video-upload" type="file" @change="handleFile" class="input-file" aria-required="true" />
      </div>
      <div class="form-group">
        <label for="team1-player">Team 1 Player Color (R,G,B):</label>
        <input
          id="team1-player"
          v-model="team1PlayerColor"
          type="text"
          :class="{ invalid: errors.team1PlayerColor }"
          @blur="handleValidation"
          class="input-text"
        />
        <span v-if="errors.team1PlayerColor" class="error-message">Invalid color format. Use R,G,B.</span>
      </div>
      <div class="form-group">
        <label for="team1-goalkeeper">Team 1 Goalkeeper Color (R,G,B):</label>
        <input
          id="team1-goalkeeper"
          v-model="team1GoalkeeperColor"
          type="text"
          :class="{ invalid: errors.team1GoalkeeperColor }"
          @blur="handleValidation"
          class="input-text"
        />
        <span v-if="errors.team1GoalkeeperColor" class="error-message">Invalid color format. Use R,G,B.</span>
      </div>
      <div class="form-group">
        <label for="team2-player">Team 2 Player Color (R,G,B):</label>
        <input
          id="team2-player"
          v-model="team2PlayerColor"
          type="text"
          :class="{ invalid: errors.team2PlayerColor }"
          @blur="handleValidation"
          class="input-text"
        />
        <span v-if="errors.team2PlayerColor" class="error-message">Invalid color format. Use R,G,B.</span>
      </div>
      <div class="form-group">
        <label for="team2-goalkeeper">Team 2 Goalkeeper Color (R,G,B):</label>
        <input
          id="team2-goalkeeper"
          v-model="team2GoalkeeperColor"
          type="text"
          :class="{ invalid: errors.team2GoalkeeperColor }"
          @blur="handleValidation"
          class="input-text"
        />
        <span v-if="errors.team2GoalkeeperColor" class="error-message">Invalid color format. Use R,G,B.</span>
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
      team1GoalkeeperColor: "",
      team2PlayerColor: "",
      team2GoalkeeperColor: "",
      outputVideoUrl: null,
      uploadProgress: 0,
      isLoading: false,
      errors: {
        team1PlayerColor: false,
        team1GoalkeeperColor: false,
        team2PlayerColor: false,
        team2GoalkeeperColor: false,
      },
    };
  },
  methods: {
    handleFile(event) {
      this.video = event.target.files[0];
    },
    validateColorInput(color) {
      const trimmedColor = color.replace(/\s+/g, ""); // Remove all spaces
      const regex = /^\d{1,3},\d{1,3},\d{1,3}$/;
      if (!regex.test(trimmedColor)) return false;

      const [r, g, b] = trimmedColor.split(",").map(Number);
      return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
    },
    handleValidation() {
      this.errors.team1PlayerColor = !this.validateColorInput(this.team1PlayerColor);
      this.errors.team1GoalkeeperColor = !this.validateColorInput(this.team1GoalkeeperColor);
      this.errors.team2PlayerColor = !this.validateColorInput(this.team2PlayerColor);
      this.errors.team2GoalkeeperColor = !this.validateColorInput(this.team2GoalkeeperColor);
    },
    async submitVideo() {
      this.handleValidation();
      if (Object.values(this.errors).includes(true)) {
        alert("Please correct invalid color inputs.");
        return;
      }

      if (!this.video) {
        alert("Please upload a video.");
        return;
      }

      const formData = new FormData();
      formData.append("video", this.video);
      formData.append("club1_player_color", this.team1PlayerColor);
      formData.append("club1_goalkeeper_color", this.team1GoalkeeperColor);
      formData.append("club2_player_color", this.team2PlayerColor);
      formData.append("club2_goalkeeper_color", this.team2GoalkeeperColor);

      this.isLoading = true;
      try {
        const response = await axios.post("http://localhost:5000/process-video", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          },
        });
        this.outputVideoUrl = `http://localhost:5000${response.data.output_video}`;
      } catch (error) {
        alert("Error processing video.");
      } finally {
        this.isLoading = false;
        this.uploadProgress = 0;
      }
    },
  },
};
</script>

<style setup>
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

.input-file,
.input-text {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-text.invalid {
  border: 1px solid #e74c3c;
  background-color: #fbeaea;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
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
</style>