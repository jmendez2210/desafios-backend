class ProductManager {
  
    constructor() {
      this.products = [];
    }
  
    addProductos(title, descripcion, precio, thumbnail, code, stock) {
    if (title != "" && descripcion != "" && precio != "" && thumbnail != "" && code != "" ) {
        let productos = {
          title,
          descripcion,
          precio,
          thumbnail,
          stock,
          code, 
        };

        if (this.products.length === 0) {
          productos["id"] = 1;
          this.products.push(productos);
        } else {
            let validarCode = this.products.find(productos => productos['code']===code);
            if (!validarCode) {
                productos["id"] = this.products[this.products.length - 1]["id"] + 1;
                this.products.push(productos);
            } else {
                console.log("el producto ya se encuentra seleccionado");
            }
        }
    
      } 
    };


    getProducts() {
        return this.products;
      }




    getProductById(id) {
      let product = this.products.find((productos) => productos['id'] === id);
      if (product != null ) {
        return product;
        }else{
        console.log("Product not found");
        return null;
    }
  };
  
  };


  //Prueba ejercicios
 


let productos = new ProductManager();
console.log(productos.getProducts());
let titulo = "MARCAS"
let descripcion = "Este es un producto de prueba"
let precio = 2000;
let img = "sin imagenes"
let code = "code-001"
let stock = 10;
productos.addProductos(titulo, descripcion, precio, img, code, stock);
console.log(productos.getProducts());
productos.addProductos(titulo, descripcion, precio, img, code, stock);
let id = 1;
console.log(productos.getProductById(id));
id = 2;
productos.getProductById(id);