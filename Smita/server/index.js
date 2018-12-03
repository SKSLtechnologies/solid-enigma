const { GraphQLServer } = require("graphql-yoga");

/* MONGOOSE SETUP */
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {}).then(() => {
    console.log("Successfully connected to the database! ");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now.');
    process.exit();
});

const User = mongoose.model("User", {
  username: String,
  email: String,
  checkAdmin: Boolean
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    users: [User]
  }
  type User {
    id: ID!
    username: String!
    email: String!
    checkAdmin: Boolean!
  }
  type Mutation {
    createUser(username: String!, email: String!, checkAdmin: Boolean): User
    removeUser(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    users: () => User.find()
  },
  Mutation: {
    createUser: async (_, { username, email, checkAdmin }) => {
      const user = new User({ username, email, checkAdmin });
      await user.save();
      return user;
    }, 
    removeUser: async (_, { id }) => {
      await User.findByIdAndRemove(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});



// const { GraphQLServer } = require("graphql-yoga");

// /* MONGOOSE SETUP */
// // Configuring the database
// const dbConfig = require('./config/database.config.js');
// const mongoose = require('mongoose');
// mongoose.set('useFindAndModify', false);

// mongoose.Promise = global.Promise;

// // Connecting to the database
// mongoose.connect(dbConfig.url, {
// }).then(() => {
//     console.log("Successfully connected to the database! ");    
// }).catch(err => {
//     console.log('Could not connect to the database. Exiting now.');
//     process.exit();
// });

// const Todo = mongoose.model("Todo", {
//   text: String,
//   complete: Boolean
// });

// const typeDefs = `
//   type Query {
//     hello(name: String): String!
//     todos: [Todo]
//   }
//   type Todo {
//     id: ID!
//     text: String!
//     complete: Boolean!
//   }
//   type Mutation {
//     createTodo(text: String!): Todo
//     updateTodo(id: ID!, complete: Boolean!): Boolean
//     removeTodo(id: ID!): Boolean
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: (_, { name }) => `Hello ${name || "World"}`,
//     todos: () => Todo.find()
//   },
//   Mutation: {
//     createTodo: async (_, { text }) => {
//       const todo = new Todo({ text, complete: false });
//       await todo.save();
//       return todo;
//     },
//     updateTodo: async (_, { id, complete }) => {
//       await Todo.findByIdAndUpdate(id, { complete });
//       return true;
//     },
//     removeTodo: async (_, { id }) => {
//       await Todo.findByIdAndRemove(id);
//       return true;
//     }
//   }
// };

// const server = new GraphQLServer({ typeDefs, resolvers });
// mongoose.connection.once("open", function() {
//   server.start(() => console.log("Server is running on localhost:4000"));
// });
