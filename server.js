var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const axios = require('axios')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type post{
    userId: Int
    id: Int
    title : String
    body: String
  }
  type User {
     name: String
     age: Int
     collage: String
  }

  type Query {
    hello: String!
    howareyou : String
    WelcomeMessage(name: String): String
    getUser: User
    getpostsFromExternalAPI: [post ] 
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    hello: () => {
        return 'Hello world!';
    },
    howareyou: () => {
        return 'I am fine';
    },
    WelcomeMessage: args => {
        return `Hey ${args.name}, hows life goes on `;
    },
    getUser: () => {
        const user = {
            name: "Harsh Shina",
            age: 26,
            collage: "IIT Guwahati",
        };
        return user;
    },
    getpostsFromExternalAPI: async() => {
        const result = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return result.data
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');