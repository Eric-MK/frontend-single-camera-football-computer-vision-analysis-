<template>
  <div class="container">
    <form @submit.prevent="submitVideo" class="form-container">
      <h2>Video Processing Input</h2>
      <div class="form-group">
        <label for="video-upload">Upload Video:</label>
        <input id="video-upload" type="file" @change="handleFile" class="input-file" />
      </div>
      <div class="form-group">
        <label for="team1-player">Team 1 Player Color (R,G,B):</label>
        <input id="team1-player" v-model="team1PlayerColor" type="text" class="input-text" />
      </div>
      <div class="form-group">
        <label for="team1-goalkeeper">Team 1 Goalkeeper Color (R,G,B):</label>
        <input id="team1-goalkeeper" v-model="team1GoalkeeperColor" type="text" class="input-text" />
      </div>
      <div class="form-group">
        <label for="team2-player">Team 2 Player Color (R,G,B):</label>
        <input id="team2-player" v-model="team2PlayerColor" type="text" class="input-text" />
      </div>
      <div class="form-group">
        <label for="team2-goalkeeper">Team 2 Goalkeeper Color (R,G,B):</label>
        <input id="team2-goalkeeper" v-model="team2GoalkeeperColor" type="text" class="input-text" />
      </div>
      <button type="submit" class="submit-btn">Submit</button>
    </form>

    <div v-if="outputVideoUrl" class="output-container">
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
      outputVideoUrl: null, // Store the URL of the output video
    };
  },
  methods: {
    handleFile(event) {
      this.video = event.target.files[0];
    },
    async submitVideo() {
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

      try {
        const response = await axios.post("http://localhost:5000/process-video", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.outputVideoUrl = `http://localhost:5000${response.data.output_video}`;
      } catch (error) {
        console.error(error);
        alert("Error processing video.");
      }
    },
  },
};
</script>

<style>
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

.input-text {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

.output-container {
  margin-top: 30px;
  text-align: center;
}

.output-container h3 {
  margin-bottom: 15px;
  color: #333;
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
