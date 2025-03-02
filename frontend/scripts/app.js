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
document.getElementById('post-btn').addEventListener('click', function () {
  const newPost = document.getElementById('new-post').value.trim();
  const categorySelect = document.getElementById('category-select');
  const selectedCategory = categorySelect.value; // Get selected category

  if (newPost) {
    // Add the post to the selected category in Firestore
    addDoc(collection(db, "forum", selectedCategory, "posts"), {
      content: newPost,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        alert("Post added successfully!");
        document.getElementById('new-post').value = ""; // Clear input field
        loadForumPosts(); // Reload posts for the selected category
      })
      .catch((error) => {
        console.error("Error adding post:", error);
      });
  } else {
    alert("Please enter a post.");
  }
});


// Load posts for the selected category
function loadForumPosts() {
  const forumPosts = document.getElementById('forum-posts');
  const categorySelect = document.getElementById('category-select');
  const selectedCategory = categorySelect.value; // Get selected category value
  forumPosts.innerHTML = ''; // Clear existing posts

  const forumRef = collection(db, "forum", selectedCategory, "posts"); // Use selected category
  const q = query(forumRef, orderBy("createdAt", "desc")); // Sort by creation time

  // Get documents from Firestore based on query
  getDocs(q)
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

document.getElementById('category-select').addEventListener('change', function () {
  loadForumPosts(); // Reload posts when category is changed
});

document.getElementById("search-btn").addEventListener("click", async function() {
  const product = document.getElementById("product-search").value;
  const response = await fetch(`http://localhost:8080/api/locations?product=${product}`);
  const stores = await response.json();

  const storeListDiv = document.getElementById("store-list");
  storeListDiv.innerHTML = ""; // Clear previous results

  stores.forEach(store => {
      const storeElement = document.createElement("div");
      storeElement.textContent = `${store.name} - $${store.price}`;
      storeListDiv.appendChild(storeElement);
  });

  displayStoresOnMap(stores);
});

function displayStoresOnMap(stores) {
  stores.forEach(store => {
      new google.maps.Marker({
          position: { lat: store.lat, lng: store.lng },
          map: map,
          title: `${store.name} - $${store.price}`
      });
  });
}


