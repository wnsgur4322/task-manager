// the members roster is an object with the usernames of members as keys and their user id as values
// an example entry could be: "user1234": ObjectID(2j3h5k7o5j3h5j7m8)

const membersRosterField: object = {
    type: Object,
    required: [true, "The members roster field is required."],
};

export default membersRosterField;