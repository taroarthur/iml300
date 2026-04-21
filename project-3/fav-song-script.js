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

  // Random starting position
  const startX = Math.random() * 100; // 0 to 100%
  const startY = Math.random() * 100; // 0 to 100%

  // Random ending position
  const endX = Math.random() * 100; // 0 to 100%
  const endY = Math.random() * 100; // 0 to 100%

  floatingDiv.style.setProperty("--start-x", startX + "%");
  floatingDiv.style.setProperty("--start-y", startY + "%");
  floatingDiv.style.setProperty("--end-x", endX + "%");
  floatingDiv.style.setProperty("--end-y", endY + "%");

  entriesContainer.appendChild(floatingDiv);

  // Apply jQuery animation for floating effect
  $(floatingDiv).animate(
    {
      left: endX + "%",
      top: endY + "%",
      opacity: 0
    },
    {
      duration: 20000,
      easing: "easeInOutQuad",
      complete: function() {
        floatingDiv.remove();
      }
    }
  );
}
