//01
db.book_z.find(
  { average_rating: { $gt: 3.5, $ne: null, $ne: "" }, is_ebook: false },
  {
    book_id: 1,
    title: 1,
    price: 1,
    average_rating: 1,
    _id: 0
  }
).sort({ average_rating: -1 }).limit(3)


//02
db.review.aggregate([
  {
    $match: { rating: 5 } // Filter only 5-rated reviews
  },
  {
    $group: {
      _id: "$user_id", // Group by user_id
      average_rating: { $avg: "$rating" }, // Calculate average rating
      average_n_votes: { $avg: "$n_votes" }, // Calculate average n_votes
      total_n_comments: { $sum: "$n_comments" }, // Calculate total n_comments
      total_reviews: { $sum: 1 } // Calculate total number of reviews
    }
  },
  {
    $sort: { total_reviews: -1 } // Sort by total_reviews in descending order
  },
  {
    $limit: 1 // Retrieve only the top result
  },
  {
    $project: {
      _id: 1, // Include user_id
      average_rating: 1, // Include average rating
      average_n_votes: 1, // Include average n_votes
      total_n_comments: 1, // Include total n_comments
      total_reviews: 1 // Include total reviews
    }
  }
])


//part -3

// Step 1: Find the most famous reviewer
var mostFamousReviewer = db.review.aggregate([
  {
    $group: {
      _id: "$user_id",
      average_rating: { $avg: "$rating" },
      average_n_votes: { $avg: "$n_votes" },
      total_n_comments: { $sum: "$n_comments" },
      total_reviews: { $sum: 1 }
    }
  },
  { $sort: { total_reviews: -1 } },
  { $limit: 1 }
]).next();

// Step 2: Update reviews written by the most famous reviewer
db.review.updateMany(
  { user_id: mostFamousReviewer._id },
  { $set: { most_famous: true } }
);




//Last part again

var mostFamousReviewer = db.review.findOne({ most_famous: true });

if (mostFamousReviewer) {
  var mostFamousReviewerId = mostFamousReviewer.user_id;
  const reviewIds = [];
  db.review.find({ user_id: mostFamousReviewerId }).forEach(review => {
    reviewIds.push(review.book_id);
  });
  db.book.find({ book_id: { $in: reviewIds } }, { title: 1, price: 1 }).sort({ price: -1 }).limit(3)
}
