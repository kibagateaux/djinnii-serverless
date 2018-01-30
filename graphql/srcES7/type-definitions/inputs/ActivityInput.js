export default `
  input ActivityInput {
    type: String
    startTime: Int
    endTime: Int
    duration: Int
    calories: Int
    distance: Int
    time: TimeInput!
  }
`;