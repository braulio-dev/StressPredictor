// Config 
const API_URL = 'http://localhost:8000/predict';

// DOM Refs 
const form = document.getElementById('predictionForm');
const submitBtn = document.getElementById('submitBtn');
const overlay = document.getElementById('resultOverlay');
const resultIcon = document.getElementById('resultIcon');
const resultDiagnosis = document.getElementById('resultDiagnosis');
const resultExplanation = document.getElementById('resultExplanation');
const toastEl = document.getElementById('toast');

// Feature names
const FEATURES = [
    'radius_worst', 'texture_worst', 'perimeter_worst', 'area_worst',
    'smoothness_worst',
    'compactness_mean', 'compactness_worst',
    'concavity_mean', 'concavity_worst',
    'concave_points_worst'
];

function showToast(msg, duration = 3500) {
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    setTimeout(() => toastEl.classList.remove('visible'), duration);
}

function validateForm() {
    let valid = true;
    FEATURES.forEach(name => {
        const input = document.getElementById(name);
        const val = parseFloat(input.value);
        if (isNaN(val) || val < 0) {
            input.classList.add('error');
            valid = false;
        } else {
            input.classList.remove('error');
        }
    });
    return valid;
}

document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
});

function showResult(diagnosis, confidence) {
    const isBenign = diagnosis === 'B' || diagnosis === 'Benign' || diagnosis === 0 || diagnosis === '0';

    resultIcon.className = `result-icon ${isBenign ? 'benign' : 'malignant'}`;
    const img = document.getElementById('resultIconImg');
    img.src = isBenign
        ? '../static/images/benign.png'
        : '../static/images/malignant.png';
    img.alt = isBenign ? 'Benign' : 'Malignant';

    resultDiagnosis.className = `result-diagnosis ${isBenign ? 'benign' : 'malignant'}`;
    resultDiagnosis.textContent = isBenign ? 'Benign' : 'Malignant';

    const confEl = document.getElementById('resultConfidence');
    if (confidence !== undefined) {
        confEl.textContent = `Model confidence: ${(confidence * 100).toFixed(1)}%`;
    } else {
        confEl.textContent = '';
    }

    if (isBenign) {
        resultExplanation.innerHTML = `
            <strong>What this means:</strong><br>
            The model classified this sample as a <strong>benign tumor</strong>. 
            Most breast lumps are benign and not cancer. Non-cancerous breast tumors are 
            abnormal growths, but they do <strong>not spread outside of the breast</strong> 
            and are generally <strong>not life-threatening</strong>.<br><br>
            <strong>Important:</strong><br>
            Some types of benign breast lumps can still increase the risk of developing 
            breast cancer in the future. Any breast lump or change should be checked by a 
            health care professional to confirm the finding.
        `;
    } else {
        resultExplanation.innerHTML = `
            <strong>What this means:</strong><br>
            The model classified this sample as a <strong>malignant tumor</strong>. 
            Malignant breast cancer occurs when cells begin to grow out of control. 
            Unlike benign tumors, cancer cells can <strong>spread to the blood or lymph system</strong> 
            and travel to other parts of the body.<br><br>
            <strong>Next steps:</strong><br>
            This result should be followed up <strong>immediately with a medical specialist</strong>. 
            Early detection and prompt treatment significantly improve outcomes. 
            A healthcare professional will determine the type, grade, and treatment options.
        `;
    }

    overlay.classList.add('visible');
}

function closeResult() {
    overlay.classList.remove('visible');
}

document.getElementById('resultCloseX').addEventListener('click', closeResult);
document.getElementById('resultCloseBtn').addEventListener('click', closeResult);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeResult();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        showToast('Please fill in all fields correctly');
        return;
    }

    const payload = {};
    FEATURES.forEach(name => {
        payload[name] = parseFloat(document.getElementById(name).value);
    });

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        const diagnosis = data.diagnosis || data.prediction || data.result;
        const confidence = data.confidence;

        if (!diagnosis) {
            throw new Error('Unexpected response from server');
        }

        showResult(diagnosis, confidence);

    } catch (err) {
        console.error('Prediction error:', err);
        showToast(`Error: ${err.message}`);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});
