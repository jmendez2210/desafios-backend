
document.getElementById("newCart").addEventListener('submit', async (event) => {
  event.preventDefault()
  console.log("Creando carrito")
  let result;
  await fetch(`/api/carts`, {// 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        iziToast.success({
          title: "Nuevo carrito creado"
        })
        setTimeout(() => {
          window.location.href = "/api/carts"
        }, 1300);
      } else {
        result = response
        return response.json()
      }
    }
    )
    .then(data => {
      if (!result.ok) {
        iziToast.error({
          title: "Ha ocurrido un problema",
          message: data.message
        })
      }
    })
})

const purchaseButtons = document.querySelectorAll('#purchaseButton');
purchaseButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    event.preventDefault()
    const cid = event.target.dataset.id
    let result;
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
  });
});