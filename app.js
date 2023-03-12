// Check if there are saved videos in local storage
const storedVideos = localStorage.getItem("videos");
const storedTimestamp = localStorage.getItem("timestamp");

if (storedVideos && storedTimestamp && Date.now() < storedTimestamp) {
  // Use the saved videos to display the video grid
  const videos = JSON.parse(storedVideos);
  displayVideoGrid(videos);
  playVideo(videos[0].id); // Play the first video automatically
} else {
  // Fetch the video data and display the video grid
  const playlistUrl =
    "https://services.brid.tv/services/get/latest/26456/0/1/25/0.json";
  fetch(playlistUrl)
    .then((response) => response.json())
    .then((data) => {
      const videos = data.Video.map((video) => ({
        id: video.id,
        title: video.name,
        duration: video.duration,
        thumbnail: video.thumbnail,
      }));
      localStorage.setItem("videos", JSON.stringify(videos));
      localStorage.setItem("timestamp", Date.now() + 5 * 60 * 1000);
      displayVideoGrid(videos);
      playVideo(videos[0].id); // Play the first video automatically
    })
    .catch((error) => console.error(error));
}

function displayVideoGrid(videos) {
  // Get the container where the grid of videos will be displayed
  const videoGridContainer = document.getElementById("video-grid-container");

  // Loop through the videos and create HTML elements for each video
  let videoGridHTML = "";
  videos.forEach((video) => {
    videoGridHTML += `
      <div class="video-item">
        <img src="${video.thumbnail}" alt="${video.title}" data-id="${
      video.id
    }">
        <h3 data-id="${video.id}">${video.title}</h3>
        <p>${formatDuration(video.duration)}</p>
      </div>
    `;
  });

  // Append the HTML elements to the container
  videoGridContainer.innerHTML = videoGridHTML;

  // Add click event listeners to the video items
  const videoItemElements = document.getElementsByClassName("video-item");
  for (let i = 0; i < videoItemElements.length; i++) {
    const imageElement = videoItemElements[i].querySelector("img");
    const titleElement = videoItemElements[i].querySelector("h3");

    imageElement.addEventListener("click", () => {
      const videoId = imageElement.getAttribute("data-id");
      $bp().destroy(true);
      playVideo(videoId, true);
    });

    titleElement.addEventListener("click", () => {
      const videoId = titleElement.getAttribute("data-id");
      $bp().destroy(true);
      playVideo(videoId, true);
    });
  }
}

function formatDuration(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
  const seconds = durationInSeconds - hours * 3600 - minutes * 60;
  return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

function padNumber(number) {
  return number.toString().padStart(2, "0");
}

function playVideo(videoId, autoPlay = false) {
  $bp("myDiv", {
    id: "26456",
    width: "1024",
    height: "480",
    video: videoId,
    autoplay: autoPlay,
  });
  $bp().on("adEnd", function () {
    $bp().play();
  });
}
