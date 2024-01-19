//01
db.author.updateMany(
    {
        average_rating: { $type: "string" } // Filter documents where the existingField is of string type
    },
    [
        {
            $set: {
                average_rating: { $toDouble: "$average_rating" } // Convert the existingField to double
            }
        }
    ]
)

//02
db.author.updateMany(
    {
        text_reviews_count: { $type: "string" } // Filter documents where the existingField is of string type
    },
    [
        {
            $set: {
                text_reviews_count: { $toDouble: "$text_reviews_count" } // Convert the existingField to double
            }
        }
    ]
)

//03
db.author.updateMany(
    {
        ratings_count: { $type: "string" } // Filter documents where the existingField is of string type
    },
    [
        {
            $set: {
                ratings_count: { $toDouble: "$ratings_count" } // Convert the existingField to int
            }
        }
    ]
)


//Multiple fields at a time
db.author_z.updateMany(
    {
        $or: [
            { average_rating: { $type: "string" } }, // Filter documents where field1 is of string type
            { text_reviews_count: { $type: "string" } }, // Filter documents where field2 is of string type
            { ratings_count: { $type: "string" } }, // Filter documents where field2 is of string type
            // Add more fields to update here
        ]
    },
    [
        {
            $set: {
                average_rating: { $toDouble: "$average_rating" }, // Convert field1 to double
                text_reviews_count: { $toDouble: "$text_reviews_count" },// Convert field2 to double
                ratings_count: { $toDouble: "$ratings_count" }, // Add more fields to update here
            }
        }
    ]
)


//Adding a condition to the same above query, because there are null / empty values in fields

db.book_z.updateMany(
    {
        $or: [
            { authors: { $type: "string" } },
            { text_reviews_count: { $type: "string" } },
            { average_rating: { $type: "string" } },
            { is_ebook: { $type: "string" } },
            { num_pages: { $type: "string" } },
            { publication_day: { $type: "string" } },
            { publication_month: { $type: "string" } },
            { publication_year: { $type: "string" } },
            { ratings_count: { $type: "string" } }
        ]
    },
    [
        {
            $set: {
                text_reviews_count: { $cond: [{ $ne: ["$text_reviews_count", ""] }, { $toDouble: "$text_reviews_count" }, "$text_reviews_count"] },
                authors: { $cond: [{ $ne: ["$authors", ""] }, { $toDouble: "$authors" }, "$authors"] },
                average_rating: { $cond: [{ $ne: ["$average_rating", ""] }, { $toDouble: "$average_rating" }, "$average_rating"] },
                is_ebook: { $cond: [{ $ne: ["$is_ebook", ""] }, { $cond: [{ $eq: ["$is_ebook", "true"] }, true, false] }, "$is_ebook"] },
                num_pages: { $cond: [{ $ne: ["$num_pages", ""] }, { $toInt: "$num_pages" }, "$num_pages"] },
                publication_day: { $cond: [{ $ne: ["$publication_day", ""] }, { $toInt: "$publication_day" }, "$publication_day"] },
                publication_month: { $cond: [{ $ne: ["$publication_month", ""] }, { $toInt: "$publication_month" }, "$publication_month"] },
                publication_year: { $cond: [{ $ne: ["$publication_year", ""] }, { $toInt: "$publication_year" }, "$publication_year"] },
                ratings_count: { $cond: [{ $ne: ["$ratings_count", ""] }, { $toInt: "$ratings_count" }, "$ratings_count"] }
            }
        }
    ]
)



//Q4: part 2

db.book.updateMany(
    {},
    [
        {
            $set: {
                publication_date: {
                    $concat: [
                        { $toString: "$publication_year" },
                        "-",
                        { $cond: [{ $lt: ["$publication_month", 10] }, "0", ""] },
                        { $toString: "$publication_month" },
                        "-",
                        { $cond: [{ $lt: ["$publication_day", 10] }, "0", ""] },
                        { $toString: "$publication_day" }
                    ]
                }
            }
        }
    ]
)


//Last part:
db.book_z.aggregate([
    {
        $addFields: {
            unix_publication_date: {
                $cond: [
                    {
                        $and: [
                            { $ne: ["$publication_date", null] },
                            { $ne: ["$publication_date", ""] },
                            { $regexMatch: { input: "$publication_date", regex: /^\d{4}-\d{2}-\d{2}$/ } }
                        ]
                    },
                    {
                        $divide: [
                            { $subtract: [{ $toDate: { $concat: ["$publication_date", "T00:00:00Z"] } }, new Date("1970-01-01T00:00:00Z")] },
                            1000
                        ]
                    },
                    null
                ]
            }
        }
    },
    {
        $out: "book_z" // Save the updated documents back to the collection
    }
])
