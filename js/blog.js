function estimateReadTime(text) {
  const wordsPerMinute = 200;
  const trimmed = text.trim();
  if (!trimmed) return "1 min read";
  const words = trimmed.split(/\s+/).length;
  return `${Math.ceil(words / wordsPerMinute)} min read`;
}

function getSafeSlug(slug) {
  if (!slug) return null;
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  return slug;
}

function renderBlogMessage(title, message) {
  const container = document.getElementById("blog-post");
  if (!container) return;
  container.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
}

function loadBlogPost() {
  const postContainer = document.getElementById("blog-post");
  const readTimeElement = document.getElementById("read-time");

  if (!postContainer || !readTimeElement) return;

  const params = new URLSearchParams(window.location.search);
  const postSlug = getSafeSlug(params.get("post"));

  if (!postSlug) {
    renderBlogMessage("Choose a Post", 'Please open an article from the <a href="blog.html">blog listing page</a>.');
    readTimeElement.textContent = "";
    return;
  }

  function copyCode(button) {
  const codeElement = button?.parentElement?.querySelector("code");
  if (!codeElement) return;

  const text = codeElement.innerText || codeElement.textContent || "";
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalText = button.textContent;
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1200);
    })
    .catch(() => {
      button.textContent = "Failed";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    });
}

function extractPostContent(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const article = doc.querySelector("article.blog-wrapper, article");
  const renderedHtml = article ? article.outerHTML : (doc.body?.innerHTML || html);
  const textContent = article ? (article.textContent || "") : (doc.body?.textContent || "");
  return { renderedHtml, textContent };
}


  fetch(`posts/${postSlug}.html`)
    .then((response) => {
      if (!response.ok) throw new Error("Post not found");
      return response.text();
    })
    .then((html) => {
          const { renderedHtml, textContent } = extractPostContent(html);
      postContainer.innerHTML = renderedHtml;
      readTimeElement.textContent = estimateReadTime(textContent);
    })
    .catch(() => {
      renderBlogMessage("Post Not Found", 'Try <a href="blog.html">browsing other articles</a>.');
      readTimeElement.textContent = "";
    });
}

window.addEventListener("DOMContentLoaded", () => {
  loadBlogPost();
});
