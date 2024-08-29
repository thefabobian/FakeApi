document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartButton = document.getElementById('cart-button');
    const cartCountElement = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.getElementById('close-modal');
    const addProductForm = document.getElementById('add-form');
    const editProductForm = document.getElementById('edit-form');
    const productsList = document.getElementById('products-list');
    const manageProductButton = document.getElementById('manage-product-button');
    const productManagementModal = document.getElementById('product-management-modal');
    const closeManagementModal = document.querySelector('#product-management-modal .close-modal');
    let cart = [];

    // Función para obtener productos de la API
    async function fetchProducts() {
        try {
            const response = await fetch('/products');
            const products = await response.json();
            displayProducts(products);
            populateProductList(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Función para mostrar productos
    function displayProducts(products) {
        productsContainer.innerHTML = products.map(product => `
            <div class="product">
                <img src="/imgs/${product.image.split('/').pop()}" alt="${product.title}">
                <h4>${product.title}</h4>
                <p>${product.description}</p>
                <b><div class="price">Price: $${product.price.toFixed(2)}</div></b>
                <button onclick="addToCart('${product._id}', ${product.price}, '${product.title.replace(/'/g, "\\'")}')">Add to Cart</button>
            </div>
        `).join('');
    }

    // Función para mostrar productos en la lista de administración
    function populateProductList(products) {
        productsList.innerHTML = products.map(product => `
            <li data-id="${product._id}">
                ${product.title} - $${product.price.toFixed(2)}
                <button onclick="editProduct('${product._id}')">Edit</button>
            </li>
        `).join('');
    }

    // Función para agregar productos al carrito
    window.addToCart = function(id, price, title) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, price, title, quantity: 1 });
        }
        updateCart();
    };

    // Función para disminuir la cantidad de productos en el carrito
    window.decreaseQuantity = function(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== id);
            }
            updateCart();
        }
    };

    // Función para aumentar la cantidad de productos en el carrito
    window.increaseQuantity = function(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += 1;
            updateCart();
        }
    };

    // Función para eliminar productos del carrito
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    };

    // Función para actualizar el carrito y mostrar los productos en la ventana modal
    function updateCart() {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <li>
                ${index + 1}. ${item.title} - $${item.price.toFixed(2)} x ${item.quantity}
                <button class="increase" onclick="increaseQuantity('${item.id}')">+</button>
                <button class="decrease" onclick="decreaseQuantity('${item.id}')">-</button>
                <button class="remove" onclick="removeFromCart('${item.id}')">X</button>
            </li>
        `).join('');
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        totalPriceElement.textContent = totalPrice.toFixed(2);
        
        // Actualizar el contador del carrito
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    // Mostrar la ventana modal del carrito al hacer clic en el botón del carrito
    cartButton.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    // Cerrar la ventana modal del carrito al hacer clic en el botón de cerrar
    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Cerrar la ventana modal del carrito al hacer clic fuera de ella
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Función para agregar un nuevo producto
    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addProductForm);
        const newProduct = {
            title: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            image: formData.get('image'),
        };

        try {
            const response = await fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });
            if (response.ok) {
                fetchProducts();
                addProductForm.reset();
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    // Función para editar un producto
    window.editProduct = async function(id) {
        try {
            const response = await fetch(`/products/${id}`);
            const product = await response.json();

            document.getElementById('edit-id').value = product._id;
            document.getElementById('edit-name').value = product.title;
            document.getElementById('edit-description').value = product.description;
            document.getElementById('edit-price').value = product.price;
            document.getElementById('edit-image').value = product.image;
        } catch (error) {
            console.error('Error fetching product for edit:', error);
        }
    };

    // Función para actualizar un producto
    editProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(editProductForm);
        const updatedProduct = {
            title: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            image: formData.get('image'),
        };
        const id = formData.get('id');

        try {
            const response = await fetch(`/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });
            if (response.ok) {
                fetchProducts();
                editProductForm.reset();
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });

    // Función para eliminar un producto
    document.getElementById('delete-button').addEventListener('click', async () => {
        const id = document.getElementById('edit-id').value;

        try {
            const response = await fetch(`/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchProducts();
                editProductForm.reset();
            } else {
                console.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });

    // Mostrar la ventana modal de Product Management al hacer clic en el botón de administración de productos
    manageProductButton.addEventListener('click', () => {
        productManagementModal.style.display = 'block';
    });

    // Cerrar la ventana modal de Product Management al hacer clic en el botón de cerrar
    closeManagementModal.addEventListener('click', () => {
        productManagementModal.style.display = 'none';
    });

    // Cerrar la ventana modal de Product Management al hacer clic fuera de ella
    window.addEventListener('click', (event) => {
        if (event.target === productManagementModal) {
            productManagementModal.style.display = 'none';
        }
    });

    // Cargar productos al iniciar
    fetchProducts();
});
