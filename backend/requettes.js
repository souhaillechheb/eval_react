
const { Console } = require('console')




function postUser(newUser, client,callback){
    const requette="INSERT INTO users (nom, prenom, email, password ) values ($1,$2,$3,$4)"
    client.query(requette,newUser,callback )
}



// product
function getAllProducts(client, callback) {    
    const requette = "SELECT *  FROM products";
    client.query(requette, callback);
}


function getProductId(client,[id],callback){   
    const requette="SELECT* from products Where id =$1"
    client.query(requette,[id],callback )
}

function postProduct(product, client,callback){
    let valueproduct=[product.name,product.description,product.price,product.stock]
    const requette="INSERT INTO products (name, description, price, stock ) values ($1,$2,$3,$4)"
    client.query(requette,valueproduct,callback )
}
function putProduct(id,product, client,callback){
    let valueproduct1=[product.name,product.description,product.price,product.stock,id]
    const requette="UPDATE products SET name=$1, description=$2, price=$3, stock=$4 WHERE id=$5"
    client.query(requette,valueproduct1,callback )
}

function deleteProduct(id, client,callback){
    
    const requette="DELETE FROM products WHERE id=$1"
    client.query(requette,[id],callback )
    
}


    



//module.exports.getAllProduct = getAllProduct

module.exports.getProductId = getProductId
module.exports.postProduct = postProduct
module.exports.putProduct = putProduct
module.exports.deleteProduct = deleteProduct
module.exports.getAllProducts = getAllProducts
module.exports.postUser=postUser