export default `
  type Mutation {
    CreateNewUser(user: UserInput, time: TimeInput) : User
    CreateNewActivity(activity: ActivityInput) : Activity
  }
`;
