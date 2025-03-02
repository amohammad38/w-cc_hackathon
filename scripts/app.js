// Import Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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
// 🔹 Add Forum Post functionality
// 🔹 Add Forum Post functionality
// 🔹 FORUM FUNCTIONALITY (FORUM PAGE)
// ------------------------------

// 🔹 Add Forum Post functionality
function addForumPost() {
  const newPostElement = document.getElementById('new-post');
  const newPost = newPostElement.value.trim();

  if (!newPost) {
    alert("Please enter a post.");
    return;
  }

  const categorySelect = document.getElementById('category-select');
  const selectedCategory = categorySelect.value;

  if (!selectedCategory) {
    console.error("Error: No category selected!");
    return;
  }

  // Add a new post to Firestore for the selected category
  const forumRef = collection(db, "forum", selectedCategory, "posts");
  addDoc(forumRef, {
    content: newPost,
    createdAt: serverTimestamp()
  })
    .then(() => {
      alert("Post added successfully!");
      newPostElement.value = ""; // Clear input field
      loadForumPosts(); // Reload posts
    })
    .catch((error) => {
      console.error("Error adding post:", error);
    });
}

// 🔹 Load Forum Posts based on the selected category
// 🔹 Load Forum Posts based on the selected category
function loadForumPosts() {
  const forumPosts = document.getElementById('forum-posts');
  const categorySelect = document.getElementById('category-select');
  const selectedCategory = categorySelect.value; // Get selected category value

  // Clear existing posts before adding new ones
  forumPosts.innerHTML = '';

  // If no category is selected, exit early
  if (!selectedCategory) {
    console.log("No category selected.");
    return;
  }

  const forumRef = collection(db, "forum", selectedCategory, "posts"); // Reference for selected category
  const q = query(forumRef, orderBy("createdAt", "desc")); // Order by creation time (descending)

  // Fetch posts for the selected category from Firestore
  getDocs(q)
    .then((querySnapshot) => {
      // If no posts are found
      if (querySnapshot.empty) {
        forumPosts.innerHTML = `<p>No posts found in ${selectedCategory}.</p>`;
        return;
      }

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


// 🔹 Listen for category change to reload posts based on the selected category
document.getElementById('category-select').addEventListener('change', function() {
  loadForumPosts(); // Reload posts when category changes
});

// Listen for post submission
document.getElementById('post-btn').addEventListener('click', addForumPost);

// Initial load of posts for the selected category on page load
window.onload = function() {
  loadForumPosts(); // Load posts for the default category (e.g., "all")
};
