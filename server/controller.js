require('dotenv').config();
const { CONNECTION_STRING } = process.env;

const Sequelize = require('sequelize');
// const { SELECT, INSERT } = require("sequelize/types/query-types");

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
          rejectUnauthorized: false
      }
  }

});


module.exports = {
    seed: (req, res) => {
        sequelize.query(
            `
    
            DROP TABLE IF EXISTS cities;
            DROP TABLE IF EXISTS countries;

            CREATE TABLE countries (
                country_id SERIAL PRIMARY KEY, 
                name VARCHAR NOT NULL
            );

            CREATE TABLE cities(
                city_id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL, 
                rating INT NOT NULL,
                country_id INT REFERENCES countries(country_id)
            );
            insert into countries (name)
            values ('Afghanistan'),
            ('Albania'),
            ('Algeria'),
            ('Andorra'),
            ('Angola'),
            ('Antigua and Barbuda'),
            ('Argentina'),
            ('Armenia'),
            ('Australia'),
            ('Austria'),
            ('Azerbaijan'),
            ('Bahamas'),
            ('Bahrain'),
            ('Bangladesh'),
            ('Barbados'),
            ('Belarus'),
            ('Belgium'),
            ('Belize'),
            ('Benin'),
            ('Bhutan'),
            ('Bolivia'),
            ('Bosnia and Herzegovina'),
            ('Botswana'),
            ('Brazil'),
            ('Brunei'),
            ('Bulgaria'),
            ('Burkina Faso'),
            ('Burundi'),
            ('Côte d''Ivoire'),
            ('Cabo Verde'),
            ('Cambodia'),
            ('Cameroon'),
            ('Canada'),
            ('Central African Republic'),
            ('Chad'),
            ('Chile'),
            ('China'),
            ('Colombia'),
            ('Comoros'),
            ('Congo'),
            ('Costa Rica'),
            ('Croatia'),
            ('Cuba'),
            ('Cyprus'),
            ('Czech Republic'),
            ('Democratic Republic of the Congo'),
            ('Denmark'),
            ('Djibouti'),
            ('Dominica'),
            ('Dominican Republic'),
            ('Ecuador'),
            ('Egypt'),
            ('El Salvador'),
            ('Equatorial Guinea'),
            ('Eritrea'),
            ('Estonia'),
            ('Eswatini'),
            ('Ethiopia'),
            ('Fiji'),
            ('Finland'),
            ('France'),
            ('Gabon'),
            ('Gambia'),
            ('Georgia'),
            ('Germany'),
            ('Ghana'),
            ('Greece'),
            ('Grenada'),
            ('Guatemala'),
            ('Guinea'),
            ('Guinea-Bissau'),
            ('Guyana'),
            ('Haiti'),
            ('Holy See'),
            ('Honduras'),
            ('Hungary'),
            ('Iceland'),
            ('India'),
            ('Indonesia'),
            ('Iran'),
            ('Iraq'),
            ('Ireland'),
            ('Israel'),
            ('Italy'),
            ('Jamaica'),
            ('Japan'),
            ('Jordan'),
            ('Kazakhstan'),
            ('Kenya'),
            ('Kiribati'),
            ('Kuwait'),
            ('Kyrgyzstan'),
            ('Laos'),
            ('Latvia'),
            ('Lebanon'),
            ('Lesotho'),
            ('Liberia'),
            ('Libya'),
            ('Liechtenstein'),
            ('Lithuania'),
            ('Luxembourg'),
            ('Madagascar'),
            ('Malawi'),
            ('Malaysia'),
            ('Maldives'),
            ('Mali'),
            ('Malta'),
            ('Marshall Islands'),
            ('Mauritania'),
            ('Mauritius'),
            ('Mexico'),
            ('Micronesia'),
            ('Moldova'),
            ('Monaco'),
            ('Mongolia'),
            ('Montenegro'),
            ('Morocco'),
            ('Mozambique'),
            ('Myanmar'),
            ('Namibia'),
            ('Nauru'),
            ('Nepal'),
            ('Netherlands'),
            ('New Zealand'),
            ('Nicaragua'),
            ('Niger'),
            ('Nigeria'),
            ('North Korea'),
            ('North Macedonia'),
            ('Norway'),
            ('Oman'),
            ('Pakistan'),
            ('Palau'),
            ('Palestine State'),
            ('Panama'),
            ('Papua New Guinea'),
            ('Paraguay'),
            ('Peru'),
            ('Philippines'),
            ('Poland'),
            ('Portugal'),
            ('Qatar'),
            ('Romania'),
            ('Russia'),
            ('Rwanda'),
            ('Saint Kitts and Nevis'),
            ('Saint Lucia'),
            ('Saint Vincent and the Grenadines'),
            ('Samoa'),
            ('San Marino'),
            ('Sao Tome and Principe'),
            ('Saudi Arabia'),
            ('Senegal'),
            ('Serbia'),
            ('Seychelles'),
            ('Sierra Leone'),
            ('Singapore'),
            ('Slovakia'),
            ('Slovenia'),
            ('Solomon Islands'),
            ('Somalia'),
            ('South Africa'),
            ('South Korea'),
            ('South Sudan'),
            ('Spain'),
            ('Sri Lanka'),
            ('Sudan'),
            ('Suriname'),
            ('Sweden'),
            ('Switzerland'),
            ('Syria'),
            ('Tajikistan'),
            ('Tanzania'),
            ('Thailand'),
            ('Timor-Leste'),
            ('Togo'),
            ('Tonga'),
            ('Trinidad and Tobago'),
            ('Tunisia'),
            ('Turkey'),
            ('Turkmenistan'),
            ('Tuvalu'),
            ('Uganda'),
            ('Ukraine'),
            ('United Arab Emirates'),
            ('United Kingdom'),
            ('United States of America'),
            ('Uruguay'),
            ('Uzbekistan'),
            ('Vanuatu'),
            ('Venezuela'),
            ('Vietnam'),
            ('Yemen'),
            ('Zambia'),
            ('Zimbabwe');

        `)
        .then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))

    },

    getCountries: (req, res) => {
        sequelize
        .query(`
            SELECT * FROM countries;
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err=> res.status(500).send(err))
    },
        
    createCity: (req, res) => {
        const { name, rating, countryId } = req.body;
        
        sequelize
        .query(`
                INSERT INTO cities( name, rating, country_id)
                VALUES('${name}', ${rating}, ${countryId}) returning *;
            `)
        .then(dbRes => {
            console.log(dbRes)
            res.status(200).send(dbRes[0])
        })
        .catch(err=> {
            console.error(err)
            res.status(500).send(err)
        })
    },

     getCities:(req, res) => {
        sequelize.query(`
        SELECT 
            ci.id as city_id,
            ci.name as city,
            ci.rating as rating,
            ct.id as country_id,
            ct.name as country,
        FROM cities as ci
        JOIN countries as ct
        ON ci.country_id = ct.id
        `) 
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err=> res.status(500).send(err))
    },

    deleteCity: (req, res) => {
        const {id} = req.params

        sequelize
        .query(`
            DELETE FROM cities
            WHERE city_id = ${id};
        `)
        .then(dbRes => {
            console.log(dbRes[0]);
            res.status(200).send(dbRes[0])
         })
        .catch(err => {
            console.log(err);
            res.status(500).send(err)
        });
    },

    updateCities: (req, res) => {
        sequelize
        .query(`
        SELECT 
        cities.ci_id,
        ci.name as city,
        ci.rating as rating,
        ct.name as country, 
        FROM cities
        JOIN countries ON ci.country_id + ct.country_id
        ORDER BY ci.rating DESC
        `)
        .then(dbRes => {
            console.log(dbRes[0]);
            res.status(200).send(dbRes[0])})
        .catch(err => {
            console.log(err);
            res.status(500).send(err)})

    }
}
