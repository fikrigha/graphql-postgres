import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} from 'graphql';

import Db from './db';
const Models = Db.models;


const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'This represents a person.',
  fields: () => {
    return {
      id: { type: GraphQLInt, resolve: person => person.id },
      firstName: { type: GraphQLString, resolve: person => person.firstName },
      lastName: { type: GraphQLString, resolve: person => person.lastName },
      email: { type: GraphQLString, resolve: person => person.email },
      posts: { type: new GraphQLList(Post), resolve: person => person.getPosts() },
    };
  },
});


const Post = new GraphQLObjectType({
  name: 'Post',
  description: `This represents a person's post.`,
  fields: () => {
    return {
      id: { type: GraphQLInt, resolve: post => post.id },
      title: { type: GraphQLString, resolve: post => post.title },
      content: { type: GraphQLString, resolve: post => post.content },
      person: { type: Person, resolve: post => post.getPerson() }
    };
  },
});


const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      people: {
        type: new GraphQLList(Person),
        args: {
          id: { type: GraphQLInt },
          email: { type: GraphQLString },
        },
        resolve: (root, args) => Models.person.findAll({ where: args }),
      },
      posts: {
        type: new GraphQLList(Post),
        resolve: (root, args) => Models.post.findAll({ where: args }),
      }
    };
  }
});


const Schema = new GraphQLSchema({
  query: Query, // Root query
});


export default Schema;
