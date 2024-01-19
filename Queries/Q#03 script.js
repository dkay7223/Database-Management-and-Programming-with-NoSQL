//Open mongodb shell/ Compass / Terminal (mongosh)

//Replace the names of collections in the following queries before running them.

//Replace `review` with the name of the collection in which reviews are stored
//Replace `book` with the name of the collection in which books are stored
//Replace `author` with the name of the collection in which author are stored
//Replace `genres` with the name of the collection in which genres are stored

//Replace pxxxxxxx with your roll number before running the queries

//3.3.2
db.review.aggregate([
  {
    $lookup: {
      from: "book",
      localField: "book_id",
      foreignField: "book_id",
      as: "matching_books"
    }
  },
  {
    $match: {
      matching_books: { $ne: [] }
    }
  },
  {
    $out: "pxxxxxxx_review"
  }
])

//3.3.3
db.author.aggregate([
  {
    $lookup: {
      from: "book",
      localField: "author_id",
      foreignField: "author_id",
      as: "matching_authors"
    }
  },
  {
    $match: {
      matching_authors: { $ne: [] }
    }
  },
  {
    $out: "pxxxxxxx_author"
  }
])



//3.3.4
db.genre.aggregate([
  {
    $lookup: {
      from: "book",
      localField: "book_id",
      foreignField: "book_id",
      as: "matching_genres"
    }
  },
  {
    $match: {
      matching_genres: { $ne: [] }
    }
  },
  {
    $out: "pxxxxxxx_genres"
  }
])


