export default `
  type Mutation {
    CreateNewAvatar(avatar: AvatarInput, time: TimeInput) : Avatar
    CreateNewActivity(activity: ActivityInput) : Activity
  }
`;
