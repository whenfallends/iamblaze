/* ICQ 2006 Messenger Data & Conversation Engine */

const ICQ_DATA = {
  owner: {
    name: "Blaze",
    avatar: "assets/profile-pictures/anya.png",
    status: "online",
    statusMessage: "What's happening right now?"
  },
  soundEnabled: true,
  contacts: [
    {
      id: "mark",
      name: "Giselle",
      status: "online",
      favorite: true,
      hasClock: false,
      avatar: "assets/profile-pictures/mark.png",
      preview: "Promise I'll notice you tomorrow)",
      messages: [
        { sender: "Blaze", isSelf: true, text: "Giselle! Why did you ignore me??", time: "18:36" },
        { sender: "Giselle", isSelf: false, text: "Hi, I didn't notice you...", time: "18:38" },
        { sender: "Blaze", isSelf: true, text: "fine(", time: "18:39" },
        { sender: "Giselle", isSelf: false, text: "Promise I'll notice you tomorrow)", time: "18:40" }
      ],
      replies: [
        "Come on, don't sulk. I really just logged into ICQ :)",
        "Want to go for a walk after classes tomorrow?",
        "Okay, okay, I owe you dinner later ;)"
      ]
    },
    {
      id: "lisana",
      name: "Angela",
      status: "online",
      favorite: true,
      hasClock: false,
      avatar: "assets/profile-pictures/lisana.png",
      preview: "listen, what would you choose..",
      messages: [
        { sender: "Angela", isSelf: false, text: "listen, what would you choose — sneakers or new bag pins?", time: "17:52" },
        { sender: "Blaze", isSelf: true, text: "Definitely sneakers! And lots of black :)", time: "17:55" }
      ],
      replies: [
        "Exactly! Tomorrow I'll send you a webcam pic :D",
        "By the way, did you see Giselle's new avatar?"
      ]
    },
    {
      id: "andrey_mob",
      name: "Andrey",
      status: "away",
      statusIconOverride: "assets/messenger-icons/status-mobile.png",
      favorite: false,
      hasClock: false,
      avatar: "assets/profile-pictures/andrey.png",
      preview: "Well, I understand what was wr...",
      messages: [
        { sender: "Andrey", isSelf: false, text: "Well, I understand what was on the schedule, but I'm on my phone.", time: "16:15" },
        { sender: "Blaze", isSelf: true, text: "Okay, message me once you get to the computer!", time: "16:18" }
      ],
      replies: [
        "I'm on pvz from my phone now and will be home soon.",
        "Got it, we'll talk tonight!"
      ]
    },
    {
      id: "andrey_smile",
      name: "andrey =)",
      status: "online",
      favorite: true,
      hasClock: false,
      avatar: "assets/profile-pictures/andrey-smile.png",
      preview: "Wow, that whole thing was crazy)",
      messages: [
        { sender: "andrey =)", isSelf: false, text: "Wow, that whole thing was crazy) I'll tell you when we meet!", time: "18:10" },
        { sender: "Blaze", isSelf: true, text: "Haha, now you've intrigued me :D", time: "18:12" }
      ],
      replies: [
        "Seriously, we laughed for half an hour xD",
        "Send me that track from Winamp!"
      ]
    },
    {
      id: "maxim",
      name: "Maxim",
      status: "online",
      favorite: false,
      hasClock: false,
      avatar: "assets/profile-pictures/maxim.png",
      preview: "yes, but later, busy with design",
      messages: [
        { sender: "Blaze", isSelf: true, text: "Max, can you help me make a banner for my blog?", time: "15:40" },
        { sender: "Maxim", isSelf: false, text: "yes, but later, busy with design", time: "15:44" }
      ],
      replies: [
        "im finishing it in Photoshop now, I'll be free soon!",
        "which font do you like better?"
      ]
    },
    {
      id: "pavel",
      name: "Pavel I",
      status: "offline",
      favorite: false,
      hasClock: true,
      avatar: "assets/profile-pictures/pavel.png",
      preview: "Was online 2 hours ago",
      messages: [
        { sender: "Pavel I", isSelf: false, text: "Just so you know, I went to study for the exam.", time: "14:20" }
      ],
      replies: [
        "(Auto-response) I'm away from the computer."
      ]
    },
    {
      id: "redka",
      name: "Mochi",
      status: "online",
      favorite: true,
      hasClock: false,
      avatar: "assets/profile-pictures/redka.png",
      preview: "woof!",
      messages: [
        { sender: "Mochi", isSelf: false, text: "woof!", time: "18:01" },
        { sender: "Blaze", isSelf: true, text: "Hi, long-eared one <3", time: "18:02" }
      ],
      replies: [
        "woof-woof! :)",
        "rrr-woof! :D"
      ]
    },
    {
      id: "irka",
      name: "Guy",
      status: "online",
      favorite: true,
      hasClock: false,
      avatar: "assets/profile-pictures/irka.png",
      preview: "haha, you sure had a good rest)",
      messages: [
        { sender: "Guy", isSelf: false, text: "haha, you sure had a good rest)", time: "17:30" },
        { sender: "Blaze", isSelf: true, text: "It was awesome, I could barely get up today :)", time: "17:33" }
      ],
      replies: [
        "let's go take pictures in the park tomorrow!",
        "Hahaha, I knew it ;)"
      ]
    },
    {
      id: "bek",
      name: "Chloe",
      status: "online",
      favorite: false,
      hasClock: false,
      avatar: "assets/profile-pictures/bek.png",
      preview: "hey! wanna go Saturday?",
      messages: [
        { sender: "Chloe", isSelf: false, text: "hey! wanna go to a concert Saturday?", time: "18:05" }
      ],
      replies: [
        "There are still tickets, decide by tomorrow B)",
        "Great, stay in touch!"
      ]
    },
    {
      id: "levchik",
      name: "iamprogamer07",
      status: "online",
      favorite: false,
      hasClock: false,
      avatar: "assets/profile-pictures/levchik.png",
      preview: "can't today, I'll ping you later",
      messages: [
        { sender: "iamprogamer07", isSelf: false, text: "can't today, I'll ping you later", time: "16:50" }
      ],
      replies: [
        "Okay, we'll catch up tomorrow on ICQ!"
      ]
    },
    {
      id: "unknown",
      name: "Unknown",
      status: "online",
      favorite: false,
      hasClock: false,
      avatar: "assets/profile-pictures/unknown.png",
      preview: "Hi! Wanna get acquainted?",
      messages: [
        { sender: "Unknown", isSelf: false, text: "Hi! I found your UIN in the ICQ search :)", time: "18:25" }
      ],
      replies: [
        "Where are you from? How old are you? :)"
      ]
    }
  ]
};

const EMOTICON_MAP = [
  { code: ":)", img: "assets/emoticons/smile.png" },
  { code: ":-)", img: "assets/emoticons/smile.png" },
  { code: ":(", img: "assets/emoticons/sad.png" },
  { code: ":-(", img: "assets/emoticons/sad.png" },
  { code: ";)", img: "assets/emoticons/wink.png" },
  { code: ";-)", img: "assets/emoticons/wink.png" },
  { code: ":D", img: "assets/emoticons/laugh.png" },
  { code: "B)", img: "assets/emoticons/cool.png" },
  { code: "<3", img: "assets/emoticons/heart.png" },
  { code: ">:(", img: "assets/emoticons/angry.png" },
  { code: ":O", img: "assets/emoticons/surprised.png" }
];

function playNotificationSound() {
  if (!ICQ_DATA.soundEnabled) return;
  const audioEl = document.getElementById("notification-audio");
  if (audioEl) {
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  }
}

function getStatusIconPath(contact) {
  if (contact.statusIconOverride) return contact.statusIconOverride;
  if (contact.status === "offline") return "assets/messenger-icons/icq-flower-offline.png";
  if (contact.status === "away") return "assets/messenger-icons/icq-flower-away.png";
  return "assets/messenger-icons/icq-flower-online.png";
}

function getStatusLabel(status) {
  if (status === "offline") return "Offline";
  if (status === "away") return "Away";
  return "Online";
}

function formatMessageTextWithEmoticons(rawText) {
  const escaped = rawText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  let html = escaped;
  EMOTICON_MAP.forEach((item) => {
    const escapedCode = item.code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedCode, "g");
    html = html.replace(
      regex,
      `<img src="${item.img}" alt="${item.code}" class="msg-inline-emo">`
    );
  });
  return html;
}

function getCurrentTimeHHMM() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
