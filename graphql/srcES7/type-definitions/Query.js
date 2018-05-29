export default `
  type Query {
    AllAvatars: [Avatar]!
    Avatar(id: ID): Avatar
    AvatarActivities(id: ID, type: String, startTime: Int): [Activity]
  }
`;
