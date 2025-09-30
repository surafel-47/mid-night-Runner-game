$(document).ready(function () {
  const scoreDisplay = $("#scoreDisplay");
  let score = 0;
  updateScoreDisplay();

  let BgForestAudioVolume = 0.1;
  let footStepsVolume = 1;
  let hurtAudioVolume = 1;
  let jumpAudioVolume = 0.7;
  let runningFastVolume = 1;
  let wolfVolume = 1;
  let BgMusicVolume=0.4;
  let biteAudioVolume=1;
  let gameOver=false;


  const BgForestAudio = new Audio("./assets/audio/bgForest.mp3");
  BgForestAudio.volume = BgForestAudioVolume;
  BgForestAudio.loop = true;

  const BgMusicAudio = new Audio("./assets/audio/bgMusic.mp3");
  BgMusicAudio.volume = BgMusicVolume;
  BgMusicAudio.loop = true;

  const footStepsAudio = new Audio("./assets/audio/footSteps.mp3");
  footStepsAudio.volume = footStepsVolume;
  footStepsAudio.loop = true;

  const hurtAudio = new Audio("./assets/audio/hurt.mp3");
  hurtAudio.volume = hurtAudioVolume;

  const jumpAudio = new Audio("./assets/audio/jump.mp3");
  jumpAudio.volume = jumpAudioVolume;

  const runningFastAudio = new Audio("./assets/audio/runningFast.mp3");
  runningFastAudio.loop = true;
  runningFastAudio.volume = runningFastVolume;

  const wolfAudio = new Audio("./assets/audio/bite.mp3");
  wolfAudio.volume = wolfVolume;

  const biteAudio = new Audio("./assets/audio/wolf.mp3");
  biteAudio.volume = biteAudioVolume;

  let isMuted = false;

  function toggleMute() {
    isMuted = !isMuted; // Toggle the mute state

    if (isMuted) {
      BgForestAudioVolume = 0;
      footStepsVolume = 0;
      hurtAudioVolume = 0;
      jumpAudioVolume = 0;
      runningFastVolume = 0;
      wolfVolume = 0;
      biteAudioVolume=0;
      BgForestAudio.pause();
      BgMusicAudio.pause();
    } else {
      BgForestAudioVolume = 0.1;
      footStepsVolume = 1;
      hurtAudioVolume = 1;
      jumpAudioVolume = 0.7;
      runningFastVolume = 1;
      wolfVolume = 1;
      biteAudioVolume=1;
      footStepsAudio.play();
      runningFastAudio.play();
      BgForestAudio.play();
      BgMusicAudio.play();
    }
  }

  // Event listener for "M" key press
  $(document).on("keydown", function (e) {
    if (e.key === "m" || e.key === "M") {
      toggleMute();
    }
  });

 

  var highestScore = localStorage.getItem("highestScore") || 0; // Fetch highest score from local storage
  $(".highestScore").text("Highest Score: " + highestScore); // Display highest score

  $(document).on("keydown", function (e) {
    if (e.key === "r" || e.key === "R") {
      location.reload(); // Reload the page
    }
  });

  let currentFrame = 1;
  const totalFrames = 10; // Number of sprite images
  let animationSpeed = 0.5; // Default speed (between 0 and 1)
  const speedIncrement = 0.05; // Gradual speed adjustment amount
  let intervalId;
  let isRightArrowPressed = false; // Flag to track right arrow press
  let isUpArrowPressed = false; // Flag to track up arrow press
  let isJumping = false;
  const playerGroundPosY = 70;
  const jumpHeight = 300;
  const gravity = 20;
  let player = $("#player");
  let playerPosY = playerGroundPosY; // Initial player position
  player.css({
    bottom: playerGroundPosY,
    left: 140,
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
      document.querySelector(".parallax-container").classList.add("zoomed");
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowRight") {
      document.querySelector(".parallax-container").classList.remove("zoomed");
    }
  });

  function updateSprite() {
    player.css(
      "background-image",
      `url('./assets/sprite/${currentFrame}.png')`
    );

    if (isJumping) {
      currentFrame = 7;
    } else {
      currentFrame = (currentFrame % totalFrames) + 1;
    }

    // Handle right arrow press and gradual speed increase
    if (isRightArrowPressed) {
      animationSpeed = Math.min(animationSpeed + speedIncrement, 1);
    } else {
      // Gradually decrease speed back to default (0.5)
      animationSpeed = Math.max(animationSpeed - speedIncrement, 0.5);
    }

    // Calculate interval based on current animationSpeed
    const interval = 50 / animationSpeed;

    clearInterval(intervalId);
    intervalId = setInterval(updateSprite, interval); // Update the interval based on speed

    // Update player position based on jump
    if (isUpArrowPressed && playerPosY === playerGroundPosY) {
      if (!isJumping) {
        jump();
      }
    }
  }



  function updateScoreDisplay() {
    scoreDisplay.text("Score: " + score);
  }



  // Function to handle player jump
  function jump() {
    isJumping = true;
    jumpAudio.play();
    footStepsAudio.pause();
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
      jumpCount++;
      const jumpStep =
        (jumpHeight / 2) * Math.sin((Math.PI * jumpCount) / jumpHeight);
      playerPosY = playerGroundPosY + jumpStep; // Adjusted for upward motion
      $("#player").css("bottom", `${playerPosY}px`);

      if (jumpCount >= jumpHeight) {
        clearInterval(jumpInterval);
        fall();
      }
    }, 1);
    console.log(isJumping);
  }

  // Function to handle player falling back down
  function fall() {
    let fallCount = 0;
    const fallInterval = setInterval(() => {
      fallCount++;
      const fallStep =
        (gravity / 2) * Math.sin((Math.PI * fallCount) / gravity);
      playerPosY = Math.max(playerGroundPosY - fallStep, playerGroundPosY); // Adjusted for upward motion
      $("#player").css("bottom", `${playerPosY}px`);

      if (fallCount >= gravity) {
        clearInterval(fallInterval);
        playerPosY = playerGroundPosY;
        $("#player").css("bottom", `${playerPosY}px`);
      }
    }, 1);

    isJumping = false;
    footStepsAudio.play();
    console.log(isJumping);
  }

  // Event listener for right arrow press
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      isRightArrowPressed = true;
    } else if (event.key === "ArrowUp") {
      isUpArrowPressed = true;
    }
  });

  // Event listener for right arrow release
  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") {
      isRightArrowPressed = false;
    } else if (event.key === "ArrowUp") {
      isUpArrowPressed = false;
    }
  });

  // Call updateSprite initially (optional)
  updateSprite();

  //*** */

  function generateObstacles() {
    let playerCollusionArea = $("#playerCollusionArea");

    setInterval(() => {
      // Random chance (80% probability) of creating an obstacle
      if (Math.random() > 0.2) {
        const obstacleType = Math.random() < 0.5 ? "wolf" : "hyena";
        const obstacle = $("<div>").addClass("obstacle").addClass(obstacleType);
        $(".playAreaContainer").append(obstacle);


        if(Math.random() > 0.9){
          wolfAudio.play();
        }

        const obstacleSpeed = animationSpeed * 4 + 5; // Adjust speed based on animationSpeed
        const moveInterval = 10; // Time interval for movement update (milliseconds)
        let obstaclePosition = -obstacle.width();
        let obstacleBottom = playerGroundPosY + -20 + "px";

        obstacle.css({
          bottom: obstacleBottom,
          right: obstaclePosition + "px",
          "animation-duration": obstacleSpeed + "s",
        });

        const obstacleMove = setInterval(() => {
          obstaclePosition += obstacleSpeed;
          obstacle.css("right", obstaclePosition + "px");

          if (obstaclePosition > $(window).width()) {
            obstacle.remove();
            clearInterval(obstacleMove); // Stop movement interval
          }


          if (checkCollision(playerCollusionArea, obstacle)) {
            hurtAudio.play();
            biteAudio.play();
            gameOver=true;
            console.log("Game Overr!");
            $("#player").remove();
            runningFastAudio.pause();
            footStepsAudio.pause();
            setTimeout(function () {
              $(".gameOverDiv").css("display", "flex");
            }, 300);

            $(".yourScore").text("Your Score: " + score.toFixed(0));
          }else{
       
          }
        }, moveInterval);

        if(!gameOver){
          score=score+0.5;
          updateScoreDisplay();
        }

      }
    }, 2000); // Generate obstacles every 2 seconds
  }

  generateObstacles();

  function checkCollision(player, obstacle) {
    const playerRect = player[0].getBoundingClientRect(); 
    const obstacleRect = obstacle[0].getBoundingClientRect(); 

   
    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      return true; // Collision detected
    }

    return false; // No collision
  }
});
