import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext'; 
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removePizza, catchPizza } = useContext(CartContext);
  const { token } = useContext(UserContext);
  const [message, setMessage] = useState('');

  const handleRemove = (id) => {
    removePizza(id);
  };

  const handleAdd = (pizza) => {
    catchPizza(pizza);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, pizza) => acc + pizza.totalPrice, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  const handleCheckout = async () => {
    if (!token) {
      setMessage('Necesitas iniciar sesión para realizar una compra.');
      return;
    }

    if (cart.length === 0) {
      setMessage('El carrito está vacío. Agrega productos antes de pagar.');
      return;
    }

    try {
      const response = await fetch("https://api-pizza-h857.onrender.com/api/checkouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart: cart,
        }),
      });

      if (response.ok) {
        setMessage('Compra realizada con éxito. ¡Gracias por tu compra!');
      } else {
        const errorData = await response.json();
        setMessage(`Error al realizar la compra: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('Error al conectarse al servidor. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Carrito de Compras</h2>
      
      {message && <div className="alert alert-info">{message}</div>}
      
      {cart.length === 0 ? (
        <div className="alert alert-warning text-center">
          No hay productos en el carrito.
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <h4>Total Compra: {calculateTotal()}</h4>
              <button 
                className="btn btn-success btn-lg" 
                onClick={handleCheckout}
                disabled={!token}
              >
                Pagar
              </button>
            </div>
          </div>
          
          <div className="row">
            {cart.map((pizza) => (
              <div key={pizza.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <img src={pizza.img} className="card-img-top" alt={pizza.name} />
                  <div className="card-body d-flex flex-column">
                    <h4 className="card-title">{pizza.name}</h4>
                    <p className="card-text"><strong>Ingredientes:</strong></p>
                    <ul>
                      {pizza.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    <p className="card-text"><strong>Precio:</strong> ${pizza.price.toLocaleString('es-CL')}</p>
                    <p className="card-text"><strong>Total:</strong> ${(pizza.totalPrice || 0).toLocaleString('es-CL')}</p>
                    <p className="card-text"><strong>Cantidad:</strong> {pizza.quantity}</p>
                    <div className="mt-auto">
                      <button className="btn btn-danger btn-sm mx-2" onClick={() => handleRemove(pizza.id)}>Eliminar uno</button>
                      <button className="btn btn-success btn-sm" onClick={() => handleAdd(pizza)}>Añadir uno</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Link to="/" className="btn btn-primary">Volver a Home</Link>
    </div>
  );
};

export default CartPage;