export function renderNavbar() {
  const currentPath = window.location.pathname;
  //console.log("Current Path:", window.location.pathname);
  const nav = document.createElement("nav");
  nav.className = "bg-gray-900 text-white px-6 py-4 shadow";

  const container = document.createElement("div");
  container.className = "flex justify-between items-center max-w-5xl mx-auto";


  const logo = document.createElement("div");
  logo.className = "flex items-center gap-2";

  const logoImg = document.createElement("img");
  logoImg.src = "logo.png"; 
  logoImg.alt = "Movie Diary Logo";
  logoImg.className = "h-14 w-14"; 

  const logoText = document.createElement("span");
  logoText.textContent = "Movie Diary";
  logoText.className = "text-2xl font-bold tracking-wide";

  logo.appendChild(logoImg);
  logo.appendChild(logoText);

  const button = document.createElement("button");
  button.className =
    "bg-white text-gray-900 font-medium px-4 py-2 rounded hover:bg-gray-200 transition";

  if (currentPath.endsWith("index.html") || currentPath === "/" || currentPath.endsWith("/")) {
    button.textContent = "Favorites";
    button.addEventListener("click", () => {
      window.location.href = "journal.html";
    });
  } else if (currentPath.endsWith("journal.html")) {
    button.textContent = "Home";
    button.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  container.appendChild(logo);
  container.appendChild(button);
  nav.appendChild(container);

  document.body.prepend(nav);
}
