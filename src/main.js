import {
    onAuthReady
} from "./authentication.js"

import { db } from "./firebaseConfig.js";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

// Function to read the quote of the day from Firestore
function readQuote(day) {
    const quoteDocRef = doc(db, "quotes", day); // Get a reference to the document

    onSnapshot(quoteDocRef, (docSnap) => { // Listen for real-time updates
        if (docSnap.exists()) {
            document.getElementById("quote-goes-here").innerHTML = docSnap.data().quote;
        } else {
            console.log("No such document!");
        }
    }, (error) => {
        console.error("Error listening to document: ", error);
    });
}

function showDashboard() {
    const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

    // Wait for Firebase to determine the current authentication state.
    // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
    // The user's name is extracted from the Firebase Authentication object
    // You can "go to console" to check out current users. 
    onAuthReady(async (user) => {
        if (!user) {
            // If no user is signed in → redirect back to login page.
            location.href = "index.html";
            return;
        }

        // If a user is logged in:
        // Use their database name if available, otherwise show their auth display name or email.
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const name = userDoc.exists() ?
            userDoc.data().name : user.displayName || user.email;
        user.displayName || user.email;

        // Update the welcome message with their name/email.
        if (nameElement) {
            nameElement.textContent = `${name}!`;
        }
    });
}
readQuote("tuesday");
showDashboard();