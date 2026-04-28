// Your web app's Firebase configuration
//const firebaseConfig = {
//  apiKey: "AIzaSyAFajdu_Y13KgwcZA3LPJmj2j_nw7SoB0s",
//  authDomain: "collective-input.firebaseapp.com",
//  projectId: "collective-input",
//  storageBucket: "collective-input.appspot.com",
//  messagingSenderId: "338519851864",
//  appId: "1:338519851864:web:5fb3b64d1cad63b20b1b2d",
//  measurementId: "G-G0J7EQCZPC"
//};

const firebaseConfig = {
  apiKey: "AIzaSyDa2CPz_Yw3r9FjdKKkQicrxDDJsM0TWkw",
  authDomain: "iml300-firebase-demo-bd7fb.firebaseapp.com",
  projectId: "iml300-firebase-demo-bd7fb",
  storageBucket: "iml300-firebase-demo-bd7fb.firebasestorage.app",
  messagingSenderId: "477130790498",
  appId: "1:477130790498:web:dfd9f79887d089ba29a33b"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
let dbRef = db.ref("text");

let entriesContainer = document.getElementById("entries-container");
let textInputEntry = document.getElementById("text-input-entry");

// Listen for new entries from Firebase
dbRef.on("child_added", (data) => {
  const value = data.val();
  if (value) {
    createFloatingEntry(value);
  }
});

// Submit on Enter key
textInputEntry.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    submitText();
  }
});

function submitText() {
  let textToSubmit = textInputEntry.value.trim();

  if (textToSubmit.length > 0) {
    let newKey = dbRef.push().key;
    let updates = {};
    updates[newKey] = textToSubmit;
    dbRef.update(updates);

    // Clear input field
    textInputEntry.value = "";
    textInputEntry.focus();
  }
}

function createFloatingEntry(text) {
  const floatingDiv = document.createElement("div");
  floatingDiv.className = "floating-entry";
  floatingDiv.textContent = text;

  // Vary speed slightly per entry so multiple entries drift independently
  const duration = (10 + Math.random() * 8).toFixed(1) + "s";
  floatingDiv.style.setProperty("--float-duration", duration);

  // Place at a random starting position
  floatingDiv.style.left = (Math.random() * 85) + "%";
  floatingDiv.style.top  = (Math.random() * 85) + "%";

  entriesContainer.appendChild(floatingDiv);

  function drift() {
    floatingDiv.style.left = (Math.random() * 85) + "%";
    floatingDiv.style.top  = (Math.random() * 85) + "%";
  }

  // Double rAF ensures the browser paints the initial position before
  // the first transition starts, so the element doesn't jump
  requestAnimationFrame(() => requestAnimationFrame(() => {
    drift();
    floatingDiv.addEventListener("transitionend", (e) => {
      if (e.propertyName === "left") drift();
    });
  }));
}
