const cards = document.getElementById("cards");
const templateCards = document.getElementById("template-cards").content;
const templateCart = document.getElementById("template-cart").content;
const fragment = document.createDocumentFragment()
const items = document.getElementById("items")


let cart = {};



const fechApi = async () => {
    try {
        const products = await fetch("./api.json");
        const data = await products.json();

        drawCards(data);

    } catch (error) {
        console.log("error")
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fechApi();
    if (localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"));
        renderCart();
    }
    
})


items.addEventListener("click", (e) => {
    renderCart(e);
    btnAction(e)
})

const drawCards = (data) => {
    data.forEach((object) => {
        templateCards.querySelector("h5").textContent = object.title;
        templateCards.querySelector("p").textContent = object.price;
        templateCards.querySelector(".btn-dark").dataset.id = object.id;
        templateCards.querySelector("img").src = object.image;

        const clone = templateCards.cloneNode(true);
        fragment.appendChild(clone);
    });


    cards.appendChild(fragment)
}

cards.addEventListener("click", (e) => {
    addcart(e)
})


const addcart= (e) => {
    if (e.target.classList.contains("btn-dark")){
       setCart(e.target.parentElement) 
    }

}






const setCart = (object) => {
    const product = {
        id: object.querySelector(".btn-dark").dataset.id,
        title: object.querySelector("h5").textContent,
        price: object.querySelector("p").textContent,
        amount: 1,
    };

    if (cart.hasOwnProperty(product.id)) {
        product.amount = cart[product.id].amount + 1;
    }

    cart[product.id] = { ...product }
    renderCart(cart)
    
}

const renderCart = () => {
    Object.values(cart).forEach((product) => {
        items.innerHTML = "";
        templateCart.querySelector("th").textContent = product.id;
        templateCart.querySelector(".btn-success").dataset.id = product.id;
        templateCart.querySelector(".btn-danger").dataset.id = product.id;
        templateCart.querySelectorAll("td")[1].textContent = product.title;
        templateCart.querySelectorAll("td")[2].textContent = product.price;
        templateCart.querySelectorAll("td")[3].textContent = product.amount;
        templateCart.querySelectorAll("td")[4].textContent = product.amount * product.price;
        
        const clone = templateCart.cloneNode(true);
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    localStorage.setItem("cart", JSON.stringify(cart))
} 

const btnAction = (e) => {
    if (e.target.classList.contains("btn-success")) {
        const product = cart[e.target.dataset.id];
        product.amount++;
        cart[product.id] = {...product}
    } 
    if (e.target.classList.contains("btn-danger")) {
        const product = cart[e.target.dataset.id];
        product.amount--;
        if (product.amount === 0) {
            delete cart[product.id]
        } else {
            cart[e.target.dataset.id] = {...product}
        }
    }
    renderCart()
}


localStorage("cart", cart)



