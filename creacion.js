// Select all the elements in the HTML page
// and assign them to a variable
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");

let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let volume_slider = document.querySelector(".volume_slider");


// Create the audio element for the player
let curr_track = document.createElement('audio');

// Specify globally used values
let track_index = 0;
let isPlaying = false;
let updateTimer;



// Define the list of tracks that have to be played
let track_list = [
{
	name: "Night Owl",
	artist: "Broke For Free",
	image: "Img/Owl.jpeg",
	path: "audio/06 night_owl.mp3"
},
{
	name: "Enthusiast",
	artist: "Tours",
	image: "Image URL",
	path: "audio/Tours-Enthusiast.mp3"
},
{
	name: "Shipping Lanes",
	artist: "Chad Crouch",
	image: "Image URL",
	path: "audio/Chad Crouch-Shipping Lanes.mp3",
},
];
// Función para reproducir una pista
function playTrack(index) {
	// Comprobar si ya se está reproduciendo una pista
	if (isPlaying) {
	  curr_track.pause();
	  curr_track.currentTime = 0;
	  clearInterval(updateTimer);
	}
  
	// Cargar la nueva pista
	curr_track.src = track_list[index].path;
	curr_track.load();
  
	// Actualizar la información de la pista actual
	track_art.style.backgroundImage = "url(" + track_list[index].image + ")";
	track_name.textContent = track_list[index].name;
	track_artist.textContent = track_list[index].artist;
  
	// Esperar a que la pista se cargue completamente antes de reproducirla
	curr_track.addEventListener('canplaythrough', function() {
	  // Reproducir la pista
	  curr_track.play().then(() => {
		isPlaying = true;
		updateTimer = setInterval(seekUpdate, 1000);
	  }).catch(error => {
		console.error("Error al reproducir la pista:", error);
		isPlaying = false;
	  });
  
	  // Actualizar el botón de reproducción/pausa
	  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
	});
  }
  
  let pauseTime = 0; // Variable para almacenar el tiempo de reproducción actual al pausar la pista
  
  async function pauseTrack() {
		  curr_track.pause();
		  console.log("pausa");
		  pauseTime = curr_track.currentTime; // Almacenar el tiempo de reproducción actual
		  isPlaying = false;
		  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
		  clearInterval(updateTimer)
	  }
  
  // Función para avanzar a la siguiente pista
  function nextTrack() {
	if (track_index < track_list.length - 1) {
	  track_index += 1;
	} else {
	  track_index = 0;
	}
	playTrack(track_index);
  }
  
  // Función para retroceder a la pista anterior
  function prevTrack() {
	if (track_index > 0) {
	  track_index -= 1;
	} else {
	  track_index = track_list.length - 1;
	}
	playTrack(track_index);
  }
  
  // Función para actualizar el temporizador de tiempo transcurrido
  function seekUpdate() {
	  let seekPosition = 0;
  
	  // Verificar si el elemento de audio está cargado correctamente
	  if (!isNaN(curr_track.duration)) {
		seekPosition = curr_track.currentTime * (100 / curr_track.duration);
		seek_slider.value = seekPosition;
  
		// Calcular el tiempo transcurrido y restante
		let currentMinutes = Math.floor(curr_track.currentTime / 60);
		let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
		let durationMinutes = Math.floor(curr_track.duration / 60);
		let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
  
		// Añadir un cero inicial a los segundos si son menores a 10
		if (currentSeconds < 10) { 
		  currentSeconds = "0" + currentSeconds;
		}
		if (durationSeconds < 10) { 
		  durationSeconds = "0" + durationSeconds;
		}
  
		// Mostrar el tiempo transcurrido y restante
		curr_time.textContent = currentMinutes + ":" + currentSeconds;
		total_duration.textContent = durationMinutes + ":" + durationSeconds;
  
		// Si la pista ha terminado, avanzar a la siguiente pista automáticamente
		if (curr_track.ended) {
		  nextTrack();
		}
	  }
  }
  function setVolume() {
	curr_track.volume = volume_slider.value / 100;
  }
	  // Asignar los eventos de clic a los botones
	  playpause_btn.addEventListener("click", playpauseTrack);
	  next_btn.addEventListener("click", nextTrack);
	  prev_btn.addEventListener("click", prevTrack);
  
  // Función para reproducir/pausar la pista al hacer clic en el botón de reproducción/pausa
  async function playpauseTrack() {
	if (!isPlaying) {
	  await playTrack(track_index);
		  isPlaying = true;
	} else {
	  await pauseTrack();
		  isPlaying = false;
	}
  }