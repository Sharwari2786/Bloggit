// --- Local Storage Helpers ---
function getUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// --- SIGNUP HANDLER ---
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address.");
      return;
    }

    const users = getUsers();
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      alert("Account already exists! Please login.");
      window.location.href = "login.html";
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);
    alert("Signup successful! Please login now.");
    window.location.href = "login.html";
  });
}

// --- LOGIN HANDLER ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();

    const users = getUsers();

    console.log("All users:", users); // ✅ Debug line
    console.log("Trying login with:", email, password); // ✅ Debug line

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert(`Welcome ${user.name}!`);
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  });
}

// --- LOGOUT FUNCTION ---
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}
