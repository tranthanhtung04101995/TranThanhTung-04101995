var express = require('express');
var router = express.Router();
var axios = require("axios").default;
var global = require('../config/global');

// muốn vào feedback phải đăng nhập vào lock
router.get('/', async function (req, res) {
    
    let worldpopulation = {};
    let allcountriesname = []
    let data = []
    await axios.request(linkApi("worldpopulation")).then(function (response) {
        response.data.body.world_population = convertNumber(response.data.body.world_population)
        worldpopulation = response.data.body;
    }).catch(function (error) {
        res.status(400);
    });

    await axios.request(linkApi("allcountriesname")).then(function (response) {
        allcountriesname = response.data.body.countries
    }).catch(function (error) {
        res.status(400);
    });

    const top20 = allcountriesname.slice(0, 20) 
    for(let i = 0; i < 20 ; i++){
        var options = {
            method: 'GET',
            url: 'https://world-population.p.rapidapi.com/population',
            params: {country_name: top20[i]},
            headers: {
                'x-rapidapi-host': global.apiHost,
                'x-rapidapi-key':  global.apiKey
              }
          };
          
        await  axios.request(options).then(function (response) {
            data.push(response.data.body);
          }).catch(function (error) {
              console.error(error);
          });
    }

    res.render('index', {
        title: 'Trang chủ',
        worldpopulation: worldpopulation,
        data: data
    });
});

router.get('/allcountriesname', function (req, res) {
   
    axios.request(linkApi("allcountriesname")).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        res.status(400);
    });
    
});

router.post('/searchCountry',async function (req, res) {
   
    var options = {
        method: 'GET',
        url: 'https://world-population.p.rapidapi.com/population',
        params: {country_name: req.body.country},
        headers: {
            'x-rapidapi-host': global.apiHost,
            'x-rapidapi-key':  global.apiKey
          }
      };
      
    await  axios.request(options).then(function (response) {
        res.send(response.data.body);
    }).catch(function (error) {
        res.status(400);
    });
    
});

function linkApi(url){
    return options = {
        method: 'GET',
        url: 'https://world-population.p.rapidapi.com/' + url,
        headers: {
          'x-rapidapi-host': global.apiHost,
          'x-rapidapi-key':  global.apiKey
        }
      };
}


convertNumber = (number) => {
    return parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

// Exports
module.exports = router;
