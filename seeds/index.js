const mongoose= require('mongoose')
const Camp= require('../models/camp_sch');
const cities= require('./cities');
const {descriptors, places}= require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp_camps')

const db= mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", ()=>{
    console.log("Database Connected")
})

function sample(arr){
   return  arr[Math.floor(Math.random()* arr.length)]
}

const db_imp=async()=>{
    await Camp.deleteMany({})
    let random;
    let price;
    for (let i=0; i<200; i++ ){
        random= Math.floor(Math.random()*1000)
        price= Math.floor(Math.random()*20)+10
        const camp= new Camp({location:`${cities[random].city}, ${cities[random].state}`,
            title: `${sample( descriptors)} ${sample(places)}`,
            price: `${price}`,
            description:`Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima in neque mollitia facilis molestias animi adipisci et, ducimus non dolores blanditiis consequuntur eligendi ex dolorem quidem illo minus explicabo. Esse!`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dx7nxtuxx/image/upload/v1735134324/YelpCamp/p4lpyudjhzczegegbrg7.jpg',
                    imgname: 'YelpCamp/p4lpyudjhzczegegbrg7'
                  },
                  {
                    url: 'https://res.cloudinary.com/dx7nxtuxx/image/upload/v1735134326/YelpCamp/xax9j66yuj94qrefegu0.jpg',
                    imgname: 'YelpCamp/xax9j66yuj94qrefegu0'
                  }
            ],
            author: '6767ce9f247b98393490e776',
            geometry: {
                type: "Point",
                coordinates: [cities[random].longitude ,cities[random].latitude]
            }
        })
        await camp.save()
    }

}

db_imp()
