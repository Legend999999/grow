
let users = JSON.parse(localStorage.getItem("users") || "{}");
let currentUser = localStorage.getItem("currentUser");

const authBox = document.getElementById("authBox");
const notesBox = document.getElementById("notesBox");

if(currentUser) showNotes();

function saveUsers() { localStorage.setItem("users", JSON.stringify(users)); }

function signup() {
  const u = username.value.trim();
  const p = password.value;
  if(!u || !p) return alert("خانەکان بە بەتاڵی جێ مەهێڵە");
  if(users[u]) return alert("ناتوانیت چەند ئەکاونتێک دروست بکەیت بە هەمان یوسەر");
  users[u] = { password: p, categories: {} };
  saveUsers();
  alert("ئەکاونتەکە دروستکرا");
}

function login() {
  const u = username.value.trim();
  const p = password.value;
  if(!users[u] || users[u].password !== p) return alert("پاسوۆرد یان یوسەر هەڵەیە");
  currentUser = u;
  localStorage.setItem("currentUser", u);
  showNotes();
}

function logout() { localStorage.removeItem("currentUser"); location.reload(); }

function showNotes() { authBox.classList.add("hidden"); notesBox.classList.remove("hidden"); render(); }

function addCategory() {
  const name = newCategory.value.trim();
  if(!name) return alert("ناوی خشتەی نوێیەکە؟");
  if(users[currentUser].categories[name]) return alert("ئەو خشتەیە بوونی هەیە ناوێکی تر دابنێ");
  users[currentUser].categories[name] = [];
  newCategory.value = "";
  saveUsers();
  render();
}

function addNote(cat) {
  const text = prompt("تێبینیەکەت بنووسە؟");
  if(!text) return;
  users[currentUser].categories[cat].push({ content: text });
  saveUsers();
  render();
}

function editNote(cat, index) {
  const newText = prompt("دەستکاریکردنی تێبینیەکە", users[currentUser].categories[cat][index].content);
  if(!newText) return;
  users[currentUser].categories[cat][index].content = newText;
  saveUsers();
  render();
}

function deleteNote(cat, index) {
  if(!confirm("ئەتەوێت ئەم تێبییە بسڕیتەوە؟")) return;
  users[currentUser].categories[cat].splice(index, 1);
  saveUsers();
  render();
}

function editCategory(cat) {
  const newName = prompt("دەستکاری ناوی خشتەکە ئەکەیت؟", cat);
  if(!newName || newName === cat) return;
  if(users[currentUser].categories[newName]) return alert("ئەم ناوە بوونی هەیە ناوێکی تر بدۆزەوە");
  users[currentUser].categories[newName] = users[currentUser].categories[cat];
  delete users[currentUser].categories[cat];
  saveUsers();
  render();
}

function deleteCategory(cat) {
  if(!confirm("ئەم خشتەیە بسڕیتەوە هەموو تێبینیەکانی ئەم خشتەیە دەسڕێتەوە")) return;
  delete users[currentUser].categories[cat];
  saveUsers();
  render();
}

function render() {
  const container = document.getElementById("categories");
  container.innerHTML = "";
  const cats = users[currentUser].categories;

  for(const cat in cats) {
    const div = document.createElement("div");
    div.className = "category";

    const header = document.createElement("div");
    header.className = "category-header";
    header.innerHTML = `<strong>${cat}</strong>`;

    // Add Note button
    const addBtn = document.createElement("button");
    addBtn.textContent = "+ زیادکردنی تێبینی";
    addBtn.className = "add-note-btn";
    addBtn.onclick = () => addNote(cat);
    header.appendChild(addBtn);

    // Edit/Delete category buttons
    const editCatBtn = document.createElement("button");
    editCatBtn.textContent = "Edit";
    editCatBtn.className = "cat-action";
    editCatBtn.onclick = () => editCategory(cat);

    const delCatBtn = document.createElement("button");
    delCatBtn.textContent = "Delete";
    delCatBtn.className = "cat-action delete";
    delCatBtn.onclick = () => deleteCategory(cat);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "cat-actions";
    actionsDiv.appendChild(editCatBtn);
    actionsDiv.appendChild(delCatBtn);
    header.appendChild(actionsDiv);

    div.appendChild(header);

    // Notes
    cats[cat].forEach((n, i) => {
      const noteDiv = document.createElement("div");
      noteDiv.className = "note";
      noteDiv.innerHTML = `<span>${n.content}</span>`;

      const btns = document.createElement("div");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => editNote(cat, i);

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteNote(cat, i);

      btns.appendChild(editBtn);
      btns.appendChild(delBtn);
      noteDiv.appendChild(btns);
      div.appendChild(noteDiv);
    });

    container.appendChild(div);
  }
}
