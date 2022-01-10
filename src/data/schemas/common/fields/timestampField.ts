
const timestampField = (fieldName: string) : object => {
    return {
        type: Number,
        required: [true, `The ${fieldName} is required.`]
    }
};

export default timestampField;