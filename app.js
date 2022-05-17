let cards = document.querySelector(".product-cards");
let card = document.querySelector(".product-cards__card");

let input = document.querySelector("input");
let basket = document.querySelector(".header__basket");
let basketClose = document.querySelector(".basket__nav__close");
let body = document.querySelector("body");
let overlay = document.querySelector(".basket-overlay");
let basketProducts = document.querySelector(".basket__products");
let deleteCart = document.querySelector(".basket__delete__btn");
let sumProducts = document.querySelector(".basket__total__sum");

let popup = document.querySelector(".popup");
let popupTitle = document.querySelector(".popup__title");
let popupImage = document.querySelector("#image");
let popupAttribute = document.querySelector("#attribute");
let popupPrice = document.querySelector("#price-product");
let popupBtn = document.querySelector("#cart");

let prod = [];
let cart = [];

fetch("https://626bea4ce5274e6664d369e2.mockapi.io/product")
  .then((response) => response.json())
  .then((data) => {
    prod = data;
    render(data);
    render(prod);
  });

let localCart = localStorage.getItem("cart");
if (localCart) {
  cart = JSON.parse(localCart);
}
function setLocal(key, value) {
  let string = JSON.stringify(value);
  localStorage.setItem(key, string);
}
var splide = new Splide(".splide", {
  type: "loop",
  perPage: 1,
  perMove: 1,
  autoplay: true,
  pagination: true,
});
splide.mount();
function render(array) {
  cards.innerHTML = " ";
  array.forEach((el) => {
    let prodCard = document.createElement("div");
    prodCard.classList.add("product-cards__card");
    prodCard.setAttribute("product-id", el.id);
    let imageBlock = document.createElement("div");
    imageBlock.classList.add("product-cards__card__image");
    let imageBlockView = document.createElement("div");
    imageBlockView.classList.add("product-cards__card__image__view");
    let text = document.createElement("p");
    text.innerText = "Быстрый просмотр";
    let imageCard = document.createElement("img");
    imageCard.src = ` ${el.image}`;
    let btnCard = document.createElement("button");
    btnCard.setAttribute("product-id", el.id);
    btnCard.classList.add("add-to-cart");

    let priceCard = document.createElement("p");
    priceCard.classList.add("product-cards__card__price");
    priceCard.innerText = `${parseInt(el.price)}$`;
    let priceSaleCard = document.createElement("p");
    priceSaleCard.classList.add("product-cards__card__price-sale");
    priceSaleCard.innerText = `${parseInt(el.price * 1.2)}$`;
    let nameCard = document.createElement("p");
    nameCard.classList.add("product-cards__card__name");
    nameCard.innerText = `${el.name}`;

    imageBlock.append(imageCard);
    imageBlock.append(imageBlockView);
    imageBlockView.append(text);
    imageBlock.append(btnCard);
    prodCard.append(imageBlock);

    prodCard.append(priceCard);
    prodCard.append(priceSaleCard);
    prodCard.append(nameCard);

    cards.append(prodCard);
  });
}
function addToCart(el) {
  let productId = el.getAttribute("product-id");
  let product = prod.find((e) => e.id == productId);
  cart.push(product);
  setLocal("cart", cart);
}
function renderCart() {
  basketProducts.innerHTML = " ";
  cart.forEach((el) => {
    let prodCard = document.createElement("div");
    prodCard.classList.add("basket__products__elem");

    let button = document.createElement("button");
    button.innerText = "×";
    button.classList.add("remove");
    button.setAttribute("product-id", el.id);

    let text = document.createElement("p");
    text.innerText = `${el.name}     ${Math.floor(el.price * 100) / 100}$`;
    let wrapperImg = document.createElement("div");
    wrapperImg.classList.add("basket__products__elem__img");
    let image = document.createElement("img");
    image.src = `${el.image}`;

    prodCard.append(button);
    prodCard.append(text);
    prodCard.append(wrapperImg);
    wrapperImg.append(image);

    basketProducts.append(prodCard);
  });
  sumProducts.innerText = `${summ()} $`;
}
function deleteAllCart() {
  cart.length = 0;
  setLocal("cart", cart);
  renderCart();
}
function summ() {
  return cart.reduce((accum, item) => accum + Number(item.price), 0);
}
input.addEventListener("input", ({ target }) => {
  let newArray = prod.filter((el) => {
    let array = el.name;
    return array.toLocaleLowerCase().includes(target.value);
  });
  render(newArray);
});
basket.addEventListener("click", () => {
  body.classList.add("basket-opened");
  renderCart();
});
basketClose.addEventListener("click", () =>
  body.classList.remove("basket-opened")
);
overlay.addEventListener("click", () => {
  body.classList.remove("basket-opened"), body.classList.remove("popup-opened");
});
cards.addEventListener("click", (e) => {
  let target = e.target;
  if (target.tagName === "BUTTON") {
    addToCart(target);
  }
});
deleteCart.addEventListener("click", deleteAllCart);
basketProducts.addEventListener("click", (e) => {
  let target = e.target;
  if (target.tagName === "BUTTON") {
    let product = target.getAttribute("product-id");
    let item = cart.find((e) => e.id == product);
    cart.splice(cart.indexOf(item), 1);
    setLocal("cart", cart);
    target.parentElement.remove();
    sumProducts.innerText = `${summ()} $`;
  }
});
window.addEventListener("load", () => renderCart());
cards.addEventListener("click", (e) => {
  let target = e.target;
  if (target.classList.contains("product-cards__card__image__view")) {
    body.classList.add("popup-opened");
    let cardId = target.parentElement.parentElement.getAttribute("product-id");
    let item = prod.find((el) => el.id == cardId);
    popupTitle.innerText = `${item.name}`;
    popupAttribute.innerText = `Артикул: ${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    popupImage.src = `${item.image}`;
    popupPrice.innerText = `${parseInt(item.price)} $`;
    popupBtn.setAttribute("product-id", item.id);
  }
  if (target.tagName === "P") {
    body.classList.add("popup-opened");
    let cardId =
      target.parentElement.parentElement.parentElement.getAttribute(
        "product-id"
      );
    let item = prod.find((el) => el.id == cardId);
    popupTitle.innerText = `${item.name}`;
    popupAttribute.innerText = `Артикул: ${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    popupImage.src = `${item.image}`;
    popupPrice.innerText = `${parseInt(item.price)} $`;
    popupBtn.setAttribute("product-id", item.id);
  }
});
popup.addEventListener("click", (e) => {
  let target = e.target;
  if (target.tagName === "BUTTON") {
    addToCart(target);
    body.classList.remove("popup-opened");
  }
});
