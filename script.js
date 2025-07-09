// ---------------------------
// Scene Entry Animations
// ---------------------------
window.addEventListener("load", () => {
  gsap.set(".scene-title", { visibility: "visible", opacity: 0 });
  gsap.set(".duck", { visibility: "visible", opacity: 0, scale: 0 });
  gsap.set(".wake-button", { visibility: "visible", opacity: 0 });
  gsap.set(".sub-warning", { visibility: "visible", opacity: 0 });

  // Animate duck
  gsap.to(".duck", {
    delay: 0.5,
    duration: 1,
    scale: 1,
    opacity: 1,
    ease: "back.out(2)",
    onComplete: () => {
      // Only show title after duck appears
      gsap.to(".scene-title", {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "power2.out"
      });
    }
  });





  // Animate button
  gsap.to(".wake-button", {
    delay: 1,
    duration: 1,
    opacity: 1,
    y: 0,
    ease: "power2.out"
  });

  // Animate sub-warning
  gsap.to(".sub-warning", {
    delay: 1,
    duration: 0.8,
    opacity: 1,
    y: 0,
    ease: "power2.out"
  });
});


// ---------------------------
// Sleeping Goose Animation Loop
// ---------------------------
const sleepFrames = [
  "assets/images/sd1.png",
  "assets/images/sd2.png"
];
let currentSleepFrame = 0;
let sleepInterval;

function startSleepingAnimation() {
  sleepInterval = setInterval(() => {
    currentSleepFrame = (currentSleepFrame + 1) % sleepFrames.length;
    duckImg.src = sleepFrames[currentSleepFrame];
  }, 600); // change frame every 500ms
}

function stopSleepingAnimation() {
  clearInterval(sleepInterval);
}

// Start the loop when page loads
startSleepingAnimation();


// ---------------------------
// Click Logic & Warnings
// ---------------------------

const wakeBtn = document.getElementById("wake-btn");
const duckImg = document.getElementById("duck-img");
const body = document.body;

let clickCount = 0;
const messages = [
  "DON'T WAKE THE DUCK",
  "IT'S A WARNING",
  "YOU WILL REGRET IT...",
  "I SAID DON'T ..",
  "CANT YOU READ.."
];
const loopMessages = ["STOP IT...", "STOP I SAID...", "STOOP..."];

// Utility: Create a floating warning message at random position
function createFloatingMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.classList.add("floating-warning");

  const x = Math.floor(Math.random() * 80) + 5; // 5vw–85vw
  const y = Math.floor(Math.random() * 70) + 10; // 10vh–80vh

  msg.style.left = `${x}vw`;
  msg.style.top = `${y}vh`;

  document.body.appendChild(msg);

  // Animate message in
  gsap.fromTo(msg,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "power4.inout" }
  );
}

wakeBtn.addEventListener("click", () => {
  clickCount++;

  // Screen shake effect
  body.classList.add("shake");
  setTimeout(() => body.classList.remove("shake"), 500);

  // Grow button on each click
  gsap.to(wakeBtn, {
    scale: 1 + clickCount * 0.1,
    duration: 0.2,
    ease: "power2.out"
  });

  // Show floating messages
  if (clickCount <= 5) {
    createFloatingMessage(messages[clickCount - 1]);
  } else {
    const msgIndex = (clickCount - 6) % loopMessages.length;
    createFloatingMessage(loopMessages[msgIndex]);
  }

  // Breakpoint: trigger explosion at 17 clicks
  if (clickCount >= 17) {
    explodeEverything();
  }
});

// ---------------------------
// Explosion Logic
// ---------------------------

function explodeEverything() {
  wakeBtn.disabled = true;

  stopSleepingAnimation();


  duckImg.src = "assets/images/duck2.png"; // switch to angry duck

  // Intense shake
  body.classList.add("shake");
  setTimeout(() => body.classList.remove("shake"), 500);

  // Animate button + warning text disappearing
  gsap.to([".wake-button", ".sub-warning"], {
    scale: 5,
    opacity: 0,
    duration: 0.5,
    ease: "power4.inOut",
    onComplete: () => {
      wakeBtn.remove();
      document.querySelector(".sub-warning")?.remove();
    }
  });

  // Animate title flying away
  gsap.to(".scene-title", {
    y: -200,
    opacity: 0,
    duration: 0.6,
    ease: "power4.inOut"
  });

  // Animate duck flying away
  gsap.to(".duck", {
    y: 300,
    opacity: 0,
    scale: 0.3,
    duration: 0.6,
    ease: "power4.inOut"
  });

  // Animate all warning messages flying out
  
  const warnings = document.querySelectorAll(".floating-warning");
    warnings.forEach((msg, index) => {
      gsap.to(msg, {
        y: -200,
        opacity: 0,
        duration: 0.6,
        ease: "power4.inOut",
        delay: index * 0.03,
        onComplete: () => msg.remove()
      });
  });


  // Bring angry duck back + final message
  setTimeout(() => {
    gsap.set(duckImg, {
      y: -100,
      scale: 0.8,
      opacity: 0
    });

    gsap.to(duckImg, {
      scale: 3,
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    });

    const finalText = document.createElement("div");
    finalText.textContent = "..YOU HAVE DONE IT NOW..";
    finalText.style.color = "#f54343";
    finalText.style.fontSize = "15px";
    finalText.style.marginTop = "150px";
    finalText.style.fontFamily = "'Press Start 2P', monospace";
    finalText.style.opacity = "0";
    finalText.style.textShadow = "2px 2px #000000";
    document.querySelector(".scene").appendChild(finalText);

    gsap.to(finalText, {
      delay: 0.8,
      opacity: 1,
      duration: 1.2
    });
  }, 700);
}
