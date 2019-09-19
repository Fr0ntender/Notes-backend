const graphqlHTTP = require('express-graphql'),
    bodyParser = require('body-parser'),
    express = require('express'),
    cors = require('cors')

const schema = require('./graphql/Note'),
    db = require('./utils')

const { HOST, LS_PORT } = process.env
    
// Initialization of express application
const app = express()


// Allow requests from any origin
app.use(cors({ origin: '*' }))
// Using bodyParser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// Set up connection of database
db.setUpConnection()

// Using graphql middleware
app.post('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}))
app.get('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}))

app.listen(LS_PORT, () => {
    console.log(`Server running on http://${HOST}:${LS_PORT}`)
    console.log(`GraphQL running on http://${HOST}:${LS_PORT}/graphql`)
})