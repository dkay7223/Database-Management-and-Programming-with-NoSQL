//Part 01

db.book.aggregate([
    { $match: {} }, // Match all documents in the book collection
    { $out: "books_adm" } // Output the results to the books_adm collection
])


//Final Part 02:
//Query result stored in a separate collection without modifyning the original book collection
db.book.aggregate([
    {
        $lookup: {
            from: "author",
            localField: "author_id",
            foreignField: "author_id",
            as: "author"
        }
    },
    {
        $unwind: "$author"
    },
    {
        $lookup: {
            from: "genre",
            localField: "book_id",
            foreignField: "book_id",
            as: "genre"
        }
    },
    {
        $project: {
            _id: 0,
            isbn: 1,
            text_reviews_count: 1,
            series: 1,
            country_code: 1,
            is_ebook: 1,
            average_rating: 1,
            similar_books: 1,
            description: 1,
            format: 1,
            link: 1,
            authors: 1,
            publisher: 1,
            num_pages: 1,
            publication_day: 1,
            publication_month: 1,
            edition_information: 1,
            publication_year: 1,
            url: 1,
            image_url: 1,
            book_id: 1,
            ratings_count: 1,
            title: 1,
            assignedGroup: 1,
            price: 1,
            author: "$author",
            genre: {
                $ifNull: [{ $arrayElemAt: ["$genre.genres", 0] }, []]
            }
        }
    },
    {
        $out: "new_book_adm"
    }
]);



//null value check
// Iterate over the documents in the new_book_adm collection
db.new_book_adm.find().forEach(function (newDoc) {
    // Find the corresponding document in the books_adm collection based on author_id
    var query = { "author_id": newDoc.author.author_id };
    var existingDoc = db.books_adm.findOne(query);

    // Preserve the original _id field in the new document if it exists
    if (existingDoc && existingDoc._id) {
        newDoc._id = existingDoc._id;
    } else {
        delete newDoc._id; // Remove _id field if it's null or empty
    }

    // Replace the document in the books_adm collection with the one from new_book_adm
    if (existingDoc) {
        db.books_adm.replaceOne(query, newDoc);
    }
});

db.new_book_adm.drop()

//03

db.books_adm.find({ "author.author_id": { $exists: true } }, {
    title: 1,
    "author.name": 1,
    genre: 1,
    _id: 0
}).sort({ num_pages: -1 }).limit(1);


//04


db.genre.updateMany(
    { book_id: { $exists: true, $ne: null, $ne: "" } },
    { $unset: { book_id: "" } }
);

db.book.updateMany(
    { author_id: { $exists: true, $ne: null, $ne: "" } },
    { $unset: { author_id: "" } }
);


//05

//Sample query. Speed tracking is below:
db.books_adm.aggregate([
    { $sample: { size: Math.floor(db.books_adm.count() / 2) } },
    {
        $lookup: {
            from: "books_adm",
            localField: "author.author_id",
            foreignField: "author.author_id",
            as: "author_info"
        }
    },
    {
        $project: {
            _id: 0,
            isbn: 1,
            text_reviews_count: 1,
            series: 1,
            country_code: 1,
            is_ebook: 1,
            average_rating: 1,
            similar_books: 1,
            description: 1,
            format: 1,
            link: 1,
            authors: 1,
            publisher: 1,
            num_pages: 1,
            publication_day: 1,
            publication_month: 1,
            edition_information: 1,
            publication_year: 1,
            url: 1,
            image_url: 1,
            book_id: 1,
            ratings_count: 1,
            title: 1,
            assignedGroup: 1,
            price: 1,
            author: {
                $arrayElemAt: ["$author_info.author", 0]
            },
            genre: 1
        }
    }
]);






///Tracking the time



const startTime = new Date();

// Execute the query
db.books_adm.aggregate([
    { $sample: { size: Math.floor(db.books_adm.count() / 2) } },
    {
        $lookup: {
            from: "books_adm",
            localField: "author.author_id",
            foreignField: "author.author_id",
            as: "author_info"
        }
    },
    {
        $project: {
            _id: 0,
            isbn: 1,
            text_reviews_count: 1,
            series: 1,
            country_code: 1,
            is_ebook: 1,
            average_rating: 1,
            similar_books: 1,
            description: 1,
            format: 1,
            link: 1,
            authors: 1,
            publisher: 1,
            num_pages: 1,
            publication_day: 1,
            publication_month: 1,
            edition_information: 1,
            publication_year: 1,
            url: 1,
            image_url: 1,
            book_id: 1,
            ratings_count: 1,
            title: 1,
            assignedGroup: 1,
            price: 1,
            author: {
                $arrayElemAt: ["$author_info.author", 0]
            },
            genre: 1
        }
    }
]);

const endTime = new Date();
const executionTime = endTime - startTime;
console.log("Execution Time: ", executionTime, "ms");





//Part 06

const start_Time = new Date();

var totalDocuments = db.books_adm.find({ "author": { $exists: true } }).count();
var limit = Math.ceil(totalDocuments / 2);

db.books_adm.find({ "author": { $exists: true } }).limit(limit);


const end_Time = new Date();
const execution_Time = endTime - startTime;
console.log("Execution Time: ", executionTime, "ms");

