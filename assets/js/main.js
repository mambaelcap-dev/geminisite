// assets/js/main.js

// 1. Navigation Logic (Highlight active page)
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === path || (path === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// 2. Image to Prompt Logic (Analyze)
async function analyzeImage(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;

    // Show Preview
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('preview-img').src = e.target.result;
        document.getElementById('preview-img').classList.remove('hidden');
        document.getElementById('upload-text').classList.add('hidden');
    };
    reader.readAsDataURL(file);

    // Call Backend
    const btn = document.getElementById('btn-generate');
    const output = document.getElementById('result-area');
    
    btn.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> ANALYZING...';
    btn.disabled = true;

    try {
        // Convert to Base64 for API
        const base64 = await toBase64(file);
        
        const response = await fetch('/.netlify/functions/analyze', {
            method: 'POST',
            body: JSON.stringify({ image: base64 })
        });
        const data = await response.json();
        output.value = data.result || "Error connecting to AI";
        
    } catch (err) {
        output.value = "Error: " + err.message;
    } finally {
        btn.innerHTML = '✨ Generate Prompt';
        btn.disabled = false;
    }
}

// 3. Enhancer Logic
async function enhancePrompt() {
    const inputVal = document.getElementById('input-prompt').value;
    if(!inputVal) return;

    const btn = document.getElementById('btn-enhance');
    const output = document.getElementById('output-prompt');

    btn.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> ENHANCING...';
    btn.disabled = true;

    try {
        const response = await fetch('/.netlify/functions/enhance', {
            method: 'POST',
            body: JSON.stringify({ prompt: inputVal })
        });
        const data = await response.json();
        output.value = data.result || "Error";
    } catch (err) {
        output.value = "Error: " + err.message;
    } finally {
        btn.innerHTML = '⚡ Enhance with Magic';
        btn.disabled = false;
    }
}

// Helper: File to Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// Helper: Copy Text
function copyText(id) {
    const el = document.getElementById(id);
    el.select();
    document.execCommand('copy');
    alert("Copied to clipboard!");
}