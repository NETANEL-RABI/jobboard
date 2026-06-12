let allJobs = [];

async function loadJobs() {
  const { data, error } = await supabaseClient
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  const list = document.getElementById("jobs-list");

  if (error) {
    list.innerHTML = `<p class="empty">שגיאה בטעינת המשרות: ${error.message}</p>`;
    return;
  }

  allJobs = data;
  renderJobs(allJobs);
}

function renderJobs(jobs) {
  const list = document.getElementById("jobs-list");

  if (!jobs || jobs.length === 0) {
    list.innerHTML = `<p class="empty">אין משרות פתוחות כרגע.</p>`;
    return;
  }

  getCurrentUser().then(user => {
    list.innerHTML = jobs.map(job => {
      const date = new Date(job.created_at).toLocaleDateString("he-IL");
      const isOwner = user && user.id === job.user_id;

      return `
        <div class="job-card">
          <h3>${escapeHtml(job.title)}</h3>
          <div class="job-meta">
            ${job.location ? `📍 ${escapeHtml(job.location)} | ` : ""}
            פורסם ע"י ${escapeHtml(job.posted_by || "")} | ${date}
          </div>
          <div class="job-desc">${escapeHtml(job.description)}</div>
          ${isOwner ? `
            <div class="job-actions">
              <button class="btn btn-danger" onclick="deleteJob('${job.id}')">מחיקה</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");
  });
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function deleteJob(id) {
  if (!confirm("למחוק את המשרה?")) return;
  const { error } = await supabaseClient.from("jobs").delete().eq("id", id);
  if (error) {
    alert("שגיאה במחיקה: " + error.message);
    return;
  }
  loadJobs();
}

document.getElementById("search-input").addEventListener("input", (e) => {
  const term = e.target.value.trim().toLowerCase();
  const filtered = allJobs.filter(job =>
    job.title.toLowerCase().includes(term) ||
    (job.location || "").toLowerCase().includes(term) ||
    (job.description || "").toLowerCase().includes(term)
  );
  renderJobs(filtered);
});

loadJobs();
