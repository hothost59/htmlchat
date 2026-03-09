function switchAuth(m) {
    const isS = m === "signup";
    document.getElementById("authTitle").textContent = isS ? "Create Account" : "Welcome back!";
    document.getElementById("authConfirmContainer").style.display = isS ? "block" : "none";
    document.getElementById("submitBtn").textContent = isS ? "Register" : "Login";
}

async function submitAuth() {
    const u = document.getElementById("authUsername").value.trim();
    const p = document.getElementById("authPassword").value;
    const isS = document.getElementById("submitBtn").textContent === "Register";
    if(!u || !p) return;
    try {
        if(isS) {
            await firebase.auth().createUserWithEmailAndPassword(u+"@chat.com", p);
            await db.ref("users/"+u).set({createdAt: Date.now()});
        } else {
            await firebase.auth().signInWithEmailAndPassword(u+"@chat.com", p);
        }
        username = u;
        afterLogin();
    } catch(e) { document.getElementById("authMessage").textContent = e.message; }
}

function afterLogin() {
    document.getElementById("authDiv").style.display = "none";
    document.getElementById("app").style.display = "flex";
    document.getElementById("meLabel").textContent = username;
    loadChannels(); loadUserList(); startPresence(); listenToNotifs();
}

firebase.auth().onAuthStateChanged(u => {
    if(u && !username) { username = u.email.split("@")[0]; afterLogin(); }
});

function logout() { firebase.auth().signOut().then(() => location.reload()); }
