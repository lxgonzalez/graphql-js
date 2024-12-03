var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(
    `
    type Client {
        id: Int
        name: String
        phone: String
    }

    type Query {
        clients: [Client]
        client(id: Int): Client
    }
    
    type Mutation {
        addClient(name: String, phone: String): Client
    }
    `
);

var clients = []
var counter = 1
var root = {
    clients: () => { return clients; },
    client: (data) => {
        return clients.findIndex(c => c.id === data.id)
    },
    addClient: (data) => {
        var c = { 'id': counter, 'name': data.name, 'phone': data.phone };
        clients.push(c)
        return c
    },
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000)
console.log('Running GraphQl http://localhost:4000/graphql');
