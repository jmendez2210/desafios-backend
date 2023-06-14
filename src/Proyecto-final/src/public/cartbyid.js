const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
  });
});

const deleteButtons = document.querySelectorAll('#deleteProduct');
deleteButtons.forEach(button => {
  button.addEventListener('click', event => {
    const itemId = event.target.dataset.id;
    let cid = document.getElementById("cid").textContent;
    let result;
    fetch(`/api/carts/${cid}/products/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        console.log(response)
        if (response.ok) {
          iziToast.success({
            title: "Producto eliminado de carrito"
          })
          setTimeout(() => {
            window.location.href = `/api/carts/${cid}`
          }, 1200);
        } else if (response.status !== 200) {
          iziToast.error({
            title: "Ups",
          })
          result = response
          return response.json()
        }
      }
      )
      .then(data => {
        if (!result.ok) {
          iziToast.error({
            title: "Ha ocurrido un error",
            message: data.message
          })
        }
      })
  });
});

function addToCart(productId, quantity) {
  let result = {};
  let cid = document.getElementById("cid").textContent;
  console.log(productId)
  console.log("CID" + cid)
  console.log(quantity)
  fetch(`/api/carts/${cid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pid: productId, quantity })
  })
    .then(response => {
      console.log(response)
      if (response.ok) {
        iziToast.success({
          title: "Producto agregado a carrito"
        })
        setTimeout(() => {
          window.location.href = `/api/carts/${cid}`
        }, 1800);
      } else if (response.status !== 200) {
        iziToast.error({
          title: "Ups",
        })
        result = response
        return response.json()
      }
    }
    )
    .then(data => {
      console.log(data)
      console.log(result)
      if (!result.ok) {
        if (data) {
          iziToast.error({
            title: "Ha ocurrido un error",
            message: data.message
          })

        }
      }
    })
}

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const viewCartLink = document.querySelector('#openModalBtn');

function openModal() {
  modal.style.display = 'block';
  fetchProductList();
  modal.addEventListener('click', closeModal);
  modalContent.addEventListener('click', event => event.stopPropagation());
}

function closeModal() {


  if (event.target === modal) {
    modal.style.display = 'none';
    modal.removeEventListener('click', closeModal);
  }
}

modalClose.addEventListener('click', closeModal);
viewCartLink.addEventListener('click', openModal);
function fetchProductList() {
  fetch('/api/products?json=true')
    .then(response => response.json())
    .then(data => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';

      const table = document.createElement('table');
      table.classList.add('modal-table');
      const thead = document.createElement('thead');
      thead.classList.add("tablehead")
      const tbody = document.createElement('tbody');

      const headerRow = document.createElement('tr');
      const headers = ['Title', 'Description', 'Category', 'Price', 'Stock', 'Cantidad', 'Acciones'];
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      data.docs.forEach(product => {
        const row = document.createElement('tr');
        const { _id, title, description, category, price, stock } = product;

        const cells = [title, description, category, price, stock];
        cells.forEach(cellText => {
          const cell = document.createElement('td');
          cell.textContent = cellText;
          row.appendChild(cell);
        });

        const quantityCell = document.createElement('td');
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 0;
        quantityInput.max = stock;
        quantityInput.value = 0;
        quantityCell.appendChild(quantityInput);
        row.appendChild(quantityCell);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Agregar al carrito';
        addToCartButton.addEventListener('click', () => {
          const quantity = parseInt(quantityInput.value, 10);
          if (quantity > 0 && quantity <= stock) {
            addToCart(_id, quantity);
          }
        });
        const actionsCell = document.createElement('td');
        actionsCell.appendChild(addToCartButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      productList.appendChild(table);
    })
    .catch(error => {
      console.error(error);
    });
}

let rows = document.querySelectorAll("table tbody tr");
let originalQuantity = null;

rows.forEach(function(row) {
  let modifyButton = document.createElement("button");
  modifyButton.innerText = "Modificar Cantidad";
  modifyButton.addEventListener("click", function() {
    toggleRowEdit(row);
  });

  let actionCell = document.createElement("td");
  actionCell.appendChild(modifyButton);

  row.appendChild(actionCell);
});

function toggleRowEdit(row) {
  if (row.classList.contains("editable-row")) {
    sendRowData(row);
    disableRowEdit(row);
  } else {
    enableRowEdit(row);
    darkenOtherRows(row);
  }
}

function enableRowEdit(row) {
  let cells = row.cells;
  for (let i = 0; i < cells.length; i++) {
    if (i === 4) {
      const quantityCell = document.createElement('td');
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.min = 0;
      quantityInput.max = parseInt(cells[5].innerText);
      quantityInput.value = parseInt(cells[i].innerText);

      originalQuantity = cells[i].innerText;

      quantityCell.appendChild(quantityInput);
      cells[i].replaceWith(quantityCell);
    }
  }

  row.classList.add("editable-row");
}

function disableRowEdit(row) {
  let cells = row.cells;
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeAttribute("contenteditable");
  }

  const quantityInput = cells[4].querySelector("input");
  if (quantityInput) {
    const modifiedQuantity = quantityInput.value;
    cells[4].innerText = modifiedQuantity;
  }

  row.classList.remove("editable-row");
  let deactivate = true
  darkenOtherRows(row, deactivate)
}

function darkenOtherRows(row, deactivate) {
  let allRows = document.querySelectorAll("table tbody tr");
  allRows.forEach(function(r) {
    if ((r !== row) && !deactivate) {
      r.classList.add("darkened-row");
    } else {
      r.classList.remove("darkened-row")
    }
  });
}

async function sendRowData(row) {
  console.log("Enviando informacion")
  let cid = document.getElementById("cid").textContent;
  let quantity = parseInt(row.cells[4].querySelector("input").value);
  let pid = row.cells[6].innerText

  let stock = parseInt(row.cells[5].innerText)

  if (quantity > stock) {
    row.cells[4].querySelector("input").value = stock
    quantity = stock
  }

  fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ quantity })
  })
    .then(function(response) {
      console.log(response)
      if (response.ok) {
        iziToast.success({
          title: "Producto modificado exitosamente!"
        })
        setTimeout(() => {
          window.location.href = `/api/carts/${cid}`
        }, 500);
      } else {
        iziToast.error({
          title: "No se ha podido modificar el producto"
        })
        throw new Error("Error en la solicitud");
      }
    })
    .catch(function(error) {
      console.error(error);
    });
}

document.getElementById("purchaseButton").addEventListener('click', async () => {
  let cid = document.getElementById("cid").textContent
  await fetch(`/api/carts/${cid}/purchase`, {// 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => {
      if (response.ok) {
        iziToast.success({
          title: "Carrito adquirido"
        })
        setTimeout(() => {
          window.location.href = "/api/carts"
        }, 2000);
      } else {
        result = response
        return response.json()
      }
    }
    )
    .then(data => {
      if (!result.ok) {
        iziToast.error({
          title: "Ha ocurrido un error",
          message: data.message
        })
      }
    })
})

