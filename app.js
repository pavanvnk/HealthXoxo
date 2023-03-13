require('dotenv').config()
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const Chart = require('chart.js')
const ejs = require('ejs')
const moment = require('moment-timezone');
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGOOSE_KEY)

const foodSchema = new mongoose.Schema({
  name: String,
  nutrients: [
    {
      name: String,
      value: Number,
      unit: String
    }
  ],
  date: Date
})

const Food = mongoose.model('Food', foodSchema)

app.get('/', (req, res) => {
  res.render('home.ejs')
})

app.get('/food', (req, res) => {
  res.render('food.ejs')
})

app.get('/nutrient', (req, res) => {
  res.render('nutrient.ejs')
})


app.post('/food', async (req, res) => {
  try {
    const apiKey = process.env.APIKEY;
    const foodItem = req.body.foodName;
    const url = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + apiKey + "&query=" + foodItem;

    const response = (await axios(url)).data
    
    const foodData = response.foods[0];
    const nutrients = foodData.foodNutrients.map(nutrient => {
      return {
        name: nutrient.nutrientName,
        value: nutrient.value,
        unit: nutrient.unitName
      };
    });

    const food = new Food({
      name: foodData.description,
      nutrients: nutrients,
      date: new Date()
    })

    await food.save()
    res.render('nutrient.ejs')

    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving food item.' });
  }
  
})

app.get('/chart', async (req, res) => {
  const todayDate = req.query.date;
  const istDate = moment.tz(todayDate, 'Asia/Kolkata');
  const startOfDayUtc = istDate.clone().startOf('day').utc().toDate();
  const endOfDayUtc = istDate.clone().endOf('day').utc().toDate();
  const nutrientItem = req.query.nutrientName;
    
  const data = await Food.aggregate([
    { $match: { date: { $gte: startOfDayUtc, $lte: endOfDayUtc } } },
    { $unwind: "$nutrients" },
    { $match: { "nutrients.name": nutrientItem } },
    {
      $group: {
        _id: '$name',
        calories: { $sum: '$nutrients.value' },
        unit: {$first: '$nutrients.unit'}
      },
    },
  ]);
  
  const labels = data.map(item => item._id);
  const length_items = labels.length;
  const values = data.map(item => item.calories);
  const units = data.map(item => item.unit)
  
  if(Object.keys(labels).length === 0) {
    res.render('error.ejs')
  }

  res.render('chart', {lbl : labels, dt : values, ut: units, name: nutrientItem, lt: length_items, td: todayDate})
});


app.listen(3000, () => {
  console.log('Server started on port 3000.');
});