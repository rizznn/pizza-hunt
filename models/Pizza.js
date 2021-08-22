const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');

const PizzaSchema = new Schema({
    pizzaName: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },  
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },    
    toppings: [],
    comments: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Comment'
        }  
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  // .reduce() method to tally up the total of every comment with its replies. 
  // .reduce() takes two parameters, an accumulator(total) and a currentValue(comment)
  // As .reduce() walks through the array, it passes the two parameters into the function
    // with the return of the function - revising the total for the next iteration through the array
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});
  
// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;
