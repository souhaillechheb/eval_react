const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const express = require('express')
const cors = require('cors')
const dbconfig= require('./dbconfig')
const app = express()
const port = 5000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.use(express.json())
const requettes = require('./requettes')
const secret = 'ma-cle-secrete';

app.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email,password)
   // Verifier si un utilisateur avec cet email existe
  // sinon retourner une erreur
  let client =dbconfig.Client
  let sql = 'SELECT * FROM users WHERE email = $1';
  client.query(sql, [email], (error,result) =>{
   if (error){
    console.error("Error checking if user exists: ", error);
    return res.status(500).json({ message: 'Internal server error' });
   }  
   if (result.rows.length > 0) {
    return res.status(409).json({ message: "Email already registered" });
     }
      // si aucun utilisateur existe avec cet email alors
     // Hash du password
    bcrypt.hash(password, 10, (error, hashedPassword) => {
       if (error) {
        console.error("Error hashing password: ", error);
        return res.status(500).json({ message: "Internal server error" });
     }
  // On sauvegarde l'utilisateur avec le mot de pass hashé dans la base de donnée
    const newUser = [req.body.nom, req.body.prenom, req.body.email, hashedPassword]
    const requette="INSERT INTO users (nom, prenom, email, password ) values ($1,$2,$3,$4)"
    client.query(requette,newUser,callback )
    function callback (error,data){
  if (error) {
   console.error("Error saving user: ", error);
   return res.status(500).json({ message: "Internal server error" });
  }
     res.json({message:"User ok"}) }  
   });
   });
  });


   async function checkCredentials(email, password) {
    let client =dbconfig.Client
     const sql = {    
     text: 'SELECT * FROM users WHERE email = $1',    
     values: [email],    
     };        
     const results = await client.query(sql);   
     if (results.rows.length > 0) {
         const user = results.rows[0];    
     const chek = await bcrypt.compare(password, user.password);  
      if (chek) {    
       return user;    
     }    
     }
     return null;
    
   }   
    
    app.post('/login', async (req, res) => {    
    const email = req.body.email;    
    const password = req.body.password; 
    const user = await checkCredentials(email, password);
     console.log(user);    
    if(!user){     
     res.status(403).send('Wrong credentials');    
     }else { 
        const authToken = Math.random().toString();    
        res.cookie('authToken', authToken);    
        res.json({ message: "Login successful", authToken });    
    }    
     });







//produit/////////////////////////////////////////////////



app.get('/get-products', (req, res) => {
    let client =dbconfig.Client
    function callback(err, result) {
        if (err) {
            res.status(500).json({ message: 'Error retrieving data from PostgreSQL' });
        } else {
            
            res.status(200).json(result.rows)

        }
    }
    requettes.getAllProducts(client, callback)
})


app.get('/get_product/:id', (req, res) => {
    let id = req.params.id;
    let client =dbconfig.Client
       requettes.getProductId(client,id,(error,data)=>{
      if(error){
          console.log(error)
          return
        }
        res.json(data.rows)       
    })
        
});

app.post('/Ajoutproduct', (req, res) => {
    let client =dbconfig.Client
    let { name, description, price, stock } = req.body;
    
      let newProduct = {  name, description, price, stock };
      requettes.postProduct(newProduct,client,(error,data)=>{
        if(error){
            console.log(error)
            return
        }});
    
      res.status(201).json(newProduct);
});


app.put('/Updateproducts/:id', (req, res) => {
    let client=dbconfig.Client;
    let id = req.params.id;
    let { name, description, price, stock } = req.body;
    let newProduct1 = { id, name, description, price, stock };  
     requettes.putProduct(id,newProduct1,client, (error,data) => {
      if (error){
        console.log(error)
        res.status(500).send("Erreur lors de la mise à jour du produit");
        return
      }
      res.send("Produit mis à jour avec succès !");
      });
      
});

app.delete('/Deleteproduct/:id', (req, res) => {
    let client=dbconfig.Client 
    let id = req.params.id;
    requettes.deleteProduct(id,client, (error, data) => {
      if (error) {
        console.log(error)
        res.status(500).send("Erreur lors de la suppression du produit");
        return
      }
      res.send('Produit supprimé avec succès !');
    });
    
});







app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })