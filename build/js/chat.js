function loadChannels() {
    db.ref("channels").on("value", s => {
        channelsData = [];
        s.forEach(c => {
            if(c.key.startsWith("dm__") && !c.key.includes(username)) return;
            channelsData.push({id: c.key, ...c.val()});
        });
        renderChannels();
    });
}

function renderChannels() {
    const l = document.getElementById("channelList");
    l.innerHTML = "";
    channelsData.forEach(c => {
        const d = document.createElement("div");
        d.className = "channelRow" + (c.id === currentChannel ? " active" : "");
        d.innerHTML = `<span>${c.id}</span>`;
        d.onclick = () => joinChannel(c.id);
        l.appendChild(d);
    });
}

function joinChannel(n) {
    if(currentChannel) db.ref("messages/"+currentChannel).off();
    currentChannel = n;
    document.getElementById("chatTitle").textContent = n;
    document.getElementById("messages").innerHTML = "";
    db.ref("messages/"+n).on("child_added", s => appendMessage(s.val(), s.key));
    renderChannels();
}

async function sendMessage() {
    const i = document.getElementById("msgInput");
    const t = await autoMod(i.value.trim());
    if(!t || !currentChannel) return;
    db.ref("messages/"+currentChannel).push({user: username, text: t, ts: Date.now()});
    i.value = ""; autoExpand(i);
}

function appendMessage(m, id) {
    const c = document.getElementById("messages");
    const d = document.createElement("div");
    d.className = "message";
    d.innerHTML = `
        <div class="avatar" style="background:${uidColor(m.user)}">${initials(m.user)}</div>
        <div class="msgBody">
            <div style="font-weight:bold;color:${uidColor(m.user)}">${m.user} <span style="font-size:10px;color:#888">${nowHHMM(m.ts)}</span></div>
            <div>${escapeHTML(m.text)}</div>
        </div>`;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
}

function startPresence() {
    const r = db.ref("presence/"+username);
    r.set({status: "online", lastSeen: Date.now()});
    r.onDisconnect().remove();
}

function loadUserList() {
    db.ref("presence").on("value", s => {
        const l = document.getElementById("userList");
        l.innerHTML = "";
        s.forEach(u => {
            const d = document.createElement("div");
            d.innerHTML = `<span class="statusDot status-${u.val().status}"></span> ${u.key}`;
            l.appendChild(d);
        });
    });
}

function listenToNotifs() {
    db.ref(`users/${username}/notifications`).on("value", s => {
        const b = document.getElementById("notifBadge");
        b.style.display = s.exists() ? "block" : "none";
        b.textContent = s.numChildren();
    });
}
