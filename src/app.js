const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../tamplates/views')
const partialsPath = path.join(__dirname, '../tamplates/partials')

// Setup hanglebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Alex Kozachok'
    })
})


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Alex Kozachok'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'This is a help page',
        name: 'Alex Kozachok'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address!"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
           return res.send({ error })
        }
            forecast(latitude, longitude, (error, forecastData) => {
                    if(error){
                        return res.send({ error })
                    }
                res.send({
                    location,
                    forecast: forecastData,
                    address: req.query.address
                })
            })
        
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404-page', {
        errorMessage: 'Help article not found.',
        title: '404',
        name: 'Alex Kozachok'
    })
})

app.get('*', (req, res) => {
    res.render('404-page', {
        errorMessage: 'Page not found.',
        title: '404',
        name: 'Alex Kozachok'
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})