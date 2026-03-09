const escapeHTML = t => (t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const initials = n => n ? n.trim().charAt(0).toUpperCase() : "?";
const nowHHMM = ts => { const d = ts ? new Date(ts) : new Date(); return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };
const uidColor = n => {
    const p = ["#e67e22","#e74c3c","#9b59b6","#16a085","#f39c12","#3498db","#2ecc71","#d35400","#1abc9c","#8e44ad"];
    let h = 0; for(let i=0; i<(n||"").length; i++) h = (h << 5) - h + n.charCodeAt(i);
    return p[Math.abs(h) % p.length];
};

async function autoMod(t) {
    let p = t; if(p.length > 500) p = p.substring(0, 500);
    if(window.obscenity?.matcher) p = window.obscenity.censor.applyTo(p, window.obscenity.matcher.getAllMatches(p));
    BLACKLIST.forEach(w => p = p.replace(new RegExp(`\\b${w}\\b`,"gi"), "🤐"));
    return p;
}

function isBanned(t) {
    if(!t) return false;
    if(window.obscenity?.matcher?.hasMatch(t)) return true;
    return BLACKLIST.some(w => new RegExp(`\\b${w}\\b`,"i").test(t));
}

async function loadExternalBlacklist() {
    try {
        const r = await fetch("https://cdn.jsdelivr.net/gh/hothost59/automod-list@master/list.txt");
        const b = await r.text();
        BLACKLIST = [...new Set(JSON.parse("[" + atob(b.trim()) + "]"))];
    } catch(e) {}
}
loadExternalBlacklist();
