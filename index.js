const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const connectDB = require('./utils/database');
const { ItemModel, UserModel } = require('./utils/schemaModels');
const jwt = require('jsonwebtoken');
const auth = require('./utils/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

///// ITEM functions /////
// Create Item
app.post('/item/create', auth, async (req, res) => {
  try {
    await connectDB();
    await ItemModel.create(req.body);
    return res.status(200).json({ message: 'Success to create item' });
  } catch (err) {
    return res.status(400).json({ massage: 'Fail to create item' });
  }
});
// Read All Items
app.get('/', async (req, res) => {
  try {
    await connectDB();
    allItems = await ItemModel.find();
    return res
      .status(200)
      .json({ message: 'Success to get all items', allItems: allItems });
  } catch (err) {
    return res.status(400).json({ message: 'Fail to get all items' });
  }
});
// Read Single Item
// prettier-ignore
app.get("/item/:id", async(req, res) => {
  try {
    await connectDB();
    console.log(req.params.id);
    singleItem = await ItemModel.findById(req.params.id)
    return res.status(200).json({ message: 'Success to get the item' , singleItem: singleItem});
  } catch (err) {
    return res.status(400).json({ message: 'Fail to get the item' });
  }
});
// Update Item
app.put('/item/update/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const singleItem = await ItemModel.findById(req.param.id);
    //Item作成者と変更しようとしているログインユーザーが同一emailの場合のみ編集を許可
    if (singleItem.email === req.body.email) {
      await ItemModel.updateOne({ _id: req.params.id }, req.body);
      return res.status(200).json({ message: 'Success to update the item' });
    } else {
      throw new Error();
    }
  } catch (err) {
    return res.status(400).json({ message: 'Fail to update the item' });
  }
});
// Delete Item
app.delete('/item/delete/:id', auth, async (req, res) => {
  try {
    await connectDB();
    deleteItem = ItemModel.findById(req.params.id);
    if (deleteItem.email === req.body.email) {
      await ItemModel.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: 'Success to delete the item' });
    } else {
      throw new Error();
    }
  } catch (err) {
    return res.status(400).json({ message: 'Fail to delete the item' });
  }
});
///// USER functions /////
// Resister User
app.post('/user/register', async (req, res) => {
  try {
    await connectDB();
    await UserModel.create(req.body);
    return res.status(200).json({ message: 'Success to create user' });
  } catch (err) {
    return res.status(400).json({ message: 'Fail to create user' });
  }
});
// Login User
const secret_key = 'mern_market';
app.post('/user/login', async (req, res) => {
  try {
    await connectDB();
    const saveUserData = await UserModel.findOne({ email: req.body.email });
    if (saveUserData) {
      if (req.body.password === saveUserData.password) {
        const payload = {
          email: req.body.email,
        };
        const token = jwt.sign(payload, secret_key, { expiresIn: '23h' });
        console.log(token);
        return res.status(200).json({ message: 'Success to login' });
      } else {
        return res
          .status(400)
          .json({ message: 'Login failed: password is incorrect' });
      }
    } else {
      return res
        .status(400)
        .json({ message: 'Login failed: email address is not registered' });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Login failed: something wrong...' });
  }
});

// Connecting to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on localhost port ${port}`);
});
