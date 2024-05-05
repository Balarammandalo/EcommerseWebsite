import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item

  addCartItem = product => {
    const {id, quantity} = product
    const {cartList} = this.state

    const isTrue = cartList.filter(eachItem => eachItem.id === id)
    if (isTrue.length > 0) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachList => {
          if (eachList.id === id) {
            return {...eachList, quantity: eachList.quantity + quantity}
          }
          return eachList
        }),
      }))
    } else {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const newCart = cartList.filter(eachCart => eachCart.id !== id)
    this.setState({cartList: newCart})
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  incrementCartItemQuantity = id => {
    const {cartList} = this.state
    const newCart = cartList.map(eachCart => {
      if (eachCart.id === id) {
        return {...eachCart, quantity: eachCart.quantity + 1}
      }
      return eachCart
    })
    this.setState({cartList: newCart})
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const newCart = cartList.filter(eachCart => eachCart.id === id)
    const {quantity} = newCart[0]
    if (quantity > 1) {
      const cartItem = cartList.map(eachItem => {
        if (eachItem.id === id) {
          return {...eachItem, quantity: eachItem.quantity - 1}
        }
        return eachItem
      })
      this.setState({cartList: cartItem})
    } else {
      this.removeCartItem(id)
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
