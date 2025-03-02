// Import Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC6kV2YLd1oEJCC5kXmzF4swCzD0Ym3mbU",
  authDomain: "wcc-hackathon-1943c.firebaseapp.com",
  projectId: "wcc-hackathon-1943c",
  storageBucket: "wcc-hackathon-1943c.firebasestorage.app",
  messagingSenderId: "659159165604",
  appId: "1:659159165604:web:8e66b15bcd87da32fc5431",
  measurementId: "G-4HN3W5KTMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------------------
// 🔹 SEARCH FUNCTIONALITY (MAP PAGE)
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById('search-btn')) {
    document.getElementById('search-btn').addEventListener('click', function () {
      const product = document.getElementById('product-search').value;
      searchProducts(product);
    });
  }

  if (document.getElementById('post-btn')) {
    document.getElementById('post-btn').addEventListener('click', addForumPost);
    loadForumPosts(); // Load existing posts when the page loads
  }
});

function searchProducts(product) {
  console.log("Searching for:", product);
  fetchStores(product);
}

function fetchStores(product) {
  const storesRef = collection(db, "stores");
  const q = query(storesRef, where("availableProducts", "array-contains", product));

  getDocs(q)
    .then((querySnapshot) => {
      const storeList = document.getElementById('store-list');
      storeList.innerHTML = ''; 

      querySnapshot.forEach((doc) => {
        const storeData = doc.data();
        storeList.innerHTML += `
          <div class="store-item">
            <h3>${storeData.name}</h3>
            <p>Address: ${storeData.address}</p>
            <p>Phone: ${storeData.phone}</p>
            <p>Available Products: ${storeData.availableProducts.join(', ')}</p>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error("Error fetching stores:", error);
    });
}

// ------------------------------
// 🔹 FORUM FUNCTIONALITY (FORUM PAGE)
// ------------------------------
function addForumPost() {
  const newPost = document.getElementById('new-post').value.trim();

  if (!newPost) {
    alert("Please enter a post.");
    return;
  }

  addDoc(collection(db, "forum"), {
    content: newPost,
    createdAt: serverTimestamp()
  })
    .then(() => {
      alert("Post added successfully!");
      document.getElementById('new-post').value = ""; // Clear input field
      loadForumPosts(); // Reload posts
    })
    .catch((error) => {
      console.error("Error adding post:", error);
    });
}

function loadForumPosts() {
  const forumPosts = document.getElementById('forum-posts');
  forumPosts.innerHTML = '';

  getDocs(collection(db, "forum"))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const postDate = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : "Unknown time";

        forumPosts.innerHTML += `
          <div class="post-item">
            <p>${post.content}</p>
            <small>Posted on: ${postDate}</small>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error("Error fetching forum posts:", error);
    });
}
