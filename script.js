// ====== MyBlog Front-End Logic (Dynamic Posts + Media) ======

const POSTS_KEY = 'myblog_posts';

// Utility functions
function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch (e) { return fallback; }
}
function writeJSON(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function nowISO() { return new Date().toISOString(); }

// Main container
const postsContainer = document.getElementById('postsContainer');
const yearLabel = document.getElementById('year');
if (yearLabel) yearLabel.textContent = new Date().getFullYear();

// Render posts dynamically
function renderPosts() {
  const posts = readJSON(POSTS_KEY, []);
  postsContainer.innerHTML = '';

  if (!posts.length) {
    postsContainer.innerHTML = '<p>No posts yet. Go to "Create" to publish your first blog!</p>';
    return;
  }

  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'blog-post';

    const title = document.createElement('h3');
    title.textContent = post.title;

    const desc = document.createElement('p');
    desc.textContent = post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content;

    const readMore = document.createElement('button');
    readMore.textContent = 'Read More';
    readMore.className = 'read-more';
    readMore.onclick = () => openFullPost(post);

    // Display thumbnail media
    if (post.media && post.media.length) {
      const mediaWrap = document.createElement('div');
      post.media.forEach(m => {
        if (m.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = m.url;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '10px';
          mediaWrap.appendChild(img);
        } else if (m.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = m.url;
          video.controls = true;
          video.style.maxWidth = '100%';
          mediaWrap.appendChild(video);
        } else if (m.type === 'application/pdf') {
          const iframe = document.createElement('iframe');
          iframe.src = m.url;
          iframe.width = '100%';
          iframe.height = '400';
          mediaWrap.appendChild(iframe);
        }
      });
      postDiv.appendChild(mediaWrap);
    }

    postDiv.appendChild(title);
    postDiv.appendChild(desc);
    postDiv.appendChild(readMore);
    postsContainer.appendChild(postDiv);
  });
}

// Open full post in overlay
function openFullPost(post) {
  const overlay = document.createElement('div');
  overlay.style = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.8);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
  `;

  const panel = document.createElement('div');
  panel.style = `
    background: white; color: black; padding: 20px; border-radius: 12px;
    max-width: 800px; max-height: 90%; overflow: auto; position: relative;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✖';
  closeBtn.style = `
    position: absolute; top: 10px; right: 15px;
    background: red; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 5px 10px;
  `;
  closeBtn.onclick = () => document.body.removeChild(overlay);

  const title = document.createElement('h2');
  title.textContent = post.title;
  const content = document.createElement('p');
  content.innerHTML = post.content.replace(/\n/g, '<br>');

  panel.appendChild(closeBtn);
  panel.appendChild(title);
  panel.appendChild(content);

  (post.media || []).forEach(m => {
    if (m.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = m.url;
      img.style.maxWidth = '100%';
      img.style.marginTop = '10px';
      panel.appendChild(img);
    } else if (m.type.startsWith('video/')) {
      const v = document.createElement('video');
      v.src = m.url;
      v.controls = true;
      v.style.maxWidth = '100%';
      v.style.marginTop = '10px';
      panel.appendChild(v);
    } else if (m.type === 'application/pdf') {
      const iframe = document.createElement('iframe');
      iframe.src = m.url;
      iframe.width = '100%';
      iframe.height = '500';
      panel.appendChild(iframe);
    }
  });

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

// Auto-run
renderPosts();
