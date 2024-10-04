const GAS_URL = 'https://script.google.com/macros/s/AKfycbxVypWPBl9jhuW3a2kHd9VROfgNgF9icauTis3YZ5hoWcZxBdP9lLDVdqOLUv5OmvOoCQ/exec';
// https://script.google.com/macros/s/AKfycbxVypWPBl9jhuW3a2kHd9VROfgNgF9icauTis3YZ5hoWcZxBdP9lLDVdqOLUv5OmvOoCQ/exec?text=この部分を翻訳します&source=ja&target=en

const input_text = document.getElementById("input_text");
const export_google = document.getElementById("export_google");
const export_deepl = document.getElementById("export_deepl");

async function output() {
    let content_google = encodeURI('text=' + input_text.value + '&source=ja&target=en');
    //urlで読み取れるようにエンコードした文字列を作成
    console.log(`input_text.value: ${input_text.value}`);
    console.log(`encoded content: ${content_google}`);
    let url_google = GAS_URL + '?' + content_google;
    export_google.innerText = 'loading...';

    export_google.innerText = `${await getgoogletext(url_google)}`;
};

async function getgoogletext(url_google) {
    try {
        const response_google = await fetch(url_google);
        if (!response_google.ok)
        {
            throw new Error(`HTTP error! status: ${response_google.status}`);
        }
        const translated_google = await response_google.text();
        return translated_google;

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