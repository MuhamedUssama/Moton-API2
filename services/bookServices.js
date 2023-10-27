const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const { uploadSingleImage } = require("../middleware/uploadImagesMiddleware");

const factory = require("./handlersFactory");
const Book = require("../models/bookModel");

//upload single image
exports.uploadBookImage = uploadSingleImage("image");

//image processing
exports.resizeImages = asyncHandler(async (req, res, next) => {
  const filename = `books-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(700, 1000)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/books/${filename}`);

    //save image into database
    req.body.image = filename;
  }

  next();
});

//@Description -->   Get list of Books
//@Route -->   GET /api/v1/books
//@Access -->  User
exports.getBooks = factory.getAll(Book, "books");

//@Description -->   Get specific Book by id
//@Route -->   GET /api/v1/books/ :id
//@Access -->  User
exports.getBook = factory.getOne(Book, "reviews");

//@Description -->   Create Book
//@Route -->   POST /api/v1/books
//@Access -->  Admin
exports.createBookAdmin = factory.createOne(Book);

//@Description -->   Create Book
//@Route -->   POST /api/v1/publisher/books
//@Access -->  Publisher
exports.createBookPublisher = factory.createOne(Book);

//@Description -->   Update Book
//@Route -->   PUT /api/v1/books/id:
//@Access -->  Admin
exports.updateBookAdmin = factory.updateOne(Book);

//@Description -->   Update Book
//@Route -->   PUT /api/v1/publisher/books/id:
//@Access -->  Publisher
exports.updateBookPublisher = factory.updateOne(Book);

//@Description -->   Delete Book
//@Route -->   DELETE /api/v1/books/id:
//@Access -->  Admin
exports.deleteBookAdmin = factory.deleteOne(Book);

//@Description -->   Delete Book
//@Route -->   DELETE /api/v1/publisher/books/id:
//@Access -->  Publisher
exports.deleteBookPublisher = factory.deleteOne(Book);

//@Description --> Get Count of Books Published by a Specific Publisher
//@Route --> GET /api/v1/publisher/booksCount/:publisherName
//@Access --> Admin & Publisher
exports.getBooksCountForPublisher = asyncHandler(async (req, res, next) => {
  const publisherName = req.params.publisherName;

  const bookCount = await Book.countDocuments({ publisherName });

  res.status(200).json({ status: "success", data: { bookCount } });
});
