// ============================================================
// DATA: Global Insurance Companies Pool
// ============================================================
const companies = [
    {
        id: 'safetywing',
        name: 'SafetyWing',
        titleClass: 'company-title-safetywing',
        ribbon: 'Nomad Favorite',
        ribbonClass: 'popular',
        affiliateUrl: 'https://safetywing.com/?referenceID=26500665&utm_source=26500665&utm_medium=Ambassador',
        description: 'Flexible monthly subscription that covers you in 190 countries. The #1 choice for long-term digital nomads. ~$45/month.',
        modalName: 'SafetyWing',
        scores: {
            'long':            4,
            'short':          -1,
            'expensive-gear':  0,
            'basic-gear':      2,
            'extreme':        -2,
            'chill':           2
        }
    },
    {
        id: 'worldnomads',
        name: 'World Nomads',
        titleClass: 'company-title-worldnomads',
        ribbon: 'Best for Adventure',
        ribbonClass: 'extreme-sport',
        affiliateUrl: 'https://www.worldnomads.com',
        description: 'Covers over 200 adventure sports including scuba diving, motorbiking, and trekking. High coverage for expensive tech gear.',
        modalName: 'World Nomads',
        scores: {
            'long':            1,
            'short':           1,
            'expensive-gear':  3,
            'basic-gear':      0,
            'extreme':         5,
            'chill':          -2
        }
    },
    {
        id: 'heymondo',
        name: 'Heymondo',
        titleClass: 'company-title-clal', // Reusing color classes
        ribbon: 'Best Tech & App',
        ribbonClass: 'comprehensive',
        affiliateUrl: 'https://heymondo.com',
        description: 'Excellent global medical coverage with a 24/7 doctor chat app and zero out-of-pocket expenses for medical emergencies.',
        modalName: 'Heymondo',
        scores: {
            'long':            2,
            'short':           3,
            'expensive-gear':  1,
            'basic-gear':      1,
            'extreme':         1,
            'chill':           2
        }
    },
    {
        id: 'faye',
        name: 'Faye',
        titleClass: 'company-title-phoenix',
        ribbon: 'US Residents Top Pick',
        ribbonClass: 'value',
        affiliateUrl: 'https://withfaye.com',
        description: '100% digital, App-first travel insurance with instant claims payouts via Faye Wallet. Excellent coverage for flight delays and baggage.',
        modalName: 'Faye',
        scores: {
            'long':           -1,
            'short':           4,
            'expensive-gear':  2,
            'basic-gear':      1,
            'extreme':        -1,
            'chill':           2
        }
    },
    {
        id: 'genki',
        name: 'Genki',
        titleClass: 'company-title-passport',
        ribbon: 'Long-Term Health',
        ribbonClass: 'local',
        affiliateUrl: 'https://genki.world',
        description: 'True health insurance (not just travel) for expats and digital nomads. Covers routine checkups and unlimited medical limits.',
        modalName: 'Genki',
        scores: {
            'long':            5,
            'short':          -2,
            'expensive-gear':  0,
            'basic-gear':      0,
            'extreme':         1,
            'chill':           0
        }
    },
    {
        id: 'img',
        name: 'IMG Global',
        titleClass: 'company-title-harel',
        ribbon: 'Traditional & Secure',
        ribbonClass: 'cheap',
        affiliateUrl: 'https://www.imglobal.com',
        description: 'Highly established global provider offering robust medical plans specifically tailored for long-term expatriates worldwide.',
        modalName: 'IMG Global',
        scores: {
            'long':            2,
            'short':           1,
            'expensive-gear':  0,
            'basic-gear':      1,
            'extreme':         0,
            'chill':           1
        }
    }
];

// ============================================================
// QUIZ FLOW
// ============================================================
const questions = [
    {
        type: "options",
        question: "Roughly how long will you be abroad?",
        options: [
            { text: "Over 6 months (Ongoing, Backpacking, etc.)", val: "long" },
            { text: "Under 3 months (Short trips, Vacations)", val: "short" }
        ]
    },
    {
        type: "options",
        question: "Got it. Let's talk about your gear:",
        options: [
            { text: "I carry expensive tech (Laptop, Camera, Drone)", val: "expensive-gear" },
            { text: "Traveling light, just me and my smartphone", val: "basic-gear" }
        ]
    },
    {
        type: "options",
        question: "Are you planning any extreme sports?",
        options: [
            { text: "Yes! Scuba, Surfing, Trekking, Motorbikes...", val: "extreme" },
            { text: "No, just standard sightseeing & chilling", val: "chill" }
        ]
    },
    {
        type: "text",
        question: "Last question! Anything else we should know? (Pre-existing medical conditions, specific destinations, etc.)"
    }
];

let currentQuestion = 0;
let answersData = {};
let currentAffiliateUrl = '#';

// ============================================================
// MEDICAL KEYWORD DETECTION
// ============================================================
const medicalKeywords = [
    'medical', 'allergy', 'diabetes', 'asthma', 'heart', 'medication', 
    'chronic', 'surgery', 'disease', 'condition', 'hospital', 'doctor', 
    'prescription', 'cancer', 'blood pressure'
];

function detectMedicalContext(freeText) {
    if (!freeText || freeText.toLowerCase() === 'no' || freeText.toLowerCase() === 'nothing') return false;
    const lower = freeText.toLowerCase();
    
    const hasKeyword = medicalKeywords.some(kw => lower.includes(kw));
    
    if (hasKeyword) {
        // Ignore negations
        const negations = ['no', 'none', 'without', 'healthy', 'don\'t have', 'dont have'];
        const looksLikeNegation = negations.some(neg => lower.includes(neg));
        if (looksLikeNegation) {
            return false;
        }
        return true;
    }
    return false;
}

// ============================================================
// SCORING ENGINE
// ============================================================
function calculateTopThree() {
    const freeText = answersData[`q${questions.length - 1}`] || '';
    const hasMedical = detectMedicalContext(freeText);

    const medicalAdjustments = {
        'heymondo': +3,  // Great medical app
        'genki': +4,     // Actual health insurance
        'img': +2,
        'safetywing': -2, // Travel medical only (limited pre-existing)
        'faye': 0,
        'worldnomads': 0
    };

    const scored = companies.map(company => {
        let score = 0;
        Object.values(answersData).forEach(val => {
            if (company.scores[val] !== undefined) {
                score += company.scores[val];
            }
        });
        
        // Apply medical adjustments
        if (hasMedical && medicalAdjustments[company.id] !== undefined) {
            score += medicalAdjustments[company.id];
        }
        return { ...company, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return { topThree: scored.slice(0, 3), hasMedical };
}

// ============================================================
// EVENT LISTENERS & UI LOGIC
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const goBackBtn = document.getElementById('goBackBtn');
    const restartBtn = document.getElementById('restartBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const affiliateCtaBtn = document.getElementById('affiliateCtaBtn');

    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (goBackBtn) goBackBtn.addEventListener('click', goBack);
    if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeLeadModal);
    
    // Close modal on outside click
    const leadModal = document.getElementById('leadModal');
    if (leadModal) {
        leadModal.addEventListener('click', function(e) {
            if (e.target === this) closeLeadModal();
        });
    }

    if (affiliateCtaBtn) {
        affiliateCtaBtn.addEventListener('click', () => {
            // User clicked outbound affiliate link
            closeLeadModal();
        });
    }
});

function startQuiz() {
    switchScreen('welcome-screen', 'chat-screen');
    askQuestion();
    updateProgress();
}

function updateProgress() {
    const totalSteps = questions.length + 1;
    const step = currentQuestion + 1;
    const percentage = (step / totalSteps) * 100;
    const pb = document.getElementById('progressBar');
    if (pb) pb.style.width = percentage + "%";
}

function askQuestion() {
    if (currentQuestion >= questions.length) {
        finishQuiz();
        return;
    }

    // Handle Back Button Visibility
    const goBackBtn = document.getElementById('goBackBtn');
    if (goBackBtn) {
        if (currentQuestion > 0) goBackBtn.style.display = 'flex';
        else goBackBtn.style.display = 'none';
    }

    const qData = questions[currentQuestion];
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = "";

    // Show Typing Indicator
    showTypingIndicator();
    scrollToBottom();

    setTimeout(() => {
        hideTypingIndicator();
        appendMessage('bot', qData.question);
        renderOptions(qData, currentQuestion);
    }, 450);
}

function goBack() {
    if (currentQuestion === 0) return;
    
    currentQuestion--;
    delete answersData[`q${currentQuestion}`];
    
    rebuildChatHistory();
    updateProgress();
    askQuestion();
}

function rebuildChatHistory() {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML = '';
    
    for (let i = 0; i < currentQuestion; i++) {
        appendMessage('bot', questions[i].question);
        
        if (answersData[`q${i}`]) {
            let userText = answersData[`q${i}`];
            if (questions[i].type === 'options') {
                const opt = questions[i].options.find(o => o.val === userText);
                if (opt) userText = opt.text;
            }
            appendMessage('user', userText);
        }
    }
}

function showTypingIndicator() {
    const chatbox = document.getElementById('chatbox');
    let typingInd = document.getElementById('typingIndicator');
    if (!typingInd) {
        typingInd = document.createElement('div');
        typingInd.id = 'typingIndicator';
        typingInd.className = 'typing-indicator hidden';
        typingInd.innerHTML = '<span></span><span></span><span></span>';
        chatbox.appendChild(typingInd);
    }
    typingInd.classList.remove('hidden');
    chatbox.appendChild(typingInd); // ensure it's at the bottom
}

function hideTypingIndicator() {
    const typingInd = document.getElementById('typingIndicator');
    if (typingInd) typingInd.classList.add('hidden');
}

function appendMessage(sender, text) {
    const chatbox = document.getElementById('chatbox');
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerText = text;
    chatbox.appendChild(bubble);

    const typingInd = document.getElementById('typingIndicator');
    if (typingInd) chatbox.appendChild(typingInd);

    scrollToBottom();
}

function renderOptions(qData, qIndex) {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = "";

    if (qData.type === "options") {
        const grid = document.createElement('div');
        grid.className = 'chat-options-grid';
        
        qData.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt.text;
            btn.onclick = () => {
                container.innerHTML = "";
                appendMessage('user', opt.text);
                answersData[`q${qIndex}`] = opt.val;
                currentQuestion++;
                updateProgress();
                askQuestion();
            };
            grid.appendChild(btn);
        });
        container.appendChild(grid);

    } else if (qData.type === "text") {
        container.innerHTML = `
            <div class="chat-input-wrapper" style="width:100%; display:flex; gap:10px;">
                <input type="text" id="freeTextInput" class="chat-text-input" placeholder="Type here (or hit Send to skip)...">
                <button class="chat-send-btn" id="sendBtn" aria-label="Send">➤</button>
            </div>
        `;

        const submitText = () => {
            const input = document.getElementById('freeTextInput');
            const val = input.value.trim() || 'No';
            container.innerHTML = "";
            appendMessage('user', val);
            answersData[`q${qIndex}`] = val;
            currentQuestion++;
            updateProgress();
            askQuestion();
        };

        const sendBtn = document.getElementById('sendBtn');
        const textInput = document.getElementById('freeTextInput');
        
        if (sendBtn) sendBtn.onclick = submitText;
        if (textInput) {
            textInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') submitText();
            });
            setTimeout(() => textInput.focus(), 100);
        }
    }
}

function scrollToBottom() {
    // For mobile/desktop overflow matching
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function finishQuiz() {
    switchScreen('chat-screen', 'loading-screen');

    setTimeout(() => {
        const { topThree, hasMedical } = calculateTopThree();
        renderResults(topThree, hasMedical);

        switchScreen('loading-screen', 'results-screen');
        const pb = document.getElementById('progressBar');
        if (pb) pb.style.width = "100%";
    }, 2500);
}

// ============================================================
// RESULT RENDERING
// ============================================================
function renderResults(topThree, hasMedical) {
    const list = document.getElementById('recommendation-list');
    if (!list) return;
    list.innerHTML = '';

    // Advanced Medical logic UI warning
    if (hasMedical) {
        const banner = document.createElement('div');
        banner.style.cssText = `
            background: #fffbeb;
            border: 1px solid #f59e0b;
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 13.5px;
            color: #92400e;
            line-height: 1.5;
            text-align: left;
        `;
        banner.innerHTML = `
            <strong>⚠️ Medical Note:</strong> You mentioned a health condition. We heavily weighted providers with great medical & pre-existing coverage, but please verify terms before purchasing.
        `;
        list.appendChild(banner);
    }

    const grid = document.createElement('div');
    grid.className = 'plans-grid';

    topThree.forEach((company, index) => {
        const isFeatured = index === 0;
        const card = document.createElement('div');
        card.className = `plan-card clickable${isFeatured ? ' featured' : ''}`;
        card.setAttribute('data-company-id', company.id);
        
        // Open the modal passing the company data
        card.onclick = () => openLeadModal(company.modalName, company.affiliateUrl);

        card.innerHTML = `
            <span class="plan-ribbon ${company.ribbonClass}">${company.ribbon}</span>
            <h3 class="${company.titleClass}">${company.name}</h3>
            <p>${company.description}</p>
        `;
        grid.appendChild(card);
    });
    
    list.appendChild(grid);
}

// ============================================================
// UTILS & MODAL
// ============================================================
function switchScreen(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);
    if(hideEl) hideEl.classList.remove('active');
    if(showEl) showEl.classList.add('active');
}

function openLeadModal(companyName, affiliateUrl) {
    document.getElementById('companyNameSpan').innerText = companyName;
    document.getElementById('ctaCompanyName').innerText = companyName;
    
    const ctaBtn = document.getElementById('affiliateCtaBtn');
    if(ctaBtn) ctaBtn.href = affiliateUrl;
    
    document.getElementById('leadModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLeadModal() {
    document.getElementById('leadModal').style.display = 'none';
    document.body.style.overflow = '';
}

function restartQuiz() {
    currentQuestion = 0;
    answersData = {};
    currentAffiliateUrl = '#';

    document.getElementById('chatbox').innerHTML = '';
    document.getElementById('optionsContainer').innerHTML = '';

    const pb = document.getElementById('progressBar');
    if (pb) pb.style.width = '0%';

    ['chat-screen', 'loading-screen', 'results-screen'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('active');
    });
    
    const welcome = document.getElementById('welcome-screen');
    if(welcome) welcome.classList.add('active');
}
