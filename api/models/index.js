const Users = require('./users.js')
const Products = require('./products.js')

module.exports = {
    users: new Users(),
    products: new Products()
}
