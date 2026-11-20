/* Main Application Controller */

let selectedContactId = "mark";
let currentFilter = "all";
let composerMode = "chat";

function getSelectedContact() {
  return ICQ_DATA.contacts.find((c) => c.id === selectedContactId) || ICQ_DATA.contacts[0];
}

function showSystemNotice(text) {
  const noticeEl = document.getElementById("chat-system-notice");
  noticeEl.textContent = text;
  noticeEl.classList.remove("hidden");
  clearTimeout(noticeEl._hideTimer);
  noticeEl._hideTimer = setTimeout(() => {
    noticeEl.classList.add("hidden");
  }, 3000);
}

function renderContactList() {
  const listEl = document.getElementById("contacts-list");
  listEl.innerHTML = "";

  const filtered = ICQ_DATA.contacts.filter((contact) => {
    if (currentFilter === "online") return contact.status === "online" || contact.status === "away";
    if (currentFilter === "offline") return contact.status === "offline";
    if (currentFilter === "favorites") return Boolean(contact.favorite);
    return true;
  });

  filtered.forEach((contact) => {
    const li = document.createElement("li");
    li.className = `contact-row ${contact.status === "offline" ? "offline" : ""} ${
      contact.id === selectedContactId ? "selected" : ""
    }`;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", String(contact.id === selectedContactId));

    const clockHtml = contact.hasClock
      ? `<img src="assets/decorations/mini-clock.png" alt="Idle" class="contact-mini-clock">`
      : "";

    li.innerHTML = `
      <div class="contact-left">
        <img src="${getStatusIconPath(contact)}" alt="${contact.status}" class="contact-status-icon">
        <div class="contact-text-info">
          <div class="contact-name-line">
            <span class="contact-name">${contact.name}</span>
            ${clockHtml}
          </div>
          <span class="contact-preview">${contact.preview}</span>
        </div>
      </div>
      <div class="contact-thumb">
        <img src="${contact.avatar}" alt="${contact.name}">
      </div>
    `;

    li.addEventListener("click", () => {
      selectedContactId = contact.id;
      renderContactList();
      renderActiveConversation();
      openOrRestoreWindow("chat-window");
      if (window.innerWidth <= 720) {
        switchMobileView("chat-window");
      }
    });

    listEl.appendChild(li);
  });
}

function renderActiveConversation() {
  const contact = getSelectedContact();
  if (!contact) return;

  document.getElementById("chat-tab-contact-name").textContent = contact.name;
  document.getElementById("chat-tab-status-icon").src = getStatusIconPath(contact);
  document.getElementById("chat-contact-avatar").src = contact.avatar;
  document.getElementById("chat-contact-status-text").textContent = getStatusLabel(contact.status);

  const mobileLabel = document.getElementById("mobile-active-contact");
  if (mobileLabel) mobileLabel.textContent = contact.name;

  const chatTaskbarBtn = document.querySelector('.taskbar-item[data-target="chat-window"] span');
  if (chatTaskbarBtn) chatTaskbarBtn.textContent = `ICQ — ${contact.name}`;

  const historyEl = document.getElementById("chat-history");
  historyEl.innerHTML = "";

  contact.messages.forEach((msg, index) => {
    const item = document.createElement("div");
    item.className = "chat-message-item";
    const senderName = msg.isSelf ? ICQ_DATA.owner.name : contact.name;
    const isLatest = index === contact.messages.length - 1;

    item.innerHTML = `
      <div class="msg-header">
        <span class="msg-sender ${msg.isSelf ? "sender-self" : "sender-contact"}">${senderName}</span>
        <span class="msg-time">${msg.time || ""}</span>
      </div>
      <div class="msg-body ${isLatest ? "new-msg" : ""}">${formatMessageTextWithEmoticons(msg.text)}</div>
    `;
    historyEl.appendChild(item);
  });

  historyEl.scrollTop = historyEl.scrollHeight;
}

function sendUserMessage(rawText) {
  const text = rawText.trim();
  if (!text) return;

  const contact = getSelectedContact();
  const timeStr = getCurrentTimeHHMM();
  const prefix = composerMode === "sms" ? "[SMS] " : "";

  contact.messages.push({
    sender: ICQ_DATA.owner.name,
    isSelf: true,
    text: `${prefix}${text}`,
    time: timeStr
  });
  contact.preview = text;

  renderActiveConversation();
  renderContactList();

  // Simulate authentic nostalgic reply if contact is online/away
  if (contact.status !== "offline" && contact.replies && contact.replies.length > 0) {
    const replyPool = contact.replies;
    const replyText = replyPool[Math.floor(Math.random() * replyPool.length)];
    setTimeout(() => {
      contact.messages.push({
        sender: contact.name,
        isSelf: false,
        text: replyText,
        time: getCurrentTimeHHMM()
      });
      contact.preview = replyText;
      playNotificationSound();
      if (selectedContactId === contact.id) {
        renderActiveConversation();
      }
      renderContactList();
    }, 1100);
  }
}

function initMessengerInteractions() {
  // Editable owner username in title bar
  const ownerTitleEl = document.getElementById("chat-owner-name");
  ownerTitleEl.addEventListener("input", () => {
    const updated = ownerTitleEl.textContent.trim() || "Blaze";
    ICQ_DATA.owner.name = updated;
    const contactsTaskbar = document.querySelector('.taskbar-item[data-target="contacts-window"] span');
    if (contactsTaskbar) contactsTaskbar.textContent = `ICQ — ${updated}`;
  });

  // Self status selector
  const selfStatusSelect = document.getElementById("self-status-select");
  const selfStatusFlower = document.getElementById("self-status-flower");
  selfStatusSelect.addEventListener("change", () => {
    const val = selfStatusSelect.value;
    ICQ_DATA.owner.status = val;
    if (val === "offline") selfStatusFlower.src = "assets/messenger-icons/icq-flower-offline.png";
    else if (val === "away") selfStatusFlower.src = "assets/messenger-icons/icq-flower-away.png";
    else selfStatusFlower.src = "assets/messenger-icons/icq-flower-online.png";
  });

  // Self status message input
  const selfStatusInput = document.getElementById("self-status-input");
  selfStatusInput.addEventListener("change", () => {
    ICQ_DATA.owner.statusMessage = selfStatusInput.value;
    showSystemNotice(`Status updated: "${selfStatusInput.value}"`);
  });

  // Contact filter dropdown
  const filterSelect = document.getElementById("contact-filter-select");
  filterSelect.addEventListener("change", () => {
    currentFilter = filterSelect.value;
    renderContactList();
  });

  // Chat / SMS tabs
  const messageInput = document.getElementById("message-input");
  document.querySelectorAll(".composer-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".composer-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      composerMode = tab.dataset.mode;
      messageInput.placeholder =
        composerMode === "sms"
          ? "Enter a free SMS message..."
          : "and yet you're a terrible friend...";
    });
  });

  // Message form submit + Enter to send
  const msgForm = document.getElementById("message-form");
  msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendUserMessage(messageInput.value);
    messageInput.value = "";
  });

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage(messageInput.value);
      messageInput.value = "";
    }
  });

  // Emoticon picker popover
  const emoBtn = document.getElementById("btn-emoticon-picker");
  const emoPopover = document.getElementById("emoticon-popover");
  emoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    emoPopover.classList.toggle("hidden");
  });

  document.querySelectorAll(".emo-choice").forEach((choice) => {
    choice.addEventListener("click", () => {
      messageInput.value += ` ${choice.dataset.emo} `;
      messageInput.focus();
      emoPopover.classList.add("hidden");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#emoticon-popover") && !e.target.closest("#btn-emoticon-picker")) {
      emoPopover.classList.add("hidden");
    }
  });

  // Nudge button
  document.getElementById("btn-nudge").addEventListener("click", () => {
    const chatWin = document.getElementById("chat-window");
    showSystemNotice("You sent a nudge to your contact!");
    playNotificationSound();
    let step = 0;
    const origLeft = chatWin.offsetLeft;
    const shakeTimer = setInterval(() => {
      chatWin.style.left = `${origLeft + (step % 2 === 0 ? 7 : -7)}px`;
      step += 1;
      if (step > 6) {
        clearInterval(shakeTimer);
        chatWin.style.left = `${origLeft}px`;
      }
    }, 45);
  });

  // Action toolbar buttons
  document.querySelectorAll("[data-tool-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showSystemNotice(btn.dataset.toolAction);
    });
  });

  document.getElementById("btn-tzer").addEventListener("click", () => {
    sendUserMessage(":D *ICQ animated postcard!*");
  });

  document.getElementById("btn-gift").addEventListener("click", () => {
    sendUserMessage("<3 A gift for you!");
  });

  document.getElementById("btn-spellcheck").addEventListener("click", () => {
    showSystemNotice("Spellcheck complete: no errors found.");
  });

  document.getElementById("btn-font-style").addEventListener("click", () => {
    const historyEl = document.getElementById("chat-history");
    historyEl.style.fontFamily =
      historyEl.style.fontFamily === "Comic Sans MS, cursive"
        ? "Tahoma, sans-serif"
        : "Comic Sans MS, cursive";
    showSystemNotice("Message font changed.");
  });

  // Close conversation tab
  document.getElementById("close-chat-tab").addEventListener("click", () => {
    minimizeWindow("chat-window");
  });

  // ICQ Menu Dropdown & Sound Toggle
  const menuBtn = document.getElementById("icq-menu-btn");
  const menuDropdown = document.getElementById("icq-menu-dropdown");
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#icq-menu-dropdown") && !e.target.closest("#icq-menu-btn")) {
      menuDropdown.classList.add("hidden");
    }
  });

  function updateSoundButtons() {
    const stateText = ICQ_DATA.soundEnabled ? "ON" : "OFF";
    document.getElementById("toggle-sound-btn").textContent = `ICQ Sounds: ${stateText}`;
    document.getElementById("start-sound-toggle").querySelector("span").textContent = `Sound: ${stateText}`;
  }

  document.getElementById("toggle-sound-btn").addEventListener("click", () => {
    ICQ_DATA.soundEnabled = !ICQ_DATA.soundEnabled;
    updateSoundButtons();
    menuDropdown.classList.add("hidden");
  });

  document.getElementById("start-sound-toggle").addEventListener("click", () => {
    ICQ_DATA.soundEnabled = !ICQ_DATA.soundEnabled;
    updateSoundButtons();
  });

  document.getElementById("tray-sound-btn").addEventListener("click", () => {
    ICQ_DATA.soundEnabled = !ICQ_DATA.soundEnabled;
    updateSoundButtons();
    showSystemNotice(`Notification sounds: ${ICQ_DATA.soundEnabled ? "ON" : "OFF"}`);
  });

  // Add contact button
  function addNewRetroContact() {
    const newId = `friend_${Date.now()}`;
    const names = ["Yesha", "lovelydimes02208292", "Sasha", "Madeline"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    ICQ_DATA.contacts.unshift({
      id: newId,
      name: randomName,
      status: "online",
      favorite: true,
      hasClock: false,
      avatar: "assets/profile-pictures/irka.png",
      preview: "Hi! Add me to your list :)",
      messages: [
        { sender: randomName, isSelf: false, text: "Hi! Add me to your list :)", time: getCurrentTimeHHMM() }
      ],
      replies: ["Hooray, we're in the same contact list! :)"]
    });
    selectedContactId = newId;
    renderContactList();
    renderActiveConversation();
    playNotificationSound();
  }

  document.getElementById("add-contact-quick-btn").addEventListener("click", addNewRetroContact);
  document.getElementById("bottom-add-btn").addEventListener("click", addNewRetroContact);
  document.getElementById("bottom-games-btn").addEventListener("click", () => showSystemNotice("Launching ICQ mini-games..."));
  document.getElementById("bottom-sms-btn").addEventListener("click", () => {
    document.querySelector('.composer-tab[data-mode="sms"]').click();
    openOrRestoreWindow("chat-window");
  });
  document.getElementById("bottom-profile-btn").addEventListener("click", () => showSystemNotice("UIN: 284-910-442 | Status: Online"));
  document.getElementById("bottom-settings-btn").addEventListener("click", () => showSystemNotice("ICQ 2006 Settings"));
  document.getElementById("bottom-help-btn").addEventListener("click", () => showSystemNotice("ICQ 5.1 / 2006 Retro Edition"));

  document.getElementById("reset-demo-btn").addEventListener("click", () => {
    window.location.reload();
  });

  // Top Contact List Tabs
  document.querySelectorAll(".cl-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cl-tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDraggableWindows();
  initDesktopControls();
  initMessengerInteractions();
  renderContactList();
  renderActiveConversation();
  openOrRestoreWindow("notepad-window");

  if (window.innerWidth <= 720) {
    switchMobileView("chat-window");
  }
});
