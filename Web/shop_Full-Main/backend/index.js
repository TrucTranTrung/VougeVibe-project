const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
// Database Connection With MongoDB
mongoose.connect("mongodb+srv://admin:admin@cluster0.3ewmz.mongodb.net/");


// //Image Storage Engine 
// const storage = multer.diskStorage({
//   destination: './upload/images',
//   filename: (req, file, cb) => {
//     return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//   }
// })
// const upload = multer({ storage: storage })
// app.post("/upload", upload.single('product'), (req, res) => {
//   res.json({
//     success: 1,
//     image_url: `/images/${req.file.filename}`
//   })
// })


// // Route for Images folder
// const { S3Client } = require('@aws-sdk/client-s3');
// const { Upload } = require('@aws-sdk/lib-storage');
// const multerS3 = require('multer-s3');
// require('dotenv').config();
// // Cấu hình AWS SDK
// const s3Client = new S3Client({
//   region: 'ap-southeast-2',
//   credentials: {
//     accessKeyId: '',
//     secretAccessKey: ,
//   },
// });

// // Cấu hình multer với multer-s3
// const upload = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: 'imageshop',
//     acl: 'public-read',
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     }, 
//     key: (req, file, cb) => {
//       cb(null, path.parse(file.originalname).name + "_" +Date.now().toString()  + path.extname(file.originalname));
//     }
//   })
// });

// // Định nghĩa endpoint upload
// app.post('/upload', upload.array('product', 10), (req, res) => {
//   console.log("uploadImage");
//   res.json({
//     success: 1,
//     image_url: req.files.map(image => image.location)
//   });
// });

const firebase = require('./firebase')


const upload = multer({
  storage: multer.memoryStorage()
})

app.post('/upload', upload.array('product', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('Error: No files found');
  }

  const uploadPromises = req.files.map((file) => {
    const fileName = `${path.parse(file.originalname).name}_${Date.now().toString()}${path.extname(file.originalname)}`;
    const blob = firebase.bucket.file(fileName);
 
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobWriter.on('error', (err) => {
        console.error(err);
        reject(err);
      });

      blobWriter.on('finish', async () => {
        // Thiết lập quyền truy cập công khai
        await blob.makePublic();
        
        const publicUrl = `https://storage.googleapis.com/${firebase.bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobWriter.end(file.buffer);
    });
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    res.json({
      success: 1,
      image_url: imageUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Upload failed.');
  }
});






// MiddleWare to fetch user from token
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};


// Schema for creating user model
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now() },
});


// Schema for creating Product
const Product = mongoose.model("Product", {
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: [String],
  sex: { type: String, required: true },
  category: { type: String, require: true },
  new_price: { type: Number },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  avilable: { type: Boolean, default: true },
});

// Schema for creating Category
const Category = mongoose.model("Categorys", {
  title: { type: String , required: true}
})















// add image 
app.get("/allimages", async (req, res) =>{
  let product = await Product.find({}, {image:1, _id:0});
  let images = product.map(item => (
    item.image
  ))
  res.send(images.flat())
})



// findbyImage
app.post("/findproductbyimg", async (req, res) =>{
  let data ="/" + req.body.images.map(item => item.replace(".", "\.")).join("|") +"/";
  let product2 = await Product.find({sex: req.body.gender, image: {$elemMatch: {$regex: data}}})
  res.send(product2)
})

 
app.get("/allimages/detect", async (req, res) =>{
  
  let categorys = req.body.category
  let gender = req.body.gender
  let data = []
  console.log(categorys)
  console.log(gender)
  if(categorys.length > 0  && gender !== "" )
    data = await Product.find({ category: {$in : categorys }, sex: gender }, {image:1, _id:0});
  else 
    if( categorys.length > 0 && gender === "")
      data = await Product.find({ category: {$in : categorys }  }, {image:1, _id:0});
    else 
      if( categorys.length < 1 && gender !== "")
        data  = await Product.find({ sex: gender  }, {image:1, _id:0});
  
  let transformedData = []
  if(data.length > 0){
    transformedData = data.flatMap(item =>
      item.image
    );
    console.log("/api/allimages/detect")
    res.send(transformedData)
  }else 
    res.send([])
})















// ROOT API Route For Testing
app.get("/", (req, res) => {
  res.send("Root");
});


// Create an endpoint at ip/login for login the user and giving auth-token
app.post('/login', async (req, res) => {
  console.log("Login");
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      success = true;
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success, token });
    }
    else {
      return res.status(400).json({ success: success, errors: "please try with correct email/password" })
    }
  }
  else {
    return res.status(400).json({ success: success, errors: "please try with correct email/password" })
  }
})


//Create an endpoint at ip/auth for regestring the user & sending auth-token
app.post('/signup', async (req, res) => {
  console.log("Sign Up");
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: success, errors: "existing user found with this email" });
  }
  let cart = {};
  cart[1] = 0;
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id
    }
  }

  const token = jwt.sign(data, 'secret_ecom');
  success = true;
  res.json({ success, token })
})


// endpoint for getting all products data
app.get("/allproducts/:type", async (req, res) => {
  let type = req.params.type.toUpperCase();
  let products = (type !== "ALL" ? await Product.find({ sex: type }) : await Product.find());
  console.log("All Products " + type);
  res.send(products);
});



// endpoint for getting latest products data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(0).slice(-8);
  console.log("New Collections");
  res.send(arr);
});

 
// endpoint for getting womens products data
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ sex: "FEMALE" });
  let arr = products.splice(0, 4);
  console.log("Popular In Women");
  res.send(arr);
});

// endpoint for getting womens products data
app.post("/relatedproducts", async (req, res) => {
  console.log("Related Products");
  const {category, sex} = req.body;
  const products = await Product.find({ category, sex });
  const arr = products.slice(0, 4);
  res.send(arr);
});


// Create an endpoint for saving the product in cart
app.post('/addtocart', fetchuser, async (req, res) => {
  console.log("Add Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  if(isNaN(userData.cartData[req.body.itemId]) || userData.cartData[req.body.itemId] === null || userData.cartData[req.body.itemId] === undefined) 
    userData.cartData[req.body.itemId] = 1;
  else userData.cartData[req.body.itemId]++;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added")
})


// Create an endpoint for removing the product in cart
app.post('/removefromcart', fetchuser, async (req, res) => {
  console.log("Remove Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] != 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
})


// Create an endpoint for getting cartdata of user
app.post('/getcart', fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);

})


// Create an endpoint for adding products using admin panel
app.post("/addproduct", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    sex: req.body.sex,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name })
});


// Create an endpoint for removing products using admin panel
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name })
});

// Starting Express Server
app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});