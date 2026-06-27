// StasisAi Standalone Shell Logic

document.addEventListener("DOMContentLoaded", () => {
    initTabRouting();
    initSimulatedMetrics();
    initKBFilters();
});

// Sidebar Navigation Router
function initTabRouting() {
    const navItems = document.querySelectorAll(".nav-item");
    const tabs = document.querySelectorAll(".tab-view");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const tabId = item.getAttribute("data-tab");
            
            navItems.forEach(i => i.classList.remove("active"));
            tabs.forEach(t => t.classList.remove("active"));

            item.classList.add("active");
            document.getElementById(tabId).classList.add("active");
        });
    });
}

// Simulated real-time dashboard state oscillations
function initSimulatedMetrics() {
    const respTimeEl = document.getElementById("respTime");
    const systemLoadEl = document.getElementById("systemLoad");

    if (respTimeEl && systemLoadEl) {
        setInterval(() => {
            // Latency oscillates between 0.08s and 0.15s
            const lat = (0.08 + Math.random() * 0.07).toFixed(2);
            respTimeEl.textContent = lat + "s";

            // Load oscillates around 20-30%
            const load = (20 + Math.random() * 12).toFixed(1);
            systemLoadEl.textContent = load + "%";
        }, 4000);
    }
}

// Knowledge Base search and filter controls
function initKBFilters() {
    const searchInput = document.getElementById("topSearch");
    const kbTabs = document.querySelectorAll(".kb-tab-btn");
    const kbCards = document.querySelectorAll(".kb-card");

    // Category button filter
    kbTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            kbTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const cat = tab.getAttribute("data-cat");
            
            kbCards.forEach(card => {
                const cardCat = card.getAttribute("data-category");
                if (cat === "all" || cardCat === cat) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // Global Top Bar Search
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            kbCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
}

// Instantly activate simulated system scans
function triggerQuickScan(profileName) {
    // Navigate to Diagnostics Console
    const terminalTabBtn = document.querySelector('[data-tab="diagnostics"]');
    if (terminalTabBtn) {
        terminalTabBtn.click();
    }

    const logs = document.getElementById("terminalLogs");
    if (!logs) return;

    logs.innerHTML += `<div class="term-line success-text">> INITIALIZING SCRIPT: ${profileName}...</div>`;
    
    let steps = [
        "Connecting to cloud subnet node [STASIS-NODE-NORTH]...",
        "Querying memory allocation registries...",
        "Validating network handshake packets...",
        "Analyzing security audit credentials [HMAC-SHA256]...",
        "No issues found. System state: NOMINAL"
    ];

    steps.forEach((step, idx) => {
        setTimeout(() => {
            const typeClass = idx === steps.length - 1 ? "success-text" : "term-line";
            logs.innerHTML += `<div class="${typeClass}">[SYS] ${step}</div>`;
            logs.scrollTop = logs.scrollHeight;
        }, (idx + 1) * 800);
    });
}

// Feed KB queries straight into the active AI core
function askAboutKB(prompt) {
    const chatTabBtn = document.querySelector('[data-tab="chat"]');
    if (chatTabBtn) {
        chatTabBtn.click();
    }
    
    sendSuggestion(prompt);
}

// Interactive custom shell emulator
function handleTerminalKey(event) {
    if (event.key === "Enter") {
        const input = document.getElementById("terminalInput");
        const logs = document.getElementById("terminalLogs");
        if (!input || !logs) return;

        const cmd = input.value.trim();
        if (!cmd) return;

        // Echo command
        logs.innerHTML += `<div class="term-line input-echo">$ ${cmd}</div>`;
        input.value = "";

        // Standard commands
        const lowerCmd = cmd.toLowerCase();
        if (lowerCmd === "clear") {
            logs.innerHTML = "";
        } else if (lowerCmd === "check-cores") {
            logs.innerHTML += `<div class="term-line">System cores check:
- Core 0: OPERATIONAL (35C)
- Core 1: OPERATIONAL (37C)
- Core 2: OPERATIONAL (34C)
- Core 3: OPERATIONAL (36C)</div>`;
        } else if (lowerCmd === "audit-security") {
            logs.innerHTML += `<div class="term-line success-text">Audit results: 0 risks detected. Ports verified. Firewalls ACTIVE.</div>`;
        } else if (lowerCmd === "help") {
            logs.innerHTML += `<div class="term-line">Available commands: check-cores, audit-security, clear, help</div>`;
        } else {
            logs.innerHTML += `<div class="term-line error-text">Command not found: '${cmd}'. Type 'help' for shell references.</div>`;
        }

        logs.scrollTop = logs.scrollHeight;
    }
}
