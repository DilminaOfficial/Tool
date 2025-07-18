const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const removeBgBtn = document.getElementById('removeBgBtn');
const resultImg = document.getElementById('resultImg');
const linkInput = document.getElementById('linkInput');
const linkPreview = document.getElementById('linkPreview');

let uploadedFile = null;

imageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        uploadedFile = file;
        const reader = new FileReader();
        reader.onload = function (event) {
            preview.src = event.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
        removeBgBtn.disabled = false;
    } else {
        preview.style.display = 'none';
        removeBgBtn.disabled = true;
    }
});

removeBgBtn.addEventListener('click', async function () {
    if (!uploadedFile) return;
    removeBgBtn.disabled = true;
    removeBgBtn.textContent = 'Processing...';

    const formData = new FormData();
    formData.append('image_file', uploadedFile);
    // For remove.bg API, you can specify bg_color or use default. Here, we assume blue background removal.
    formData.append('bg_color', 'blue');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': '2KvQct46A2G7TFHst5x1uW7x'
            },
            body: formData
        });
        if (!response.ok) {
            throw new Error('API Error: ' + response.statusText);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        resultImg.src = url;
        resultImg.style.display = 'block';
    } catch (err) {
        alert('Failed to remove background: ' + err.message);
    } finally {
        removeBgBtn.disabled = false;
        removeBgBtn.textContent = 'Remove Blue Background';
    }
});

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

async function fetchLinkPreview(url) {
    // Use a public Open Graph API proxy (for demo purposes)
    // In production, use your own backend to avoid CORS issues
    const apiUrl = `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`;
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch link preview');
        return await res.json();
    } catch (e) {
        return null;
    }
}

linkInput.addEventListener('input', async function () {
    const url = linkInput.value.trim();
    if (isValidUrl(url)) {
        linkPreview.style.display = 'block';
        linkPreview.textContent = 'Loading preview...';
        const data = await fetchLinkPreview(url);
        if (data && (data.title || data.description || data.images?.length)) {
            linkPreview.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    ${data.images && data.images.length ? `<img src="${data.images[0]}" alt="Preview" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">` : ''}
                    <div style="text-align:left;">
                        <div style="font-weight:bold;">${data.title || ''}</div>
                        <div style="font-size:13px;color:#555;">${data.description || ''}</div>
                        <a href="${url}" target="_blank" style="font-size:12px;color:#007bff;">${url}</a>
                    </div>
                </div>
            `;
        } else {
            linkPreview.textContent = 'No preview available.';
        }
    } else {
        linkPreview.style.display = 'none';
        linkPreview.textContent = '';
    }
});