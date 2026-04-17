const TOTAL = 6;

const sectionLabels = [
  'Contact Information',
  'Your Website',
  'Pages and Features',
  'Brand and Design',
  'Content',
  'Budget, Timeline & Anything Else'
];

let currentSection = 1;

function showFieldError(message, context) {
  const existing = context.querySelector('.field-error');
  if (existing) existing.remove();
  const span = document.createElement('span');
  span.className = 'field-error';
  span.textContent = message;
  context.appendChild(span);
}

function updateProgress(step) {
  const pct = (step / TOTAL) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent =
    `Section ${step} of ${TOTAL} — ${sectionLabels[step - 1]}`;

  for (let i = 1; i <= TOTAL; i++) {
    const dot = document.getElementById('dot' + i);
    dot.className = 'step-dot';
    if (i < step) dot.classList.add('done');
    else if (i === step) dot.classList.add('active');
  }
}

function showSection(n) {
  for (let i = 1; i <= TOTAL; i++) {
    const sec = document.getElementById('section' + i);
    if (sec) sec.classList.remove('active');
  }
  const target = document.getElementById('section' + n);
  if (target) target.classList.add('active');

  document.getElementById('submitSection').style.display =
    (n === TOTAL) ? 'block' : 'none';

  currentSection = n;
  updateProgress(n);

  document.querySelector('.progress-outer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goNext(from) {
  if (from === 1) {
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const bizname = document.getElementById('bizname').value.trim();
    if (!fname || !lname || !email || !bizname) {
      const section = document.getElementById('section1');
      showFieldError('Please fill in your first name, last name, email, and business name before continuing.', section);
      return;
    }
  }
  if (from < TOTAL) showSection(from + 1);
}

function goBack(from) {
  if (from > 1) showSection(from - 1);
}

async function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('intakeForm');

  const get = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const getRadio = (name) => { const el = form.querySelector(`input[name="${name}"]:checked`); return el ? el.value : 'Not answered'; };
  const getCheckboxes = (name) => { const checked = [...form.querySelectorAll(`input[name="${name}"]:checked`)]; return checked.length ? checked.map(c => c.value).join(', ') : 'None selected'; };

  const fname = get('fname'), lname = get('lname'), email = get('email'), bizname = get('bizname');

  if (!fname || !lname || !email || !bizname) {
    showSection(1);
    const section = document.getElementById('section1');
    showFieldError('Please fill in your first name, last name, business name, and email before submitting.', section);
    return;
  }

  const submitBtn = document.querySelector('.submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending… <span class="btn-arrow">⏳</span>';

  const message = [
    '=== NEW CLIENT INTAKE — RISING TIDE DIGITAL, LLC ===',
    '',
    '--- CONTACT INFO ---',
    `Name: ${fname} ${lname}`,
    `Email: ${email}`,
    `Phone: ${get('phone') || 'Not provided'}`,
    `Business: ${bizname}`,
    `Industry: ${get('industry') || 'Not provided'}`,
    '',
    '--- WEBSITE ---',
    `Has a website: ${getRadio('has_site')}`,
    `Current URL: ${get('current_url') || 'None'}`,
    `Main goal: ${getRadio('goal')}`,
    `Target audience: ${get('audience') || 'Not provided'}`,
    '',
    '--- PAGES & FEATURES ---',
    `Pages needed: ${getCheckboxes('pages')}`,
    `Special features: ${get('features') || 'None listed'}`,
    '',
    '--- BRAND & DESIGN ---',
    `Logo: ${getRadio('logo')}`,
    `Brand colors: ${get('colors') || 'Not provided'}`,
    `Brand fonts: ${get('fonts') || 'Not provided'}`,
    `Design inspiration: ${get('inspo') || 'Not provided'}`,
    `Vibe: ${getRadio('vibe')}`,
    '',
    '--- CONTENT ---',
    `Copy responsibility: ${getRadio('copy')}`,
    `Photos responsibility: ${getRadio('photos')}`,
    '',
    '--- BUDGET & TIMELINE ---',
    `Budget range: ${getRadio('budget')}`,
    `Timeline: ${getRadio('timeline')}`,
    `Ongoing maintenance: ${getRadio('maintain')}`,
    `Referral source: ${getRadio('referral')}`,
    `Additional notes: ${get('notes') || 'None'}`,
    '',
    '=== END OF FORM ==='
  ].join('\n');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '4afb9b32-d081-4b5b-94d3-98470c9b4e49',
        subject: `New Intake Form — ${bizname} (${fname} ${lname})`,
        from_name: `${fname} ${lname} via Rising Tide Digital Intake`,
        replyto: email,
        message: message
      })
    });

    const result = await response.json();

    if (result.success) {
      showSuccessScreen(fname);
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send My Intake Form <span class="btn-arrow">→</span>';
    const submitSection = document.getElementById('submitSection');
    showFieldError('Something went wrong. Please try again or email us directly at joseph@risingtidedigital.us', submitSection);
    console.error(err);
  }
}

function showSuccessScreen(fname) {
  document.getElementById('intakeForm').style.display = 'none';
  document.getElementById('submitSection').style.display = 'none';

  const success = document.getElementById('successScreen');
  success.style.display = 'block';

  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('progressLabel').textContent = 'Form Submitted — Thank You!';
  for (let i = 1; i <= TOTAL; i++) {
    const dot = document.getElementById('dot' + i);
    dot.className = 'step-dot done';
  }

  success.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
