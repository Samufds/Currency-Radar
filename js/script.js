const API_KEY = "0327fe31e05941c88705a1a3767009d2";
const url = "https://newsapi.org/v2/everything?q=";
const dropList = document.querySelectorAll(".drop-list .select-box select");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".to select");
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_code){
        let selected;
        if(i == 0){
            selected = currency_code == "USD" ? "selected" : "";
        }else if (i == 1){
            selected = currency_code == "KWD" ? "selected" : "";
        }
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target);
    });
}

fromCurrency.addEventListener("change", () => fetchNews(fromCurrency.value));
toCurrency.addEventListener("change", () => fetchNews(toCurrency.value));

function reload(){
    window.location.reload();
}

function loadFlag(element){
    for (code in country_code){
        if(code == element.value){
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_code[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", () =>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); //preventing from form submitting
    getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () =>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

function getExchangeRate(){
    const amount = document.querySelector(".amount input");
    exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    
    exchangeRateTxt.innerText = "Getting exchange rate...";
    let url = `https://v6.exchangerate-api.com/v6/397bcb245cc54483b9867b35/latest/${fromCurrency.value}`;
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() =>{
        exchangeRateTxt.innerText = "Something went wrong...";
    });
}

document.addEventListener("DOMContentLoaded", () => fetchNews(fromCurrency.value));

async function fetchNews(query){
    const response = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await response.json();
    bindData(data.articles);
}

function bindData(articles){
    const cardsContainer = document.getElementById("news-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    if (!newsCardTemplate) {
        console.error("News template not found");
        return;
    }

    cardsContainer.innerHTML = "";

    articles.slice(0, 5).forEach((article) => {
        if(!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        filldataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function filldataInCard(cardClone, article){
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-content");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsSource.innerHTML = article.description;

    const data = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
        });

        newsSource.innerHTML = ` ${article.source.name} . ${data}`;

}

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value;
    if(!query) return;      
    fetchNews(query);
});
