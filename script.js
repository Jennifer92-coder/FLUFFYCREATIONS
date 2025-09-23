let users = [];
let currentUser = null;
let codes = {
  "10-STS-A1": 10,
  "10-STS-B2": 10,
  "20-STS-C3": 20,
  "20-STS-D4": 20
};

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}

function register() {
  const user = {
    name: document.getElementById("regName").value,
    address: document.getElementById("regAddress").value,
    dob: document.getElementById("regDOB").value,
    email: document.getElementById("regEmail").value,
    phone: document.getElementById("regPhone").value,
    password: document.getElementById("regPassword").value,
    points: 0,
    photo: "assets/logoperusahaan.png",
    riwayat: []
  };
  users.push(user);
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.location.href = "dashboard.html";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;
  currentUser = users.find(u => u.email === email && u.password === pass);
  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    window.location.href = "dashboard.html";
  } else {
    alert("Login gagal. Periksa email & password.");
  }
}

window.onload = () => {
  if (window.location.pathname.includes("dashboard.html")) {
    let saved = JSON.parse(localStorage.getItem("currentUser"));
    if (saved) {
      currentUser = saved;
      document.getElementById("userName").textContent = currentUser.name;
      document.getElementById("userPoints").textContent = currentUser.points;
      document.getElementById("profilePhoto").src = currentUser.photo;
      updateRiwayat();
    }
  }
};

function showSection(id) {
  document.querySelectorAll("main section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// Daftar kode & nilai poin
const codes = {
  "10-STS-A1": 10,
  "10-STS-B2": 10,
  "20-STS-C3": 20,
  "20-STS-D4": 20
};

// Ambil poin & kode terpakai dari localStorage
let usedCodes = JSON.parse(localStorage.getItem("usedCodes")) || [];

function redeemCode() {
  const code = document.getElementById("codeInput").value.trim();

  if (codes[code]) {
    if (usedCodes.includes(code)) {
      document.getElementById("redeemMsg").textContent = "❌ Kode sudah pernah digunakan.";
      document.getElementById("redeemMsg").style.color = "red";
    } else {
      currentUser.points += codes[code];
      usedCodes.push(code);

      // Simpan ke localStorage
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("usedCodes", JSON.stringify(usedCodes));

      document.getElementById("userPoints").textContent = currentUser.points;
      document.getElementById("redeemMsg").textContent = `✅ Berhasil! Kamu dapat ${codes[code]} poin.`;
      document.getElementById("redeemMsg").style.color = "green";
    }
  } else {
    document.getElementById("redeemMsg").textContent = "❌ Kode tidak valid.";
    document.getElementById("redeemMsg").style.color = "red";
  }

  document.getElementById("codeInput").value = "";
}


function tukarReward(nama, poin) {
  if (currentUser.points >= poin) {
    currentUser.points -= poin;
    currentUser.riwayat.push(`${nama} (−${poin} poin)`);
    alert("Berhasil tukar reward: " + nama);
    document.getElementById("userPoints").textContent = currentUser.points;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateRiwayat();
  } else {
    alert("Poin kamu tidak cukup untuk menukar reward ini.");
  }
}

function updateRiwayat() {
  const ul = document.getElementById("riwayatList");
  if (!ul) return;
  ul.innerHTML = "";
  currentUser.riwayat.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

function editProfile() {
  alert("Fitur edit akun masih prototype.");
}

function uploadPhoto(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      currentUser.photo = e.target.result;
      document.getElementById("profilePhoto").src = currentUser.photo;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    };
    reader.readAsDataURL(file);
  }
}


// Auto-redirect kalau sudah login
if (window.location.pathname.includes("index.html")) {
  let saved = JSON.parse(localStorage.getItem("currentUser"));
  if (saved) {
    window.location.href = "dashboard.html";
  }
}
