// Handle blog creation (only if on create page)
if (document.getElementById("blogForm")) {
  document.getElementById("blogForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let title = document.getElementById("blogTitle").value;
    let content = document.getElementById("blogContent").value;
    let mediaInput = document.getElementById("blogMedia").files[0];

    let media = "";
    let mediaType = "";

    if (mediaInput) {
      mediaType = mediaInput.type.startsWith("image") ? "image" :
                  mediaInput.type.startsWith("video") ? "video" :
                  mediaInput.type.includes("pdf") ? "pdf" : "";
      media = URL.createObjectURL(mediaInput);
    }

    let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    blogs.push({ title, content, media, mediaType });
    localStorage.setItem("blogs", JSON.stringify(blogs));

    alert("Blog Published Successfully!");
    window.location.href = "index.html";
  });
}


// Default blogs (always visible)
const defaultBlogsHTML = `
  <div class="blog-post">
    <h3>The Principle of Beautiful Web Design</h3>
    <p>Discover how web design blends creativity and logic to create digital experiences.</p>
    <a href="post1.pdf" class="read-more" target="_blank">Read More</a>
  </div>

  <div class="blog-post">
    <h3>Blogging</h3>
    <p>Learn how to create and upload the blog using this blog.</p>
    <a href="post2.pdf" class="read-more" target="_blank">Read More</a>
  </div>

  <div class="blog-post">
    <h3>Introduction to Blogging</h3>
    <p>Tips on how to manage your blogs and write effective content.</p>
    <a href="post3.pdf" class="read-more" target="_blank">Read More</a>
  </div>
`;

function loadBlogs() {
  const blogContainer = document.getElementById("blogContainer");
  if (!blogContainer) return;

  blogContainer.innerHTML = defaultBlogsHTML;

  const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

  blogs.forEach((blog, index) => {
    const div = document.createElement("div");
    div.className = "blog-post";
    div.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.content}</p>
      ${blog.media ? showMedia(blog.media, blog.mediaType) : ""}
      <button class="delete-btn" onclick="deleteBlog(${index})">Delete</button>
    `;
    blogContainer.appendChild(div);
  });
}

function showMedia(media, type) {
  if (type === "image") return `<img src="${media}" class="blog-media">`;
  if (type === "video") return `<video src="${media}" controls class="blog-media"></video>`;
  if (type === "pdf")  return `<iframe src="${media}" class="blog-media"></iframe>`;
  return "";
}

function deleteBlog(index) {
  if (!confirm("Delete this blog?")) return;

  let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
  blogs.splice(index, 1);
  localStorage.setItem("blogs", JSON.stringify(blogs));
  loadBlogs();
}

// Load blogs on page load
window.onload = loadBlogs;
