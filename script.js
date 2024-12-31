// Function to trigger translation on button click
async function translateText() {
    const inputText = document.getElementById('input-text').value;
    const sourceLang = document.getElementById('source-lang').value;
    const targetLang = document.getElementById('target-lang').value;

    if (!inputText) {
        alert('Please enter text to translate');
        return;
    }

    const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    const data = {
        q: inputText,
        source: sourceLang,
        target: targetLang
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (result.error) {
            alert(`Error: ${result.error.message}`);
        } else {
            document.getElementById('output-text').value = result.data.translations[0].translatedText;
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
    }
}
