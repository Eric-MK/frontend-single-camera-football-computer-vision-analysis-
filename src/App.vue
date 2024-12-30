<template>
  <div>
    <form @submit.prevent="submitVideo">
      <div>
        <label>Upload Video:</label>
        <input type="file" @change="handleFile" />
      </div>
      <div>
        <label>Team 1 Player Color (R,G,B):</label>
        <input v-model="team1PlayerColor" type="text" />
      </div>
      <div>
        <label>Team 1 Goalkeeper Color (R,G,B):</label>
        <input v-model="team1GoalkeeperColor" type="text" />
      </div>
      <div>
        <label>Team 2 Player Color (R,G,B):</label>
        <input v-model="team2PlayerColor" type="text" />
      </div>
      <div>
        <label>Team 2 Goalkeeper Color (R,G,B):</label>
        <input v-model="team2GoalkeeperColor" type="text" />
      </div>
      <button type="submit">Submit</button>
    </form>

    <div v-if="outputVideoUrl">
      <h3>Processed Video:</h3>
      <video controls :src="outputVideoUrl" width="600"></video>
      <a :href="outputVideoUrl" download="processed_video.mp4">Download Video</a>
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
