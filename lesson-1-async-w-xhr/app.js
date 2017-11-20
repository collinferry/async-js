const form = document.querySelector('#search-form');
const searchField = document.querySelector('#search-keyword');
let searchedForText;
const responseContainer = document.querySelector('#response-container');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;
    callUnsplash();
    callNYT();
});

function callUnsplash(){
  const unsplashRequest = new XMLHttpRequest();
  unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
  unsplashRequest.onload = addImage;
  unsplashRequest.setRequestHeader('Authorization', 'Client-ID 1c4cc3942b9e39ea21f0cd8d7219e6a607aa6b8c804b2b961711b8b681ad8fb7');
  unsplashRequest.send();
}

function callNYT(){
  const articleRequest = new XMLHttpRequest();
  articleRequest.onload = addArticles;
  articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=b713c4d738c04e068c32fac65855c953`);
  articleRequest.send();
}

function addImage(){
  let htmlContent = '';
  const data = JSON.parse(this.responseText);

  if (data && data.results && data.results[0]){
    const firstImage = data.results[0];

    htmlContent = `<figure>
      <img src="${firstImage.urls.regular}" alt="${searchedForText}">
      <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
      </figure>`;
  } else {
    htmlContent = '<div class="error-no-image">No image available</div>';
  }

  responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
}

function insertHTML(html){
  responseContainer.insertAdjacentHTML('afterend', html);
}

function addArticles () {
  const data = JSON.parse(this.responseText);
  const articleCount = data.response.docs.length;

  if (data && data.response.docs && data.response.docs[0]){
    insertHTML('<ul>');

    for (var i=0; i<articleCount; i++) {

        var thisArticle = data.response.docs[i];
        var domain = 'http://www.nytimes.com/';
        var imgTag = ((thisArticle && thisArticle.multimedia[0] && thisArticle.multimedia[0].url) ? `<img src="${domain}${thisArticle.multimedia[0].url}" alt="${searchedForText}">` : ``);
        var author = ((thisArticle && thisArticle.byline && thisArticle.byline.original) ? thisArticle.byline.original : "unknown");

        htmlContent = `<li class="article">`+imgTag+`
          <h2><a href="${thisArticle.web_url}">${thisArticle.headline.main}</a></h2></br>${author}
          <p>${thisArticle.snippet}</p>
          </li>`;
        insertHTML(htmlContent);
    }
  } else {
    htmlContent = '<div class="error-no-image">No articles available</div>';
    insertHTML(htmlContent);
  }
  insertHTML('</ul>');
}
