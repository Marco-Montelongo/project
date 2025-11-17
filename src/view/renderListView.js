export function renderMenu(menuData) {
  const sidebar = document.getElementById("main-menu");
  sidebar.innerHTML = "";
  menuData.forEach(section => {
    const li = document.createElement("li");
    li.classList.add("menu-item");

    const btn = document.createElement("button");
    btn.classList.add("menu-toggle");
    btn.textContent = section.title;
    li.appendChild(btn);

    const submenu = document.createElement("ul");
    submenu.classList.add("submenu");
    section.items.forEach(item => {
      const subLi = document.createElement("li");
      subLi.textContent = item;
      submenu.appendChild(subLi);
    });

    li.appendChild(submenu);
    sidebar.appendChild(li);
  });
}
