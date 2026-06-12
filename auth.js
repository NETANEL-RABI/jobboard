// פונקציות עזר משותפות לכל העמודים

// מציג/מסתיר קישורי ניווט בהתאם למצב ההתחברות
async function setupNav() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  const navAuth = document.getElementById("nav-auth");
  if (!navAuth) return;

  if (session) {
    const email = session.user.email;
    navAuth.innerHTML = `
      <a href="post-job.html" class="primary">פרסום משרה</a>
      <span style="align-self:center; color:#6b7280; font-size:14px;">שלום, ${email}</span>
      <button id="logout-btn">התנתקות</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      window.location.href = "index.html";
    });
  } else {
    navAuth.innerHTML = `
      <a href="login.html">התחברות</a>
      <a href="signup.html" class="primary">הרשמה</a>
    `;
  }
}

// מחזיר את המשתמש המחובר, או null
async function getCurrentUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session ? session.user : null;
}

setupNav();
