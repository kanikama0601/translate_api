const GAS_URL = 'DUMMY_URL';
const DEEP_URL = 'DUMMY_URL';
const DEEPL_API_KEY = 'DUMMY_API_KEY';

const input_text = document.getElementById("input_text");
const export_google = document.getElementById("export_google");
const export_deepl = document.getElementById("export_deepl");
const export_gemini = document.getElementById("export_gemini");

async function getgoogletext(url_google) {
    const response = await fetch(url_google);
    if (!response.ok)
    {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const translated_text = await response.text();
    console.log("data_google:",translated_text);
    return translated_text;
}

async function getdeepltext(url_deepl) {
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

function addSlideInAnimation(element) {
    element.classList.remove('slide-in-right'); // 初期状態をリセット
    void element.offsetWidth; // レイアウトの再計算を強制してアニメーションをリセット
    element.classList.add('slide-in-right'); // スライドインクラスを適用
}

// タイプライターアニメーションを実行する関数（HTML対応版）
function typeWriter(element, html, speed = 50) {
    element.innerHTML = ''; // まず空にする
    let index = 0;
    let isTag = false; // タグかどうかを判断するフラグ
    let text = ''; // 実際に表示するテキスト

    function type() {
        if (index < html.length) {
            let char = html.charAt(index);

            if (char === '<') {
                isTag = true; // タグの開始
            }

            if (isTag) {
                text += char; // タグを一括で追加
                if (char === '>') {
                    isTag = false; // タグの終了
                }
            } else {
                text += char; // 通常の文字を1つずつ追加
            }

            element.innerHTML = text; // HTMLとして表示
            index++;
            setTimeout(type, speed); // 次の文字までの待機時間
        }
    }
    type();
}

async function getgeminiexplain(originalText, googletext, deepltext) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=DUMMY_API_KEY';
    const jsonfile = {
        contents: [
            {
                parts: [
                    {
                        text: `
                        元の日本語テキスト: "${originalText}"
                        Google翻訳: "${googletext}"
                        DeepL翻訳: "${deepltext}"

                        以下の点について分析してください：
                        1. 翻訳の正確性：両方の翻訳が原文の意味を正確に伝えているか評価してください。
                        2. 文法と語彙：使用されている文法構造と語彙の適切さを比較してください。
                        3. 自然さとフロー：どちらの翻訳がより自然で流暢に読めるか分析してください。
                        4. ニュアンスの違い：二つの翻訳間でのニュアンスの違いを指摘してください。
                        5. コンテキストの理解：翻訳が原文のコンテキストをどの程度適切に反映しているか評価してください。
                        6. 改善点：両方の翻訳について、改善できる点があれば提案してください。
                        7. 総合評価：両方の翻訳の長所と短所を総合的にまとめ、どちらがより効果的か結論を出してください。

                        分析は日本語で行い、各ポイントを明確に分けて説明してください
                        `
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
    html = html.replace(/### (.*?)\\n/g, '<h3>$1</h3><br>');
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
    html = html.replace(/\"/, '');
    html = html.replace(/\"(?!.*\")/, '');
    html = html.replace(/\\"/g, '"');

    return html;
}

// メイン処理
async function output(source_lang, target_lang) {
    let content_google = encodeURI('text=' + input_text.value + '&source=' + source_lang + '&target=' + target_lang);
    let content_deepl = encodeURI('auth_key=' + DEEPL_API_KEY + '&text=' + input_text.value + '&source_lang=' + source_lang.toUpperCase() + '&target_lang=' + target_lang.toUpperCase());
    //urlで読み取れるようにエンコードした文字列を作成
    console.log(`input_text.value: ${input_text.value}`);
    console.log(`encoded google content: ${content_google}`);
    console.log(`encoded deepl content: ${content_deepl}`);

    let url_google = GAS_URL + '?' + content_google;
    let url_deepl = DEEP_URL + '?' + content_deepl;
    export_google.innerText = 'loading...';
    export_deepl.innerText = 'loading...';

    try {
        const [googleText, deeplText] = await Promise.all([
            getgoogletext(url_google),
            getdeepltext(url_deepl)
        ]);

        export_google.innerText = googleText;
        export_deepl.innerText = deeplText;

        addSlideInAnimation(export_google);
        addSlideInAnimation(export_deepl);

        const gemini_output = await getgeminiexplain(input_text.value, googleText, deeplText);
        typeWriter(document.getElementById("export_gemini"), gemini_output, 1); //1ms間隔で文字を表示
    } catch (error) {
        console.error('Error in translation:', error);
        export_google.innerText = 'error';
        export_deepl.innerText = 'error';
    }
};


document.getElementById('translate-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const source_lang = document.getElementById("source_lang");
    const target_lang = document.getElementById("target_lang");
    output(source_lang.value, target_lang.value);
});

// This code was made by Kohara
// 俺のAPI使ってるので、いずれ使えなるかもしれないです。
// APIの利用が気になる場合はお尋ね下さい。
// APIの変更時もお尋ね下さい。設定します。
// kanikama0601school@gmail.com