import "./css/index.css";
import IMask from "imask"; 

//querySelector -> busque pelo seletor: .classe ou #id ou tag
//> g g:nth-child(1) -> uma tag de primeiro nível(Há outras tags g mas são de outros níveis. Dentro dessa tag queremos acessar o primeiro elemento filho)
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")


function setCardType(type){
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src",`cc-${type}.svg`)
}
setCardType("default");

//Deixando a função global, podemos executá-la no console do navegador
//globalThis.setCardType = setCardType();

//cvc
const securityCode = document.querySelector('#security-code');
console.log(securityCode);
const securityCodePattern = {
  mask:"0000"
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

//data de expiração
const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask:"MM{/}YY",
  blocks: {
    MM: {
      mask:IMask.MaskedRange,
      from:1,
      to:12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear()+10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate,expirationDatePattern);

//Número do cartão
const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask:[
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
],
dispatch: function(appended,dynamicMasked){
  const number = (dynamicMasked.value + appended).replace(/\D/g,"");
  const foundMask = dynamicMasked.compiledMasks.find(function(item){
    return number.match(item.regex);
  })
  console.log(foundMask);
  return foundMask;
},
}
const cardNumberMasked = IMask(cardNumber,cardNumberPattern);

const addButton = document.querySelector('#add-card');
addButton.addEventListener("click",() =>{
  alert("Cartão adicionado!")
})

//desativando o reload do submit/botão
document.querySelector('form').addEventListener("submit",(event) =>{
  event.preventDefault()
})

//Alterando o nome no cartão
const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener("input", ()=>{
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//Eventos do IMask
//O .on observa quando ocorrer o input desse campo
//qundo eu quero capturar o conteúdo "accept" -> quando o conteúdo seguir as regras que definimos nas mask
//cvc
securityCodeMasked.on("accept",() =>{
  updateSecurityCode(securityCodeMasked.value)
})
function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

//Data expiração
expirationDateMasked.on("accept", ()=>{
  updateExpirationDate(expirationDateMasked.value)
})
function updateExpirationDate(date) {
  const ccExpirationDate = document.querySelector(".cc-expiration .value")
  ccExpirationDate.innerText = date.length === 0 ? "02/32" : date
}

//Número do cartão
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})
function updateCardNumber(number) {
  const ccCardNumber = document.querySelector(".cc-number")
  ccCardNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}
