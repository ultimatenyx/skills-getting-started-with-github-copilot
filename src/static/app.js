document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Build participants list HTML
        const participantsList = details.participants.length > 0
          ? `<ul style="
                margin: 0.5em 0 0 0; 
                padding: 0;
                list-style: none;
                display: flex;
                flex-wrap: wrap;
                gap: 0.5em;
              ">
              ${details.participants.map(
                p => {
                  // Use initials for avatar
                  const initials = p.split('@')[0].split(/[ ._-]/).map(s => s[0]?.toUpperCase() || '').join('').slice(0,2);
                  return `
                    <li style="
                      display: flex;
                      align-items: center;
                      background: #e0e7ff;
                      border-radius: 20px;
                      padding: 0.25em 0.75em 0.25em 0.25em;
                      box-shadow: 0 1px 2px rgba(30,64,175,0.07);
                      font-size: 0.97em;
                    ">
                      <span style="
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 2em;
                        height: 2em;
                        background: #6366f1;
                        color: #fff;
                        border-radius: 50%;
                        font-weight: bold;
                        margin-right: 0.5em;
                        font-size: 1em;
                        box-shadow: 0 1px 2px rgba(99,102,241,0.10);
                      ">${initials}</span>
                      <span style="color: #3730a3;">${p}</span>
                    </li>
                  `;
                }
              ).join("")}
            </ul>`
          : `<ul style="margin: 0.5em 0 0 0; padding: 0 0 0 1.2em; color: #64748b;">
              <li style="font-style: italic;">No participants yet</li>
            </ul>`;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div style="
            margin-top: 1em;
            padding: 0.75em;
            background: #f8fafc;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          ">
            <h5 style="margin: 0 0 0.5em 0; color: #2563eb; font-weight: 600;">
              Participants
            </h5>
            ${participantsList}
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
