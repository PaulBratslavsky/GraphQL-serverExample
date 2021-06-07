const graphql = require("graphql");
const axios = require("axios");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
  }
})

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: graphql.GraphQLString },
    firstName: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
        .then(response => response.data)
      }
    }
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: graphql.GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(response => response.data)
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
