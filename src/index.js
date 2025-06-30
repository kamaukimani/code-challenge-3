console.log("we are connected")
//const baseURL = "http://localhost:3000/posts";
const baseURL =  "http://127.0.0.1:3000/posts";

const postListDiv = document.getElementById("post-list");
const postDetailDiv = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");

// this displays posts and ensures that the first item is 
//selected automatically and displayed
function displayPosts() {
  fetch(baseURL)
    .then((res) => res.json())
    .then((posts) => {
      // Clear existing list but keep the header
      postListDiv.querySelectorAll("div.post-item").forEach(div => div.remove());
       // Track the first post for auto-select
      let firstPostId = null;

      posts.forEach((post, index) => {
        const postItem = document.createElement("div");
        postItem.className = "post-item";
        postItem.textContent = post.title;
        postItem.style.cursor = "pointer";
        postItem.dataset.id = post.id;

        postItem.addEventListener("click", () => handlePostClick(post.id));

        postListDiv.appendChild(postItem);
         if (index === 0) {
          firstPostId = post.id; // Store ID of first post
        }
      });

      // Automatically select and display the first post
      if (firstPostId) {
        handlePostClick(firstPostId);
      }
      })
    
    .catch((error) => console.error("Error fetching posts:", error));
}

function handlePostClick(postId) {
  fetch(`${baseURL}/${postId}`)
    .then((res) => res.json())
    .then((post) => {
      postDetailDiv.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small><em>Author: ${post.author}</em></small>
        <img src="${post.imageUrl}" alt="${post.title}" style="max-width: 100%; height: auto;" />
        <div class="delete-btn">
        <button id="delete">Delete Post</button>
        </div>
        `;
        const deleteBtn = document.getElementById("delete");
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this post?")) {
          deletePost(postId);
        }
      });

    })
    .catch((error) => console.error("Error fetching post details:", error));
}
// Delete a post by ID
function deletePost(postId) {
  fetch(`${baseURL}/${postId}`, {
    method: "DELETE",
  })
    .then((res) => {
     
      displayPosts(); // Refresh list
      postDetailDiv.innerHTML = ""; // Clear details
    })
    .catch((error) => console.error("Error deleting post:", error));
}
// this adds  elements from the form 
function addNewPostListener() {
  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value.trim();
    const content = document.querySelector("#content").value.trim();
    const author = document.querySelector("#author").value.trim();
    const imageUrl = document.querySelector("#url").value.trim();

    if (!title || !content || !author || !url) {
      alert("First fill all the fields!");
      return;
    }

    const newPost = { title, content, author, url };

    // Add post locally (no backend persistence yet)
    const postItem = document.createElement("div");
    postItem.className = "post-item";
    postItem.textContent = newPost.title;
    postItem.style.cursor = "pointer";

    postItem.addEventListener("click", () => {
      postDetailDiv.innerHTML = `
        <h3>${newPost.title}</h3>
        <p>${newPost.content}</p>
        <small><em>Author: ${newPost.author}</em></small>
        <p>${imageUrl}</p>
      `;
    });

    postListDiv.appendChild(postItem);

    newPostForm.reset();
  });
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);


