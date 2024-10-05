const GAS_URL = 'https://script.google.com/macros/s/AKfycbxVypWPBl9jhuW3a2kHd9VROfgNgF9icauTis3YZ5hoWcZxBdP9lLDVdqOLUv5OmvOoCQ/exec';
const DEEP_URL = 'https://api-free.deepl.com/v2/translate';
const DEEPL_API_KEY = 'aeb1dc82-5ce4-4e31-bee0-3c5c7055ebd8:fx';
// https://script.google.com/macros/s/AKfycbxVypWPBl9jhuW3a2kHd9VROfgNgF9icauTis3YZ5hoWcZxBdP9lLDVdqOLUv5OmvOoCQ/exec?text=この部分を翻訳します&source=ja&target=en

const input_text = document.getElementById("input_text");
const export_google = document.getElementById("export_google");
const export_deepl = document.getElementById("export_deepl");

async function output() {
    let content_google = encodeURI('text=' + input_text.value + '&source=ja&target=en');
    let content_deepl = encodeURI('auth_key=' + DEEPL_API_KEY + '&text=' + input_text.value + '&source_lang=JA&target_lang=EN');
    //urlで読み取れるようにエンコードした文字列を作成
    console.log(`input_text.value: ${input_text.value}`);
    console.log(`encoded google content: ${content_google}`);
    console.log(`encoded deepl content: ${content_deepl}`);
    let url_google = GAS_URL + '?' + content_google;
    let url_deepl = DEEP_URL + '?' + content_deepl;
    export_google.innerText = 'loading...';

    export_google.innerText = `${await getgoogletext(url_google)}`;
    export_deepl.innerText = `${await getdeepltext(url_deepl)}`;
};

async function getgoogletext(url_google) {
    try {
        const response = await fetch(url_google);
        if (!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translated_text = await response.text();
        return translated_text;
    }
    catch (error) { //エラー処理
        console.error('There was a problem with the fetch operation:', error.message);
        export_google.innerText = 'error';
        throw error;
    }
}

async function getdeepltext(url_deepl) {
    try {
        const response = await fetch(url_deepl);
        if (!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data_deepl:",data);
        const translated_text = data["translations"][0]["text"];
        return translated_text;

    }
    catch (error) { //エラー処理
        console.error('There was a problem with the fetch operation:', error.message);
        export_google.innerText = 'error';
        throw error;
    }
}

document.getElementById('translate-form').addEventListener('submit', function(e) {
    e.preventDefault();
    output();
});