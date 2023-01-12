const socket = io("http://localhost:8080")
let arrayProductos = []
document.getElementById("send").addEventListener("click", postProduct)

function postProduct()  {
  let product = {
  "title" : document.getElementById("title").value,
  "description" : document.getElementById("description").value,
  "category" : document.getElementById("category").value,
  "price" : document.getElementById("price").value,
  "stock" : document.getElementById("stock").value,
  }

  socket.emit("newProduct", product)

}

function eliminarProducto(id) {
  console.log(id)
  socket.emit("eliminarProducto", id)
}

socket.on("arrayProductos", data => {
  let historial = document.getElementById("history")
  historial.innerHTML = ""

  data.forEach(element => {
    historial.innerHTML += `
                    <tr>
                    <td> ${element.title} </td>
                    <td>${element.description}</td>
                    <td>${element.categoria}</td>
                    <td>$ ${element.price}</td>
                    <td>${element.stock} Unidades</td>
                    </tr>
                    <button onclick="eliminarProducto(${element.id})">Eliminar</button>
    `
  })
})

