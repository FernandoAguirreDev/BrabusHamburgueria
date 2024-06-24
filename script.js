const containerMenu = document.getElementById('containerMenuGeral')
const containerBebidas = document.getElementById('containerBebidasGeral')
const modal = document.getElementById("modal")
const itens = document.getElementById("itens-carrinho")
const totalPrice = document.getElementById("total")
const numberItens = document.getElementById("numberItens")
const address = document.getElementById("address")
const addressError = document.getElementById("addressError")
const date = document.getElementById("date")
const pedidoFinalizado = document.getElementById("finalizarPedido")


const itensCarrinho = []



verCarrinho = () => {
    modal.style.display = "flex"
}

closeModal = () => {
    modal.style.display = "none"
}


containerMenu.addEventListener('click', function (event) {
    let parentButton = event.target.closest(".add")

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price)
    }
})

containerBebidas.addEventListener('click', function (event) {
    let parentButton = event.target.closest(".add")

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        addToCart(name, price)
    }
})

addToCart = (name, price) => {
    const existItem = itensCarrinho.find(item => item.name === name)


    if (existItem) {
        existItem.quantity += 1

    } else {
        itensCarrinho.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateModal()
}

updateModal = () => {
    itens.innerHTML = "";

    let total = 0


    itensCarrinho.forEach(item => {
        const cartElement = document.createElement("div")
        const priceItens = item.price * item.quantity
        const priceReal = priceItens.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

        cartElement.innerHTML =
            `
            <div>
                <div class="containerModalItens">
                    <div>
                        <p class="name">${item.name}</p>
                        <p class="quantity">Quantidade: <span>${item.quantity}</span></p>
                        <p class="price">${priceReal}</p>
                   </div>
            
                    <div>
                        <button onClick="somarQtd('${item.name}')">▲</button>
                        
                        <button onclick="menosQtd('${item.name}')">▼</button>
                    </div>
                </div>
            </div>
        `

        somaPrice(item)
        somaQuantity(item)
        itens.appendChild(cartElement)
    })

}

somarQtd = (name) => {
    const index = itensCarrinho.findIndex(item => item.name === name)

    if (index !== -1) {
        itensCarrinho[index].quantity++
    }
    updateModal()
}

menosQtd = (name) => {
    const index = itensCarrinho.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = itensCarrinho[index]

        if (item.quantity > 1) {
            item.quantity--
        } else {
            excluirItem(item.name)
        }

        updateModal()
    }
}

somaPrice = (item) => {
    let somaPrice = 0

    itensCarrinho.forEach(item => {
        if (item) {
            somaPrice += parseFloat(item.price * item.quantity)
        }
        totalPrice.innerHTML = somaPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    })
    if (!item) {
        totalPrice.innerHTML = "R$ 0,00"
    }
}

somaQuantity = (item) => {
    let somaQuantity = 0

    itensCarrinho.forEach(item => {
        if (item) {
            somaQuantity += parseFloat(item.quantity)
        }
    })
    numberItens.innerHTML = somaQuantity

    numberItens.style.display = "flex"

    numberItens.style.transition = "transform 0.3s"
    numberItens.style.transform = "scale(2)"

    setTimeout(() => {
        numberItens.style.transform = "scale(1)"
    }, 300);

    if (!item) {
        numberItens.style.display = "none"
    }
}

excluirItem = (name) => {
    const index = itensCarrinho.findIndex(item => item.name === name)

    if (index !== -1) {
        itensCarrinho.splice(index, 1);
    }
    somaPrice()
    somaQuantity()
    updateModal()
}

finalizarPedido = () => {
      const isOpen = checkRestaurantOpen()
      if(!isOpen){
          alert("RESTAURANTE FECHADO NO MOMENTO")
      }
          

    if (itensCarrinho.length === 0) return

    let endereço = address.value

    if (endereço === '') {
        addressError.style.display = "flex"
        address.style.border = "2px solid red"
        return
    }

    let total = 0
    const carrinho = itensCarrinho.map((item) => {
        const itemPrice = item.price * item.quantity
        total += itemPrice
        return `|| ${item.name} Quantidade: (${item.quantity}) Preço: ${itemPrice} `
    }).join("")

    const carrinhoTotal = `${carrinho} ||| TOTAL: ${total}`

    const message = encodeURIComponent(carrinhoTotal)
    const phone = "5551980430696"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${address.value}`, "_blank")

    recarregarPagina()
}

inputAddress = () => {
    addressError.style.display = "none"
    address.style.border = "none"

}

checkRestaurantOpen = () => {
    const data = new Date()
    const dia = data.getDay()
    const hora = data.getHours()

    return dia !== 5 && hora >= 18 && hora < 23
}

const isOpen = checkRestaurantOpen()

if (isOpen) {
    date.style.backgroundColor = "rgb(52, 180, 37)"
} else {
    date.style.backgroundColor = "rgb(182, 61, 37)"
}

function recarregarPagina() {
    window.scrollTo(0, 0);
    location.reload();
}