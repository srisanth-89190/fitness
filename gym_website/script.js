/* ============================================================
   FitForge Gym — script.js
   All frontend logic: BMI, Calories, Workout, Diet,
   Register, Login, Dashboard, Navigation
   ============================================================ */

// ---- DATA ----

const WORKOUTS = {
  underweight: [
    { icon: '💪', name: 'Push-Ups', desc: 'Build upper body strength and chest muscle mass. Great for beginners.', sets: '3 Sets × 12 Reps', rest: '60s Rest' },
    { icon: '🦵', name: 'Squats', desc: 'Compound lower body exercise to build leg muscles and improve overall strength.', sets: '3 Sets × 15 Reps', rest: '60s Rest' },
    { icon: '🏋️', name: 'Bench Press', desc: 'Classic chest and tricep builder. Use moderate weight to gain muscle mass.', sets: '4 Sets × 10 Reps', rest: '90s Rest' },
    { icon: '🤸', name: 'Dumbbell Rows', desc: 'Build a wide, strong back and improve posture with this pulling exercise.', sets: '3 Sets × 12 Reps', rest: '60s Rest' },
  ],
  normal: [
    { icon: '🏃', name: 'Cardio', desc: 'Maintain your cardiovascular health and boost endurance with regular cardio sessions.', sets: '30 min', rest: 'Daily' },
    { icon: '💪', name: 'Push-Ups', desc: 'Keep your upper body strong and maintain muscle tone with progressive push-ups.', sets: '3 Sets × 15 Reps', rest: '45s Rest' },
    { icon: '🧘', name: 'Plank', desc: 'Core stability exercise that strengthens your entire midsection and back.', sets: '3 Sets × 60s', rest: '30s Rest' },
    { icon: '🚴', name: 'Cycling', desc: 'Low-impact cardio that works your legs and improves overall fitness.', sets: '45 min', rest: '3×/week' },
  ],
  overweight: [
    { icon: '🚶', name: 'Walking', desc: 'Start with 30-minute brisk walks. Low impact and highly effective for burning fat.', sets: '30–45 min', rest: 'Daily' },
    { icon: '🏃', name: 'Running', desc: 'Gradually increase pace from walking. Excellent calorie burner and heart health booster.', sets: '20 min', rest: '4×/week' },
    { icon: '🚴', name: 'Cycling', desc: 'Low-impact, high-calorie-burn exercise. Great for joints while losing weight.', sets: '30 min', rest: '4×/week' },
    { icon: '🏊', name: 'Swimming', desc: 'Full-body workout with zero joint impact. Burns calories while toning muscles.', sets: '30 min', rest: '3×/week' },
  ]
};

const DIET = {
  veg: [
    { header: '🌅 Breakfast', icon: '🥣', meal: 'Oats and Milk', detail: 'A nutritious start with complex carbs and protein for sustained energy throughout the morning.' },
    { header: '☀️ Lunch', icon: '🍛', meal: 'Rice and Dal', detail: 'A balanced combination of carbohydrates and plant-based protein — the classic power meal.' },
    { header: '🌙 Dinner', icon: '🫓', meal: 'Chapati and Vegetables', detail: 'Light, fiber-rich dinner with seasonal vegetables for vitamins and minerals.' },
    { header: '🍎 Snacks', icon: '🥜', meal: 'Fruits & Nuts', detail: 'Banana, apple, or mixed nuts for healthy fats and natural sugars between meals.' },
  ],
  nonveg: [
    { header: '🌅 Breakfast', icon: '🍳', meal: 'Eggs and Milk', detail: 'High-protein breakfast to kickstart muscle recovery and fuel your morning workout.' },
    { header: '☀️ Lunch', icon: '🍗', meal: 'Rice and Chicken', detail: 'Lean protein with complex carbs — the perfect muscle-building midday meal.' },
    { header: '🌙 Dinner', icon: '🐟', meal: 'Chapati and Fish', detail: 'Omega-3 rich fish with whole wheat chapati for a light but nutritious dinner.' },
    { header: '🍎 Snacks', icon: '🥚', meal: 'Boiled Eggs & Fruits', detail: 'Quick protein boost with natural sugars for healthy between-meal snacking.' },
  ]
};

// ---- STATE ----
let currentUser = null;
let userBMI     = null;
let userBMICat  = null;

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initNavHighlight();
  showWorkout('underweight', document.querySelector('.tab-btn.active'));
  showDiet('veg');

  // Restore session from sessionStorage
  const saved = sessionStorage.getItem('fitforgeUser');
  if (saved) {
    try { loginSuccess(JSON.parse(saved), false); } catch(e) { sessionStorage.removeItem('fitforgeUser'); }
  }
});

// ---- NAVBAR ----
function initNavScroll() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  });
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ---- BMI CALCULATOR ----
function calculateBMI() {
  const w = parseFloat(document.getElementById('bmiWeight').value);
  const h = parseFloat(document.getElementById('bmiHeight').value);

  if (!w || !h || w <= 0 || h <= 0) { alert('Please enter valid weight and height.'); return; }

  const hm  = h / 100;
  const bmi = (w / (hm * hm)).toFixed(1);

  let cat, cls, tip;
  if (bmi < 18.5) {
    cat = 'Underweight'; cls = 'cat-underweight';
    tip = 'Consider a calorie surplus diet and strength training to gain healthy weight.';
  } else if (bmi < 25) {
    cat = 'Normal'; cls = 'cat-normal';
    tip = 'Great job! Maintain your weight with balanced diet and regular exercise.';
  } else if (bmi < 30) {
    cat = 'Overweight'; cls = 'cat-overweight';
    tip = 'Focus on cardio exercises and a calorie deficit diet to reach healthy weight.';
  } else {
    cat = 'Obese'; cls = 'cat-obese';
    tip = 'Consult a healthcare professional and start with low-impact exercises daily.';
  }

  userBMI    = bmi;
  userBMICat = cat.toLowerCase();

  document.getElementById('bmiResult').innerHTML = `
    <div class="result-box">
      <span class="result-value">${bmi}</span>
      <span class="result-cat ${cls}">${cat}</span>
      <p class="result-tip">${tip}</p>
    </div>
  `;
}

// ---- CALORIE CALCULATOR ----
function calculateCalories() {
  const age      = parseFloat(document.getElementById('calAge').value);
  const h        = parseFloat(document.getElementById('calHeight').value);
  const w        = parseFloat(document.getElementById('calWeight').value);
  const gender   = document.getElementById('calGender').value;
  const activity = parseFloat(document.getElementById('calActivity').value);

  if (!age || !h || !w) { alert('Please fill in all fields.'); return; }

  // Mifflin-St Jeor BMR
  let bmr = gender === 'male'
    ? (10 * w) + (6.25 * h) - (5 * age) + 5
    : (10 * w) + (6.25 * h) - (5 * age) - 161;

  const tdee   = Math.round(bmr * activity);
  const protein = Math.round((tdee * 0.3) / 4);
  const carbs   = Math.round((tdee * 0.45) / 4);
  const fat     = Math.round((tdee * 0.25) / 9);

  document.getElementById('calResult').innerHTML = `
    <div class="cal-result-big">
      <span class="cal-number">${tdee}</span>
      <span class="cal-unit">Calories / Day</span>
      <div class="cal-breakdown">
        <div class="cal-row"><span>🥩 Protein</span><span>${protein}g / day</span></div>
        <div class="cal-row"><span>🍞 Carbs</span><span>${carbs}g / day</span></div>
        <div class="cal-row"><span>🥑 Healthy Fat</span><span>${fat}g / day</span></div>
        <div class="cal-row"><span>🔥 BMR</span><span>${Math.round(bmr)} cal</span></div>
      </div>
    </div>
  `;
}

// ---- WORKOUT TABS ----
function showWorkout(category, btn) {
  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const grid = document.getElementById('workoutGrid');
  const list = WORKOUTS[category] || [];
  grid.innerHTML = list.map(w => `
    <div class="workout-card">
      <span class="wc-icon">${w.icon}</span>
      <div class="wc-name">${w.name}</div>
      <div class="wc-desc">${w.desc}</div>
      <div class="wc-meta">
        <span class="wc-tag">📋 ${w.sets}</span>
        <span class="wc-tag">⏱ ${w.rest}</span>
      </div>
    </div>
  `).join('');
}

// ---- DIET ----
function showDiet(type) {
  document.getElementById('vegBtn').classList.toggle('active', type === 'veg');
  document.getElementById('nonvegBtn').classList.toggle('active', type === 'nonveg');

  const meals = DIET[type] || [];
  document.getElementById('dietCards').innerHTML = meals.map(m => `
    <div class="diet-card">
      <div class="diet-card-header">${m.header}</div>
      <div class="diet-card-body">
        <div class="diet-meal">
          <span class="meal-icon">${m.icon}</span>
          <div class="meal-info">
            <div class="meal-food">${m.meal}</div>
            <div class="meal-time" style="margin-top:4px;font-size:0.8rem;color:var(--text-sec)">${m.detail}</div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- REGISTRATION ----
async function registerUser() {
  const name   = document.getElementById('regName').value.trim();
  const email  = document.getElementById('regEmail').value.trim();
  const phone  = document.getElementById('regPhone').value.trim();
  const age    = document.getElementById('regAge').value;
  const height = document.getElementById('regHeight').value;
  const weight = document.getElementById('regWeight').value;
  const pass   = document.getElementById('regPass').value;

  if (!name || !email || !phone || !age || !height || !weight || !pass) {
    showMsg('registerMsg', 'error', '⚠ Please fill in all fields.');
    return;
  }
  if (pass.length < 6) {
    showMsg('registerMsg', 'error', '⚠ Password must be at least 6 characters.');
    return;
  }

  setBtnLoading('regBtnText', 'Creating account...');

  try {
    const fd = new FormData();
    fd.append('name', name); fd.append('email', email); fd.append('phone', phone);
    fd.append('age', age);   fd.append('height', height); fd.append('weight', weight);
    fd.append('password', pass);

    const res  = await fetch('register.php', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.status === 'success') {
      showMsg('registerMsg', 'success', '✅ ' + data.message + ' Redirecting to login...');
      clearForm(['regName','regEmail','regPhone','regAge','regHeight','regWeight','regPass']);
      setTimeout(() => { window.location.hash = '#login'; }, 1500);
    } else {
      showMsg('registerMsg', 'error', '❌ ' + data.message);
    }
  } catch(e) {
    showMsg('registerMsg', 'error', '⚠ Could not connect. Make sure XAMPP is running and this file is in htdocs/gym_website/.');
  }

  setBtnLoading('regBtnText', 'Create My Account');
}

// ---- LOGIN ----
async function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;

  if (!email || !pass) { showMsg('loginMsg', 'error', '⚠ Enter your email and password.'); return; }

  setBtnLoading('loginBtnText', 'Logging in...');

  try {
    const fd = new FormData();
    fd.append('email', email); fd.append('password', pass);

    const res  = await fetch('login.php', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.status === 'success') {
      showMsg('loginMsg', 'success', '✅ ' + data.message);
      setTimeout(() => loginSuccess(data.user, true), 800);
    } else {
      showMsg('loginMsg', 'error', '❌ ' + data.message);
    }
  } catch(e) {
    showMsg('loginMsg', 'error', '⚠ Could not connect. Make sure XAMPP is running and this file is in htdocs/gym_website/.');
  }

  setBtnLoading('loginBtnText', 'Login to Dashboard');
}

function loginSuccess(user, save) {
  currentUser = user;
  if (save) sessionStorage.setItem('fitforgeUser', JSON.stringify(user));

  // Show/hide nav items
  document.getElementById('registerNavLink').classList.add('hidden');
  document.getElementById('loginNavLink').classList.add('hidden');
  document.getElementById('dashboardNavLink').classList.remove('hidden');
  document.getElementById('logoutBtn').classList.remove('hidden');

  buildDashboard(user);
  document.getElementById('dashboard').classList.remove('hidden');
  setTimeout(() => { window.location.hash = '#dashboard'; }, 300);
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('fitforgeUser');
  document.getElementById('registerNavLink').classList.remove('hidden');
  document.getElementById('loginNavLink').classList.remove('hidden');
  document.getElementById('dashboardNavLink').classList.add('hidden');
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  window.location.hash = '#home';
}

// ---- DASHBOARD ----
function buildDashboard(user) {
  document.getElementById('dashWelcome').textContent = 'Welcome back, ' + user.name + '! Here\'s your fitness overview.';

  // User Info
  document.getElementById('userInfo').innerHTML = `
    <div class="user-row"><span>Name</span><span>${user.name}</span></div>
    <div class="user-row"><span>Email</span><span>${user.email}</span></div>
    <div class="user-row"><span>Phone</span><span>${user.phone}</span></div>
    <div class="user-row"><span>Age</span><span>${user.age} years</span></div>
    <div class="user-row"><span>Height</span><span>${user.height} cm</span></div>
    <div class="user-row"><span>Weight</span><span>${user.weight} kg</span></div>
  `;

  // BMI
  const hm  = user.height / 100;
  const bmi = (user.weight / (hm * hm)).toFixed(1);
  let bmiCat, bmiCls;
  if (bmi < 18.5)      { bmiCat = 'Underweight'; bmiCls = 'cat-underweight'; }
  else if (bmi < 25)   { bmiCat = 'Normal';       bmiCls = 'cat-normal'; }
  else if (bmi < 30)   { bmiCat = 'Overweight';   bmiCls = 'cat-overweight'; }
  else                 { bmiCat = 'Obese';         bmiCls = 'cat-obese'; }

  userBMICat = bmiCat.toLowerCase();

  document.getElementById('dashBMI').innerHTML = `
    <span class="dash-big-num">${bmi}</span>
    <span class="dash-label">Your BMI</span>
    <div class="dash-cat ${bmiCls}">${bmiCat}</div>
  `;

  // Calories
  const bmr  = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5;
  const tdee = Math.round(bmr * 1.375);
  document.getElementById('dashCal').innerHTML = `
    <span class="dash-big-num">${tdee}</span>
    <span class="dash-label">Calories / Day</span>
  `;

  // Workout
  const catKey = bmiCat === 'Normal' ? 'normal' : bmiCat === 'Underweight' ? 'underweight' : 'overweight';
  const workouts = WORKOUTS[catKey] || [];
  document.getElementById('dashWorkout').innerHTML = workouts.map(w => `
    <div class="dash-item">
      <span class="dash-item-icon">${w.icon}</span>
      <div class="dash-item-text">
        <div class="dash-item-title">${w.name}</div>
        <div class="dash-item-sub">${w.sets} &middot; ${w.rest}</div>
      </div>
    </div>
  `).join('');

  // Diet (default veg for dashboard)
  const dietType = user.weight < 70 ? 'veg' : 'nonveg'; // simple heuristic; user can pick manually
  const meals = DIET['veg'];
  document.getElementById('dashDiet').innerHTML = meals.map(m => `
    <div class="dash-item">
      <span class="dash-item-icon">${m.icon}</span>
      <div class="dash-item-text">
        <div class="dash-item-title">${m.header.split(' ').slice(1).join(' ')}: ${m.meal}</div>
        <div class="dash-item-sub">${m.detail}</div>
      </div>
    </div>
  `).join('');
}

// ---- HELPERS ----
function showMsg(id, type, text) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className   = 'form-msg ' + type;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 5000);
}

function setBtnLoading(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function clearForm(ids) {
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else                           { input.type = 'password'; btn.textContent = '👁'; }
}

// ---- ENTER KEY SUPPORT ----
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const active = document.activeElement;
  if (!active) return;
  if (['bmiWeight','bmiHeight'].includes(active.id))              calculateBMI();
  if (['calAge','calHeight','calWeight'].includes(active.id))     calculateCalories();
  if (['regName','regEmail','regPhone','regAge','regHeight','regWeight','regPass'].includes(active.id)) registerUser();
  if (['loginEmail','loginPass'].includes(active.id))             loginUser();
});
