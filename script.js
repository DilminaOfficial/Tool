const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const removeBgBtn = document.getElementById('removeBgBtn');
const resultImg = document.getElementById('resultImg');

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