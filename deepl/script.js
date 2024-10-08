const API_KEY = 'aeb1dc82-5ce4-4e31-bee0-3c5c7055ebd8:fx';
const API_URL = 'https://api-free.deepl.com/v2/translate';

function output() {
  const entext = document.getElementById("entext").value;

  let content = encodeURI('auth_key=' + API_KEY + '&text=' + entext + '&source_lang=EN&target_lang=JA');
  let url = API_URL + '?' + content;

  fetch(url)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Could not reach the API: " + response.statusText);
        }
    }).then(function(data) {
        document.getElementById("jatext").value = data["translations"][0]["text"];
    }).catch(function(error) {
        document.getElementById("jatext").value = error.message;
    });
};