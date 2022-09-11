//get DOM elements
import { products } from './db';
const $root = document.querySelector('#root')
const $product = document.querySelector('#product')
const $order = document.querySelector('#order')
const $totalOrder = document.querySelector('#orderTotal')

// variables initializations
let orders = []

//dom listeners
$root.addEventListener('click', (event) => {
    const className = event.target.className

    //capture click add "event" button
    if (className === 'btn-add') {
        const id = event.target.id
        addCart(id)
    }
    if (className === 'btn-remove') {
        const id = event.target.id
        removeCart(id)
    }
})

// app methods

const removeCart = (id) => {
    
    const clearOrders = orders.filter(order => order.id != id)
    console.log(clearOrders)

    orders = [...clearOrders]

    const htmlOrder = orders.map(order => genRowOrder(order)).join('')

    $order.innerHTML = htmlOrder
}
//find product stored in database
const addCart = (id) => {
    const product = products.find(prod => prod.id == id)

    //check if product already exists in order list
    //replace with some method
    const exist = orders.some(prod => prod.id == product.id)

    if (exist) {
        //accumulate amount and price
        const orderExist = orders.find(order => order.id == product.id)
        const accAmount = orderExist.amount+1
        const accSubtotal = orderExist.price * accAmount
        const accOrderProduct = OrderProduct(product, accAmount, accSubtotal)
        //remove old product
        const cleanOrder = orders.filter(order => order.id !== orderExist.id)
        //TODO: remove old order product before
        //update order list
        orders = [...cleanOrder, accOrderProduct]
    }else{
        //update order list with selected product
        const newOrderProduct = OrderProduct(product)
        orders = [...orders, newOrderProduct]
    }
    const createSubtotal = orders.map((sub) => sub.subtotal)

    const toPay = createSubtotal.reduce((prev, current) => prev + current, 0)
        // const toPay = orders.reduce((prev, current) => {
        // console.log(current.subtotal)
        // return prev.subtotal ?? 0 + current.subtotal ?? 0
        // }, 0)
    console.log(toPay)
    
    
    //generate dom elements for print in html
    const htmlOrder = orders.map(order => genRowOrder(order)).join('')
    //render in html    
    $order.innerHTML = htmlOrder
    
    $totalOrder.innerHTML = `$${toPay}`
      
}

const OrderProduct = (product, amount=1, subtotal=null) => {
    return {
        id: product.id,
        name: product.name,
        unit: product.unit,
        units: product.units,
        price: product.price,
        amount: amount,
        subtotal: subtotal ? subtotal : product.price
    }
}

//DOM generators
const genRowTable = (product) => {
    const {name, price, id, img, unit, units} = product
    return (
        `
            <tr>
                <td>${id}</td>
                <td><img class='image' src="${img}" alt=""></td>
                <td>${name}</td>
                <td>${unit}</td>
                <td>${units}</td>
                <td>$${price}</td>
                <td>
                    <button class="btn-add" id="${id}">add</button>
                </td>
            </tr>
        `
    )
}

const genRowOrder = (orderProduct) => {
    const {name, price, /* flavors, */ amount, subtotal, id} = orderProduct
    return(
        `
            <tr>
                <td>${name}</td>
                <td>flavors</td>
                <td>${price}</td>
                <td>${amount}</td>
                <td>${subtotal}</td>
                <td><button class="btn-remove" id="${id}">remove</button></td>
            </tr>
        `
    )
}

//generate html Rows from bd.js
const htmlProducts = products.map(prod => genRowTable(prod)).join('')

//render in DOM
$product.innerHTML = htmlProducts;
