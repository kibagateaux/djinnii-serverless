Object.defineProperty(exports,"__esModule",{value:true});exports.default="\n  type User {\n    uid: ID!\n    avatarName: String\n    age: Int\n    userName: String\n    firstName: String\n    lastName: String\n    email: String\n    purpose: [String]\n    overallRating: Float\n    avatar: Avatar\n  }\n  type Activity {\n    type: String\n    startTime: Int\n    endTime: Int\n    duration: Int\n    distance: Int\n    calories: Int\n  }\n  type Avatar {\n    name: String!\n    stats: [Stat]\n    partners: [Avatar]\n  }\n  type Stat {\n    attribute: String!\n    value: Float!\n  }\n\n\n  type Query {\n    User(uid: ID): User\n    AllUsers: [User]\n    Avatar(name: String, partner: ID): Avatar\n    UserActivities(id: ID, type: String, startTime: Int): [Activity]\n  }\n\n  schema {\n    query: Query\n  }\n";