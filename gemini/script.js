const GAS_URL = 'https://script.google.com/macros/s/AKfycbxVypWPBl9jhuW3a2kHd9VROfgNgF9icauTis3YZ5hoWcZxBdP9lLDVdqOLUv5OmvOoCQ/exec';

// AIzaSyCLy7lbx4SNvUZrNWwSKVnDpXYa0Y-K4CE

const input_text = document.getElementById("input_text");
const export_google = document.getElementById("export_google");


async function getgoogletext(url_google) {
    const response = await fetch(url_google);
    if (!response.ok)
    {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const translated_text = await response.text();
    return translated_text;
}

async function getgeminiexplain() {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCLy7lbx4SNvUZrNWwSKVnDpXYa0Y-K4CE';
    const jsonfile = {
        contents: [
            {
                parts: [
                    {
                        text: 'Explain how AI works. Output on Japanese.'
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonfile)
        });
        if (!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data_gemini:",data);
        const parts = data.candidates[0].content.parts;
        let output = JSON.stringify(parts.map(part => part.text).join(' '));
        console.log("Text:", output);
        output = convertMarkdownToHTML(output);
        return output
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        document.getElementById("export_gemini").innerHTML = 'error';
        return;
    }
}

function convertMarkdownToHTML(markdown) {
    //gをつけると対応するものすべてを変換する
    // /内容/gとすると良い
    //正規表現は()で表現
    //(?!.*<\/li><li>)とすることにより、後に*</li><li>が無い、</li><li>を指定する
    // Convert **text** to <b>text</b>
    let html = markdown.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // Convert ## Heading to <h2>Heading</h2>
    html = html.replace(/## (.*?)\\n/g, '<h2>$1</h2><br>');


    // first \n* to <ul><li>
    html = html.replace(/\\n\*/, '<ul><li>');
    // \n* to </li><li>
    html = html.replace(/\\n\*/g, '</li><li>');
    // last </li><li> to </li></ul>
    html = html.replace(/<\/li><li>(?!.*<\/li><li>)/, '</li></ul>');

    // Convert \n to <br>
    html = html.replace(/\\n/g, '<br>');

    // Convert " to nothing
    html = html.replace(/\"/g, '');

    return html;
}

// メイン処理
async function output() {
    let content_google = encodeURI('text=' + input_text.value + '&source=ja&target=en');
    //urlで読み取れるようにエンコードした文字列を作成
    console.log(`input_text.value: ${input_text.value}`);
    console.log(`encoded google content: ${content_google}`);
    let url_google = GAS_URL + '?' + content_google;
    export_google.innerText = 'loading...';

    try {
        // const [googleText, deeplText] = await Promise.all([
        const [googleText] = await Promise.all([
            getgoogletext(url_google),
        ]);

        export_google.innerText = googleText;
    } catch (error) {
        console.error('Error in translation:', error);
        export_google.innerText = 'error';
    }

    const gemini_output = await getgeminiexplain();
    export_gemini.innerHTML = gemini_output;
};


document.getElementById('translate-form').addEventListener('submit', function(e) {
    e.preventDefault();
    output();
});