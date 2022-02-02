const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      itemSubtotal: {
        type: Number,
        required: true
      }
    }],
    totalPrice: {
      type: Number,
      required: true
    }
  },
})

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString()
  })
  let newQuantity = 1
  let currentTotal = this.cart.totalPrice || 0
  const updatedCartItems = [...this.cart.items]

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1
    updatedCartItems[cartProductIndex].quantity = newQuantity
    updatedCartItems[cartProductIndex].itemSubtotal = newQuantity * product.price

  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
      itemSubtotal: product.price
    })
  }

  const updatedCart = {
    items: updatedCartItems,
    totalPrice: currentTotal + product.price
  }
  this.cart = updatedCart
  return this.save()
}

userSchema.methods.removeFromCart = function (productId) {
  const itemsToDelete = this.cart.items.filter(item => {
    return item.productId.toString() === productId.toString()
  })
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString()
  })
  const updatedPrice = this.cart.totalPrice - itemsToDelete[0].itemSubtotal
  this.cart.items = updatedCartItems
  this.cart.totalPrice = updatedPrice
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = {
    items: [],
    totalPrice: 0
  }
  return this.save()
}

module.exports = mongoose.model('User', userSchema)