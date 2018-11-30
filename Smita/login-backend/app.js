
const { GraphQLServer } = require('graphql-yoga')
/* MONGOOSE SETUP */
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database! ");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now.');
    process.exit();
});

const Todo = mongoose.model('Todo', {
  text: String,
  complete: Boolean
})


const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo ]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Mutation {
    createTodo(text: String!): Todo
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
    createTodo: async (_, {text}) => {
      const todo = new Todo ({text, complete: false});
      await todo.save();
      return todo;
     }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))