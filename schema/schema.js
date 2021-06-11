const graphql = require("graphql");
const axios = require("axios");
const { response } = require("express");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
    users: {
      type: graphql.GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((response) => response.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: graphql.GraphQLString },
    firstName: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((response) => response.data);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: graphql.GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((response) => response.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: graphql.GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: { 
        firstName: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        age: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        companyId: { type: graphql.GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        const data = { firstName, age }
        return axios
        .post('http://localhost:3000/users', data)
        .then((response) => response.data)
      }
    },
    editUser: {
      type: UserType,
      args: { 
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        firstName: { type: graphql.GraphQLString },
        age: { type: graphql.GraphQLInt },
        companyId: { type: graphql.GraphQLString }
      },
      resolve(parentValue, { id, firstName, age, companyId }) {
        const data = { firstName, age, companyId }
        return axios
        .patch(`http://localhost:3000/users/${id}`, data)
        .then((response) => response.data)
      }
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }},
      resolve(parentValue, { id }) {
        return axios
        .delete(`http://localhost:3000/users/${id}`)
        .then((response) => response.data)

      }
    }
  }
});



module.exports = new GraphQLSchema({ query: RootQuery, mutation: mutation });
