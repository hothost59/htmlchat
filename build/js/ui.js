function toggleTheme() {
    lightTheme = !lightTheme;
    document.documentElement.classList.toggle("light", lightTheme);
    document.getElementById("themeBtn").textContent = lightTheme ? "☀️" : "🌙";
}

function autoExpand(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function showModal(title, sub, cb, opt={}) {
    modalCallback = cb;
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalSubtitle").textContent = sub;
    document.getElementById("modalOverlay").style.display = "flex";
    const i = document.getElementById("modalInput");
    i.style.display = opt.showInput ? "block" : "none";
    const c = document.getElementById("modalCustomContent");
    c.innerHTML = ""; if(opt.customHTML) c.appendChild(opt.customHTML);
    if(opt.showInput) i.focus();
}

function closeModal() { document.getElementById("modalOverlay").style.display = "none"; }
function submitModal() {
    const i = document.getElementById("modalInput");
    const v = i.style.display !== "none" ? i.value.trim() : true;
    if(modalCallback) modalCallback(v);
    closeModal();
}

function cycleStatus() {
    const m = {online:"away", away:"offline", offline:"online"};
    myStatus = m[myStatus];
    db.ref("presence/"+username).update({status: myStatus});
    document.getElementById("myStatusBtn").textContent = {online:"🟢", away:"🟡", offline:"⚪"}[myStatus];
}
