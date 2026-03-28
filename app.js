// ============================================================
// DATA: Insurance Companies Pool (6 companies)
// Each company has scores for every possible answer value.
// ============================================================
const companies = [
    {
        id: 'safetywing',
        name: 'SafetyWing',
        titleClass: 'company-title-safetywing',
        ribbon: 'הפופולרית אצל נוודים',
        ribbonClass: 'popular',
        affiliateUrl: 'https://safetywing.com/?referenceID=26500665&utm_source=26500665&utm_medium=Ambassador',
        description: 'מנוי חודשי גמיש שמפסיק ביום החזרה. המודל האהוב על נוודים ארוכי טווח בכל העולם — ~42$ לחודש.',
        modalName: 'SafetyWing',
        scores: {
            'long':            3,
            'short':          -1,
            'expensive-gear':  0,
            'basic-gear':      2,
            'extreme':        -1,
            'chill':           1
        }
    },
    {
        id: 'passportcard',
        name: 'PassportCard',
        titleClass: 'company-title-passport',
        ribbon: 'הכי מקיפה בשטח',
        ribbonClass: 'comprehensive',
        affiliateUrl: 'https://ticket.passportcard.co.il',
        description: 'משלמת ישירות לבית החולים — ללא השתתפות עצמית ובלי בירוקרטיה. שקט נפשי מוחלט לטיולים ארוכים.',
        modalName: 'PassportCard',
        scores: {
            'long':            2,
            'short':           0,
            'expensive-gear':  3,
            'basic-gear':      0,
            'extreme':         2,
            'chill':           0
        }
    },
    {
        id: 'worldnomads',
        name: 'World Nomads',
        titleClass: 'company-title-worldnomads',
        ribbon: 'הטובה ביותר לספורט אתגרי',
        ribbonClass: 'extreme-sport',
        affiliateUrl: 'https://www.worldnomads.com',
        description: 'מכסה מעל 200 פעילויות ספורט כולל צלילה, רכיבת אופנוע וטרקים. הבחירה היחידה האמיתית לאדרנלין ג\'אנקים.',
        modalName: 'World Nomads',
        scores: {
            'long':            1,
            'short':           1,
            'expensive-gear':  2,
            'basic-gear':      0,
            'extreme':         5,
            'chill':          -2
        }
    },
    {
        id: 'phoenix',
        name: 'הפניקס Smart',
        titleClass: 'company-title-phoenix',
        ribbon: 'הכי משתלמת בכיס',
        ribbonClass: 'cheap',
        affiliateUrl: 'https://fnx.co.il',
        description: 'תמחור הוגן לטיולים קצרים, בעיקר לאירופה. כיסוי ביטולי טיסות ופציעות קלות — בלי לשלם על עודפים.',
        modalName: 'הפניקס Smart',
        scores: {
            'long':           -1,
            'short':           3,
            'expensive-gear':  0,
            'basic-gear':      1,
            'extreme':        -1,
            'chill':           2
        }
    },
    {
        id: 'clal',
        name: 'כלל ביטוח',
        titleClass: 'company-title-clal',
        ribbon: 'ערך גבוה למטייל',
        ribbonClass: 'value',
        affiliateUrl: 'https://www.clal-ins.co.il',
        description: 'ביטוח ישראלי עם סכומי כיסוי גבוהים ותמחור תחרותי. מצוין לטיולים קצרים עד בינוניים, בעיקר לאירופה.',
        modalName: 'כלל ביטוח',
        scores: {
            'long':            0,
            'short':           2,
            'expensive-gear':  0,
            'basic-gear':      1,
            'extreme':         0,
            'chill':           1
        }
    },
    {
        id: 'harel',
        name: 'הראל ביטוח',
        titleClass: 'company-title-harel',
        ribbon: 'שירות ישראלי 24/7',
        ribbonClass: 'local',
        affiliateUrl: 'https://www.harel-group.co.il',
        description: 'ביטוח חברה ישראלית מוכרת עם כיסוי ציוד, רכוש ובריאות. תמיכה בעברית בכל שעה — מושלם אם חשוב לך השירות.',
        modalName: 'הראל ביטוח',
        scores: {
            'long':            0,
            'short':           1,
            'expensive-gear':  1,
            'basic-gear':      0,
            'extreme':         1,
            'chill':           0
        }
    }
];

// ============================================================
// QUIZ FLOW
// ============================================================
const questions = [
    {
        type: "options",
        question: "כמה זמן בערך תנדוד בחו\"ל?",
        options: [
            { text: "מעל חצי שנה (דרום אמריקה, המזרח, כו')", val: "long" },
            { text: "עד שלושה חודשים (אירופה / קצר)", val: "short" }
        ]
    },
    {
        type: "options",
        question: "הבנתי. ובוא נדבר על הציוד שלך:",
        options: [
            { text: "לקחתי ציוד יקר — לפטופ, מצלמה, רחפן", val: "expensive-gear" },
            { text: "זורם קליל, רק אני והסמארטפון", val: "basic-gear" }
        ]
    },
    {
        type: "options",
        question: "האם מתוכנן ספורט אתגרי בטיול?",
        options: [
            { text: "כן! צלילה, רכיבה, טרקים, גלישה...", val: "extreme" },
            { text: "לא, טיול רגיל ורגוע בלי סיכונים", val: "chill" }
        ]
    },
    {
        type: "text",
        question: "שאלה אחרונה! יש פרט נוסף שחשוב שנדע לפני שנמליץ? (מצב רפואי, יעד ספציפי, תקציב)"
    }
];

let currentQuestion = 0;
let answersData = {};
let currentAffiliateUrl = '#';

// ============================================================
// MEDICAL KEYWORD DETECTION
// ============================================================
const medicalKeywords = [
    // General medical
    'רפואי', 'מחלה', 'מחלת', 'תרופה', 'תרופות', 'אשפוז', 'אשפוזיזאציה', 'ניתוח',
    'כרוני', 'כרונית', 'מצב רפואי',
    // Conditions
    'סכרת', 'לב', 'לבבי', 'אסתמה', 'אסתמא', 'אלרג', 'אלרגי', 'אלרגיה',
    'לחץ דם', 'כולסטרול', 'סרטן', 'אפילפסיה', 'צליאה',
    'דיכאון', 'דיכאוני', 'כבד', 'כליית',
    // English keywords (some users type in English)
    'medical', 'allergy', 'diabetes', 'asthma', 'heart', 'medication', 'chronic', 'surgery'
];

function detectMedicalContext(freeText) {
    if (!freeText || freeText === 'אין מה להוסיף') return false;
    const lower = freeText.toLowerCase();
    
    // Check if any medical keyword exists
    const hasKeyword = medicalKeywords.some(kw => lower.includes(kw.toLowerCase()));
    
    if (hasKeyword) {
        // Ignore if user explicitly negates
        const negations = ['אין', 'לא', 'ללא', 'בלי', 'בריא', 'תקין'];
        const looksLikeNegation = negations.some(neg => lower.includes(neg));
        if (looksLikeNegation) {
            return false; // Assumed false positive ("אין לי בעיות לב")
        }
        return true;
    }
    return false;
}

// ============================================================
// SCORING ENGINE
// ============================================================
function calculateTopThree() {
    const freeText = answersData['q3'] || '';
    const hasMedical = detectMedicalContext(freeText);

    const medicalAdjustments = {
        // PassportCard: pays directly, can include pre-existing with right plan
        'passportcard': +2,
        // World Nomads: has pre-existing condition options
        'worldnomads': +1,
        // SafetyWing: explicitly excludes pre-existing conditions by default
        'safetywing': -3,
        // הפניקס: standard policy excludes pre-existing
        'phoenix': -1,
    };

    const scored = companies.map(company => {
        let score = 0;
        Object.values(answersData).forEach(val => {
            if (company.scores[val] !== undefined) {
                score += company.scores[val];
            }
        });
        // Apply medical adjustment if user mentioned a medical condition
        if (hasMedical && medicalAdjustments[company.id] !== undefined) {
            score += medicalAdjustments[company.id];
        }
        return { ...company, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);
    return { topThree: scored.slice(0, 3), hasMedical };
}

// ============================================================
// QUIZ LOGIC
// ============================================================
function startQuiz() {
    switchScreen('welcomeScreen', 'chatContainer');
    document.getElementById('subtitle').innerText = 'שאלון התאמה';
    askQuestion();
    updateProgress();
}

function updateProgress() {
    const totalSteps = questions.length + 1;
    const step = currentQuestion + 1;
    const percentage = (step / totalSteps) * 100;
    document.getElementById('progressBar').style.width = percentage + "%";
}

function askQuestion() {
    if (currentQuestion >= questions.length) {
        finishQuiz();
        return;
    }

    // Toggle back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        if (currentQuestion > 0) {
            backBtn.classList.remove('hidden');
        } else {
            backBtn.classList.add('hidden');
        }
    }

    const qData = questions[currentQuestion];
    document.getElementById('chatOptionsGrid').innerHTML = "";

    const typingInd = document.getElementById('typingIndicator');
    typingInd.classList.remove('hidden');
    scrollToBottom();

    setTimeout(() => {
        typingInd.classList.add('hidden');
        appendMessage('bot', qData.question);
        renderOptions(qData, currentQuestion);
    }, 420);
}

// ============================================================
// GO BACK LOGIC
// ============================================================
function goBack() {
    if (currentQuestion === 0) return;
    
    currentQuestion--;
    delete answersData[`q${currentQuestion}`];
    
    rebuildChatHistory();
    updateProgress();
    askQuestion();
}

function rebuildChatHistory() {
    const history = document.getElementById('chatHistory');
    history.innerHTML = '';
    
    for (let i = 0; i < currentQuestion; i++) {
        // Append bot question
        const botBubble = document.createElement("div");
        botBubble.className = "chat-bubble bot";
        botBubble.innerText = questions[i].question;
        history.appendChild(botBubble);
        
        // Append user answer
        if (answersData[`q${i}`]) {
            let userText = answersData[`q${i}`];
            if (questions[i].type === 'options') {
                const opt = questions[i].options.find(o => o.val === userText);
                if (opt) userText = opt.text;
            }
            const userBubble = document.createElement("div");
            userBubble.className = "chat-bubble user";
            userBubble.innerText = userText;
            history.appendChild(userBubble);
        }
    }
    
    const typingInd = document.getElementById('typingIndicator');
    history.appendChild(typingInd);
}

function appendMessage(sender, text) {
    const history = document.getElementById('chatHistory');
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerText = text;
    history.appendChild(bubble);

    // Keep typing indicator at the bottom of the history
    const typingInd = document.getElementById('typingIndicator');
    history.appendChild(typingInd);

    scrollToBottom();
}

function renderOptions(qData, qIndex) {
    const grid = document.getElementById('chatOptionsGrid');
    grid.innerHTML = "";

    if (qData.type === "options") {
        grid.style.flexDirection = 'column';
        qData.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt.text;
            btn.onclick = () => {
                grid.innerHTML = "";
                appendMessage('user', opt.text);
                answersData[`q${qIndex}`] = opt.val;
                currentQuestion++;
                updateProgress();
                askQuestion();
            };
            grid.appendChild(btn);
        });

    } else if (qData.type === "text") {
        grid.style.flexDirection = 'row';
        grid.innerHTML = `
            <div class="chat-input-wrapper">
                <input type="text" id="freeTextInput" class="chat-text-input" placeholder="הקלד כאן (או לחץ שלח כדי לדלג)...">
                <button class="chat-send-btn" id="sendBtn" aria-label="שלח">➤</button>
            </div>
        `;

        const submitText = () => {
            const input = document.getElementById('freeTextInput');
            const val = input.value.trim() || 'אין מה להוסיף';
            grid.innerHTML = "";
            appendMessage('user', val);
            answersData[`q${qIndex}`] = val;
            currentQuestion++;
            updateProgress();
            askQuestion();
        };

        document.getElementById('sendBtn').onclick = submitText;
        document.getElementById('freeTextInput').addEventListener('keypress', e => {
            if (e.key === 'Enter') submitText();
        });

        setTimeout(() => {
            const input = document.getElementById('freeTextInput');
            if (input) input.focus();
        }, 100);
    }
}

function scrollToBottom() {
    const chatWrapper = document.getElementById('chatHistory');
    chatWrapper.scrollTop = chatWrapper.scrollHeight;
}

function finishQuiz() {
    switchScreen('chatContainer', 'loadingScreen');
    document.getElementById('subtitle').innerText = 'מצליב נתונים...';

    setTimeout(() => {
        const { topThree, hasMedical } = calculateTopThree();
        renderResults(topThree, hasMedical);

        switchScreen('loadingScreen', 'resultScreen');
        document.getElementById('progressBar').style.width = "100%";
        document.getElementById('subtitle').innerText = 'הנה 3 התוצאות שלך';

        const h1 = document.querySelector('.card-header h1');
        if (h1) h1.style.display = 'none';
    }, 2500);
}

// ============================================================
// RESULT RENDERING (Dynamic!)
// ============================================================
function renderResults(topThree, hasMedical) {
    const grid = document.getElementById('plansGrid');
    grid.innerHTML = '';

    // Medical disclaimer banner
    if (hasMedical) {
        const banner = document.createElement('div');
        banner.style.cssText = `
            background: #fffbeb;
            border: 1px solid #f59e0b;
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 8px;
            font-size: 13.5px;
            color: #92400e;
            line-height: 1.5;
            text-align: right;
        `;
        banner.innerHTML = `
            <strong>⚠️ שים לב:</strong> ציינת מצב רפואי קודם. וודא שהביטוח שבחרת מכסה מצבות רפואיים קודם לנסיעה (pre-existing conditions) לפני הרכישה.
        `;
        grid.appendChild(banner);
    }

    topThree.forEach((company, index) => {
        const isFeatured = index === 0;
        const card = document.createElement('div');
        card.className = `plan-card clickable${isFeatured ? ' featured' : ''}`;
        card.setAttribute('data-company-id', company.id);
        card.onclick = () => openLeadModal(company.modalName, company.affiliateUrl);

        card.innerHTML = `
            <span class="plan-ribbon ${company.ribbonClass}">${company.ribbon}</span>
            <h3 class="${company.titleClass}">${company.name}</h3>
            <p>${company.description}</p>
        `;
        grid.appendChild(card);
    });
}

// ============================================================
// SCREEN SWITCHING
// ============================================================
function switchScreen(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);
    hideEl.classList.remove('active');
    hideEl.classList.add('hidden');
    showEl.classList.remove('hidden');
    showEl.classList.add('active');
}

// ============================================================
// MODAL LOGIC
// ============================================================
// Store original modal HTML once DOM is ready, so we can reset it after thank-you
let originalModalHTML = '';
document.addEventListener('DOMContentLoaded', () => {
    originalModalHTML = document.querySelector('.modal').innerHTML;
});
// Fallback: store synchronously too (in case script runs after DOMContentLoaded)
if (document.readyState !== 'loading') {
    originalModalHTML = document.querySelector('.modal').innerHTML;
}

function openLeadModal(companyName, affiliateUrl) {
    // Restore original modal content in case it was replaced by thank-you
    if (originalModalHTML) {
        document.querySelector('.modal').innerHTML = originalModalHTML;
        // Re-attach form submit listener after restoring HTML
        attachLeadFormListener();
    }
    document.getElementById('selectedCompany').innerText = companyName;
    // Populate hidden fields for Netlify Forms
    const hiddenCompany = document.getElementById('hiddenCompany');
    const hiddenAnswers = document.getElementById('hiddenAnswers');
    if (hiddenCompany) hiddenCompany.value = companyName;
    if (hiddenAnswers) hiddenAnswers.value = JSON.stringify(answersData);
    currentAffiliateUrl = affiliateUrl || '#';
    document.getElementById('leadModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLeadModal() {
    document.getElementById('leadModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('leadModal').addEventListener('click', function(e) {
    if (e.target === this) closeLeadModal();
});

function goToAffiliate() {
    window.open(currentAffiliateUrl, '_blank');
    closeLeadModal();
}

// ============================================================
// LEAD FORM SUBMIT
// ============================================================
function attachLeadFormListener() {
    const form = document.getElementById('leadForm');
    if (!form) return;
    form.addEventListener('submit', handleLeadFormSubmit);
}

function handleLeadFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('modalPhone').value.trim();
    const phoneInput = document.getElementById('modalPhone');
    const phoneError = document.getElementById('phoneError');
    const selectedCo = document.getElementById('selectedCompany').innerText;

    // Phone validation (Israeli: 9-10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 10) {
        phoneInput.style.borderColor = '#e53e3e';
        if (phoneError) phoneError.classList.remove('hidden');
        phoneInput.focus();
        return;
    }
    phoneInput.style.borderColor = '';
    if (phoneError) phoneError.classList.add('hidden');

    // Submit to Netlify Forms via fetch
    const formData = new FormData();
    formData.append('form-name', 'lead-form');
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('company', selectedCo);
    formData.append('answers', JSON.stringify(answersData));

    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    }).catch(err => console.log('Netlify Forms submit:', err));

    // Show thank-you inside modal (replaces modal content)
    document.querySelector('.modal').innerHTML = `
        <div style="text-align: center; padding: 15px 0;">
            <div style="font-size: 52px; margin-bottom: 18px;">✅</div>
            <h3 style="font-size: 22px; margin-bottom: 12px; color: var(--text-main);">קיבלנו, ${name}!</h3>
            <p style="color: var(--text-muted); line-height: 1.6; font-size: 15px;">
                נציג יחזור אליך למספר<br>
                <strong style="color: var(--text-main);">${phone}</strong><br>
                בנוגע ל-<strong style="color: var(--primary);">${selectedCo}</strong> בהקדם האפשרי.
            </p>
            <button class="primary-btn" style="margin-top: 28px;" onclick="closeLeadModal()">מצוין, תודה!</button>
        </div>
    `;
}

// Initial attachment
attachLeadFormListener();

// ============================================================
// RESTART
// ============================================================
function restartQuiz() {
    currentQuestion = 0;
    answersData = {};
    currentAffiliateUrl = '#';

    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.classList.add('hidden');

    // Reset chat
    document.getElementById('chatHistory').innerHTML = '';
    document.getElementById('chatOptionsGrid').innerHTML = '';

    // Reset header
    const h1 = document.querySelector('.card-header h1');
    if (h1) h1.style.display = '';

    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('subtitle').innerText = '4 שאלות. 3 תוצאות.';

    // Navigate back to welcome
    ['chatContainer', 'loadingScreen', 'resultScreen'].forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('active');
        el.classList.add('hidden');
    });
    const welcome = document.getElementById('welcomeScreen');
    welcome.classList.remove('hidden');
    welcome.classList.add('active');
}
