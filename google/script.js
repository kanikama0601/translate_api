const GAS_URL = 'https://script.google.com/macros/s/AKfycbxVypWPBl9jhuW3a2kHd9VROfgNgF9icauTis3YZ5hoWcZxBdP9lLDVdqOLUv5OmvOoCQ/exec';
// https://script.google.com/macros/s/AKfycbxVypWPBl9jhuW3a2kHd9VROfgNgF9icauTis3YZ5hoWcZxBdP9lLDVdqOLUv5OmvOoCQ/exec?text=この部分を翻訳します&source=ja&target=en

async function output() {
    const entext = document.getElementById("entext").value;
    const export_google = document.getElementById("export_google");

    let content = encodeURI('text=' + entext + '&source=ja&target=en');
    console.log(`entext: ${entext}`);
    console.log(`encoded content: ${content}`);
    let url = GAS_URL + '?' + content;
    export_google.innerText = 'loading...';

    try {
        const response_google = await fetch(url);
        if (!response_google.ok)
        {
            throw new Error(`HTTP error! status: ${response_gooogle.status}`);
        }
        const translated_google = await response_google.text();
        export_google.innerText = translated_google;

    }
    catch (error) { //エラー処理
        console.error('There was a problem with the fetch operation:', error.message);
        export_google.innerText = 'error';
        throw error;
    }
};

document.getElementById('translate-form').addEventListener('submit', function(e) {
    e.preventDefault();
    output();
});