const container = document.getElementById("blogContainer");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");
const blogForm = document.getElementById("blogForm");
const themeBtn = document.getElementById("themeBtn");

const defaultBlogs = [
  {
    title: "The Future of Artificial Intelligence",
    category: "Technology",
    content: "Artificial Intelligence is changing how we learn, work, and solve problems. Its future holds exciting possibilities."
  },
  {
    title: "5 Habits for a Productive Life",
    category: "Lifestyle",
    content: "Build a routine, set clear goals, avoid distractions, take breaks, and keep learning every day."
  },
  {
    title: "Why Every Student Should Learn Coding",
    category: "Education",
    content: "Coding develops logical thinking, creativity, and problem-solving skills that are useful in many careers."
  }
];

let blogs;

try {
  const saved = localStorage.getItem("myBlogs");
  blogs = saved ? JSON.parse(saved) : defaultBlogs;

  if (!Array.isArray(blogs)) {
    blogs = defaultBlogs;
  }
} catch {
  blogs = defaultBlogs;
}

function saveBlogs() {
  try {
    localStorage.setItem("myBlogs", JSON.stringify(blogs));
  } catch {
    alert("Unable to save posts in this browser.");
  }
}

function renderBlogs() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = blogs.filter(blog =>
    blog.title.toLowerCase().includes(query) ||
    blog.category.toLowerCase().includes(query) ||
    blog.content.toLowerCase().includes(query)
  );

  container.replaceChildren();

  filtered.forEach(blog => {
    const card = document.createElement("article");
    card.className = "blog-card";

    const category = document.createElement("span");
    category.className = "category";
    category.textContent = blog.category;

    const title = document.createElement("h3");
    title.textContent = blog.title;

    const content = document.createElement("p");
    content.textContent = blog.content;

    card.append(category, title, content);

    if (blog.custom) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete post";

      deleteBtn.addEventListener("click", () => {
        blogs = blogs.filter(item => item.id !== blog.id);
        saveBlogs();
        renderBlogs();
      });

      card.appendChild(deleteBtn);
    }

    container.appendChild(card);
  });

  noResults.hidden = filtered.length > 0;
}

searchInput.addEventListener("input", renderBlogs);

blogForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = document.getElementById("blogTitle").value.trim();
  const category = document.getElementById("blogCategory").value.trim();
  const content = document.getElementById("blogContent").value.trim();

  if (!title || !category || !content) {
    alert("Please fill in all fields.");
    return;
  }

  blogs.unshift({
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    title,
    category,
    content,
    custom: true
  });

  saveBlogs();
  blogForm.reset();
  searchInput.value = "";
  renderBlogs();

  alert("Your blog has been published!");
  document.getElementById("blogs").scrollIntoView({
    behavior: "smooth"
  });
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";

  try {
    localStorage.setItem("myTheme", isDark ? "dark" : "light");
  } catch {}
});

try {
  if (localStorage.getItem("myTheme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }
} catch {}

renderBlogs();
