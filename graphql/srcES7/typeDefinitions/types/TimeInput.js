
const TimeInput = `
  input TimeInput {
    time: Int!
  }
`
/*
If you’re exporting array of schema strings and there are circular dependencies, the array can be wrapped in a function
https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
*/

export default TimeInput;