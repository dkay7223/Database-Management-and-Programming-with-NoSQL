//Query Code:

db.book_z.find(
  { average_rating: { $gt: 3.5, $ne: null, $ne: "" }, is_ebook: false },
  {
    book_id: 1,
    title: 1,
    price: 1,
    average_rating: 1,
    _id: 0
  }
).sort({ average_rating: -1 }).limit(3).explain()

//

db.book_z.createIndex({ average_rating: -1 })

//Before index response

{
    explainVersion: '1',
    queryPlanner: {
      namespace: 'goodReads.book_z',
      indexFilterSet: false,
      parsedQuery: {
        '$and': [
          {
            is_ebook: {
              '$eq': false
            }
          },
          {
            average_rating: {
              '$gt': 3.5
            }
          },
          {
            average_rating: {
              '$not': {
                '$eq': ''
              }
            }
          }
        ]
      },
      queryHash: '5D130F30',
      planCacheKey: 'E3512104',
      maxIndexedOrSolutionsReached: false,
      maxIndexedAndSolutionsReached: false,
      maxScansToExplodeReached: false,
      winningPlan: {
        stage: 'PROJECTION_SIMPLE',
        transformBy: {
          book_id: 1,
          title: 1,
          price: 1,
          average_rating: 1,
          _id: 0
        },
        inputStage: {
          stage: 'SORT',
          sortPattern: {
            average_rating: -1
          },
          memLimit: 104857600,
          limitAmount: 3,
          type: 'simple',
          inputStage: {
            stage: 'COLLSCAN',
            filter: {
              '$and': [
                {
                  is_ebook: {
                    '$eq': false
                  }
                },
                {
                  average_rating: {
                    '$gt': 3.5
                  }
                },
                {
                  average_rating: {
                    '$not': {
                      '$eq': ''
                    }
                  }
                }
              ]
            },
            direction: 'forward'
          }
        }
      },
      rejectedPlans: []
    },
    command: {
      find: 'book_z',
      filter: {
        average_rating: {
          '$gt': 3.5,
          '$ne': ''
        },
        is_ebook: false
      },
      sort: {
        average_rating: -1
      },
      projection: {
        book_id: 1,
        title: 1,
        price: 1,
        average_rating: 1,
        _id: 0
      },
      limit: 3,
      '$db': 'goodReads'
    },
    serverInfo: {
      host: 'DESKTOP-D3SC6RH',
      port: 27017,
      version: '6.0.5',
      gitVersion: 'c9a99c120371d4d4c52cbb15dac34a36ce8d3b1d'
    },
    serverParameters: {
      internalQueryFacetBufferSizeBytes: 104857600,
      internalQueryFacetMaxOutputDocSizeBytes: 104857600,
      internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
      internalDocumentSourceGroupMaxMemoryBytes: 104857600,
      internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
      internalQueryProhibitBlockingMergeOnMongoS: 0,
      internalQueryMaxAddToSetBytes: 104857600,
      internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600
    },
    ok: 1
  }



//After indexing:



{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'goodReads.book_z',
    indexFilterSet: false,
    parsedQuery: {
      '$and': [
        {
          is_ebook: {
            '$eq': false
          }
        },
        {
          average_rating: {
            '$gt': 3.5
          }
        },
        {
          average_rating: {
            '$not': {
              '$eq': ''
            }
          }
        }
      ]
    },
    queryHash: '5D130F30',
    planCacheKey: '4CDB477F',
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    winningPlan: {
      stage: 'LIMIT',
      limitAmount: 3,
      inputStage: {
        stage: 'PROJECTION_SIMPLE',
        transformBy: {
          book_id: 1,
          title: 1,
          price: 1,
          average_rating: 1,
          _id: 0
        },
        inputStage: {
          stage: 'FETCH',
          filter: {
            is_ebook: {
              '$eq': false
            }
          },
          inputStage: {
            stage: 'IXSCAN',
            keyPattern: {
              average_rating: -1
            },
            indexName: 'average_rating_-1',
            isMultiKey: false,
            multiKeyPaths: {
              average_rating: []
            },
            isUnique: false,
            isSparse: false,
            isPartial: false,
            indexVersion: 2,
            direction: 'forward',
            indexBounds: {
              average_rating: [
                '[inf.0, 3.5)'
              ]
            }
          }
        }
      }
    },
    rejectedPlans: []
  },
  command: {
    find: 'book_z',
    filter: {
      average_rating: {
        '$gt': 3.5,
        '$ne': ''
      },
      is_ebook: false
    },
    sort: {
      average_rating: -1
    },
    projection: {
      book_id: 1,
      title: 1,
      price: 1,
      average_rating: 1,
      _id: 0
    },
    limit: 3,
    '$db': 'goodReads'
  },
  serverInfo: {
    host: 'DESKTOP-D3SC6RH',
    port: 27017,
    version: '6.0.5',
    gitVersion: 'c9a99c120371d4d4c52cbb15dac34a36ce8d3b1d'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600
  },
  ok: 1
}


//Execution plan bfore indexing
{
  ...
  "winningPlan": {
    "stage": "PROJECTION_SIMPLE",
    "transformBy": {
      "book_id": 1,
      "title": 1,
      "price": 1,
      "average_rating": 1,
      "_id": 0
    },
    "inputStage": {
      "stage": "SORT",
      "sortPattern": {
        "average_rating": -1
      },
      ...
      "inputStage": {
        "stage": "COLLSCAN",
        ...
      }
    }
  },
  ...
}


//After indexing

{
  ...
  "winningPlan": {
    "stage": "LIMIT",
    "limitAmount": 3,
    "inputStage": {
      "stage": "PROJECTION_SIMPLE",
      "transformBy": {
        "book_id": 1,
        "title": 1,
        "price": 1,
        "average_rating": 1,
        "_id": 0
      },
      "inputStage": {
        "stage": "FETCH",
        "filter": {
          "is_ebook": {
            "$eq": false
          }
        },
        "inputStage": {
          "stage": "IXSCAN",
          "keyPattern": {
            "average_rating": -1
          },
          ...
        }
      }
    }
  },
  ...
}
