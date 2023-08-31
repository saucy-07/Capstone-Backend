const Users = require('./Users')
const Products = require('./products')

module.exports = {
    users: new Users(),
    products: new Products()
}
