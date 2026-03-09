const firebaseConfig = {
    apiKey: "AIzaSyDbyrqzcZ4Wk57xBNVDzNuRerQaBx2p1L0",
    authDomain: "htmlchat-8b2c5.firebaseapp.com",
    databaseURL: "https://htmlchat-8b2c5-default-rtdb.firebaseio.com",
    projectId: "htmlchat-8b2c5",
    storageBucket: "htmlchat-8b2c5.firebasestorage.app",
    messagingSenderId: "678413131330",
    appId: "1:678413131330:web:7685c9e904b8f4d055d7db",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let username = "", currentChannel = "", myStatus = "online", lastMsgTime = 0, replyingToId = null;
let modalCallback = null, lastMessageMeta = { user: null, ts: 0 }, autoScroll = true, lightTheme = false;
let userSettings = { desktopNotifications: true }, loginTime = Date.now(), mentionCounts = {}, channelsData = [], BLACKLIST = [];
