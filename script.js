// =========================================================
// ⚙️ HONDA Y-E-S AWARD MYANMAR — CORE SCRIPT
// =========================================================

// 🚀 1. MARKDOWN FETCH, RENDER & STICKY TOC
async function viewMarkdown(filename, title) {
    const titleEl = document.getElementById('mdModalTitle');
    const bodyEl = document.getElementById('mdModalBody');
    const modalEl = document.getElementById('markdownModal');
    if (!titleEl || !bodyEl || !modalEl) return;

    titleEl.innerHTML = `<i class="bi bi-file-earmark-text me-2"></i>${title}`;
    bodyEl.innerHTML = `
        <div class="text-center my-5 py-5">
            <div class="spinner-border text-danger" style="width: 2.5rem; height: 2.5rem;" role="status"></div>
            <p class="mt-3 text-muted fw-bold">စာတမ်းအချက်အလက်များကို ခေါ်ယူပြင်ဆင်နေပါသည်...</p>
        </div>`;

    const mdModal = new bootstrap.Modal(modalEl);
    mdModal.show();

    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error("ဖိုင်ရှာမတွေ့ပါ သို့မဟုတ် လမ်းကြောင်းမှားယွင်းနေပါသည်။");

        const text = await response.text();
        bodyEl.innerHTML = marked.parse(text);

        const headings = bodyEl.querySelectorAll('h1, h2, h3');
        if (headings.length > 0) {
            let tocHTML = `
                <div class="toc-container mb-4 p-3 rounded-3" style="background: rgba(17, 24, 39, 0.05); border: 1px solid var(--border-color);">
                    <details>
                        <summary class="fw-bold" style="cursor: pointer; color: var(--dark-carbon); list-style: none;">
                            <i class="bi bi-list-nested me-2 text-danger"></i>မာတိကာ (Table of Contents)
                            <i class="bi bi-chevron-down ms-2" style="font-size: 0.78rem;"></i>
                        </summary>
                        <ul class="mt-3 mb-0" style="list-style: none; padding-left: 10px; border-left: 2px solid var(--accent-red);">`;

            headings.forEach((h, index) => {
                const id = `heading-${index}`;
                h.id = id;
                const indent = (h.tagName === 'H3' || h.tagName === 'H4') ? 'ms-4' : 'ms-2';
                const fontSize = (h.tagName === 'H3' || h.tagName === 'H4') ? '0.8rem' : '0.88rem';
                const fontWeight = h.tagName === 'H2' ? 'fw-bold' : '';

                tocHTML += `<li class="mb-2 ${indent}"><a href="#${id}" class="text-decoration-none toc-link ${fontWeight}" style="color: var(--text-color); font-size: ${fontSize};">${h.innerText}</a></li>`;
            });

            tocHTML += `</ul></details></div>`;
            bodyEl.insertAdjacentHTML('afterbegin', tocHTML);
        }
    } catch (error) {
        bodyEl.innerHTML = `
            <div class="alert alert-danger p-4 rounded-3">
                <h6 class="fw-bold"><i class="bi bi-exclamation-triangle-fill me-2"></i>စာတမ်း ဖွင့်ရှု၍ မရပါ</h6>
                <p class="mb-2"><strong>Error:</strong> ${error.message}</p>
                <hr>
                <p class="small mb-0">
                    <strong>💡 သတိပြုရန် (For Local Testing):</strong> ကွန်ပျူတာပေါ်တွင် <code>file:///...</code> ဖြင့် တိုက်ရိုက်ဖွင့်ထားပါက Browser ၏ CORS Policy ကြောင့် ဖိုင်ဖတ်ခွင့် ပိတ်ထားတတ်ပါသည်။<br><br>
                    - <strong>VS Code Live Server</strong> ဖြင့် ဖွင့်ကြည့်ပါ၊ သို့မဟုတ်<br>
                    - <strong>GitHub Pages</strong> ပေါ်တင်လိုက်ပါက 100% ပုံမှန် အလုပ်လုပ်ပါမည်။
                </p>
            </div>`;
    }
}

// 📊 2. SELECTION FUNNEL CHART (2021 DIRECT-TO-MAJA REFERENCE)
document.addEventListener("DOMContentLoaded", function () {
    initTheme();

    const funnelCanvas = document.getElementById('hondaFunnelChart');
    if (funnelCanvas && typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Noto Sans Myanmar', sans-serif";
        Chart.defaults.color = "#64748b";
        Chart.defaults.font.size = 10.5;

        const funnelCounts = [183, 40, 15, 10, 4];
        const totalApplied = 183;

        new Chart(funnelCanvas, {
            type: 'bar',
            data: {
                labels: ['Applied', 'MM Essay', 'EN Judges', 'Finalists', 'Awardees'],
                datasets: [{
                    label: 'Candidates',
                    data: funnelCounts,
                    backgroundColor: ['#cbd5e1', '#94a3b8', '#475569', '#1f2937', '#dc2626'],
                    borderRadius: 6,
                    barThickness: 26
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const val = ctx.raw;
                                const pct = ((val / totalApplied) * 100).toFixed(1);
                                return ` ${val} ဦး (${pct}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(148, 163, 184, 0.14)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
});

// 🌙 3. DARK / LIGHT MODE TOGGLE (SYNCED WITH MEXT PORTAL & GISCUS)
// Uses 'mext_theme' key so Dark/Light preference carries over seamlessly on robinglory.github.io
function initTheme() {
    const savedTheme = localStorage.getItem('mext_theme');
    const icon = document.getElementById('themeIcon');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (icon) icon.className = 'bi bi-sun-fill';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('themeIcon');
    const isDark = document.body.classList.contains('dark-mode');

    if (isDark) {
        if (icon) icon.className = 'bi bi-sun-fill';
        localStorage.setItem('mext_theme', 'dark');
    } else {
        if (icon) icon.className = 'bi bi-moon-stars-fill';
        localStorage.setItem('mext_theme', 'light');
    }

    // Sync Giscus Community Forum theme
    const giscusTheme = isDark ? 'transparent_dark' : 'light';
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
        iframe.contentWindow.postMessage(
            { giscus: { setConfig: { theme: giscusTheme } } },
            'https://giscus.app'
        );
    }
}

// 📲 4. COPY PORTAL LINK TO CLIPBOARD
function copyPortalLink() {
    const portalUrl = "https://robinglory.github.io/myanmar-honda-yes-award-roadmap/";
    navigator.clipboard.writeText(portalUrl).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const copyText = document.getElementById('copyText');
        if (!copyBtn || !copyText) return;

        copyBtn.style.backgroundColor = "#10b981";
        copyBtn.style.color = "#ffffff";
        copyText.innerHTML = "Copied! ✔";

        setTimeout(() => {
            copyBtn.style.backgroundColor = "";
            copyBtn.style.color = "";
            copyText.innerHTML = "Copy Link";
        }, 2500);
    });
}

// 📈 5. SCROLL PROGRESS BAR
window.addEventListener("scroll", updateProgressBar);

function updateProgressBar() {
    const bar = document.getElementById("myBar");
    if (!bar) return;

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    bar.style.width = scrolled + "%";
}

// ⏱️ 6. DYNAMIC READ TIME CALCULATOR
function calculateReadTime(text) {
    let cleanText = text.replace(/!\[.*?\]\(.*?\)/g, '');
    cleanText = cleanText.replace(/\[.*?\]\(.*?\)/g, '');
    cleanText = cleanText.replace(/[#*`>_~-]/g, '');
    cleanText = cleanText.replace(/\s+/g, '');

    const readTime = Math.ceil(cleanText.length / 400);
    return readTime < 1 ? 1 : readTime;
}

async function fetchAndInjectReadTime(filename, elementId) {
    try {
        const response = await fetch(filename);
        if (!response.ok) return;
        const text = await response.text();

        const time = calculateReadTime(text);
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            targetElement.innerHTML = `<i class="bi bi-clock-history me-1"></i> ${time} min read`;
        }
    } catch (error) {
        console.error("Read time calculation failed for:", filename);
    }
}