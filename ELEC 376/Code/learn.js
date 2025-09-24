// Music defaults ON
const music = document.getElementById("bg-music");
const sfx   = document.getElementById("sfx-click");
(async () => { try { await music.play(); } catch {} })();

function sfxClick(){ try{ sfx.currentTime = 0; sfx.play(); }catch{} }

// --- Image fallbacks based on your paths ---
function loadWithFallback(imgEl, candidates){
  return new Promise(resolve=>{
    const tryNext = (i=0)=>{
      if(i>=candidates.length){ imgEl.src = candidates[0]; return resolve(); }
      const src = candidates[i];
      const test = new Image();
      test.onload = ()=>{ imgEl.src = src; resolve(); }
      test.onerror = ()=>tryNext(i+1);
      test.src = src;
    };
    tryNext();
  });
}

// Load Dr. Kleber images
loadWithFallback(document.getElementById("kleber-1"), [
  "assets/kleber1.png",
  "assets/Kleber1.png",
  "assets/kleber_1.png"
]);
loadWithFallback(document.getElementById("kleber-2"), [
  "assets/kleber2.png",
  "assets/Kleber2.png",
  "../..2.png"   // your note
]);
loadWithFallback(document.getElementById("kleber-3"), [
  "assets/kleber3.png",
  "assets/Kleber3.png",
  ".../..3.png"  // your note
]);

// --- Slide deck behavior (hard switch between slides) ---
const deck   = document.getElementById("deck");
const slide1 = document.getElementById("slide-1");
const slide2 = document.getElementById("slide-2");
const overlay = document.getElementById("goodbye-overlay");

// Go to slide 2
document.getElementById("next-1").addEventListener("click", ()=>{
  sfxClick();
  slide1.classList.remove("is-current");
  slide2.classList.add("is-current");
});

// Back to slide 1
document.getElementById("back-2").addEventListener("click", ()=>{
  sfxClick();
  slide2.classList.remove("is-current");
  slide1.classList.add("is-current");
});

// Show overlay (Slide 3) on top of Slide 2
document.getElementById("next-2").addEventListener("click", ()=>{
  sfxClick();
  overlay.hidden = false;
});

// Overlay actions
document.getElementById("revisit").addEventListener("click", ()=>{
  sfxClick();
  overlay.hidden = true; // stay on slide 2 content
});

// --- Lamp demo (Slide 1) ---
const lamp = document.getElementById("lamp");
document.querySelectorAll(".toggle").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    sfxClick();
    const bit = btn.dataset.bit;
    const isOn = bit === "1";
    lamp.classList.toggle("on", isOn);
    lamp.setAttribute("aria-label", `Lamp is ${isOn ? "ON" : "OFF"}`);
  });
});

// --- Code rain (Slide 2) ---
const rainCols = Array.from(document.querySelectorAll(".rain .col"));
function randomBits(n){ return Array.from({length:n}, ()=> Math.random()<0.5?'0':'1').join(''); }
function seedCol(col){
  const lines = 40 + Math.floor(Math.random()*20);
  const content = Array.from({length:lines}, ()=>randomBits(1)).join("\n");
  col.textContent = content;
  col.style.left = `${Math.random()*98}%;
  `;
  col.style.animationDuration = `${8 + Math.random()*7}s`;
  col.style.animationDelay = `${-Math.random()*10}s`;
}
rainCols.forEach(seedCol);
