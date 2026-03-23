let menuData = { /* your categories */ };

async function loadMenu(){

  try{

    const res = await fetch("menu.json?v=" + new Date().getTime());    menuData = await res.json();
    renderCategories();

    // load first category by default
    const firstCategory = Object.keys(menuData)[0];
    showCategory(firstCategory);

  }catch(e){
    console.error("Failed to load menu", e);
  }

}

function loadCategories(){
  const div = document.getElementById("categories");

  Object.keys(menuData).forEach(cat=>{
    div.innerHTML += `
<button onclick="showCategory('${cat}', this)">
${cat}
</button>`;
  });
}

function showCategory(category, btn){

  document.getElementById("selectedCategory").innerText = category;

  document.querySelectorAll(".category-btn").forEach(b=>{
    b.classList.remove("active");
  });

  if(btn){
    btn.classList.add("active");
  }

  const menuDiv = document.getElementById("menu");
  menuDiv.innerHTML = "";

  menuData[category].forEach(item=>{
    menuDiv.innerHTML += `
<div class="item">
<b>${item.name}</b><br>
₹${item.price}<br>
<button onclick='addItem("${item.name}",${item.price})'>Add</button>
</div>
`;
  });

}

function renderCategories(){

  const div = document.getElementById("categories");
  div.innerHTML = "";

  Object.keys(menuData).forEach(cat=>{
    div.innerHTML += `
<button class="category-btn" onclick="showCategory('${cat}', this)">
${cat}
</button>
`;
  });

}
