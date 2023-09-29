const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const Book = require("../models/bookModel");
const Favorite = require("../models/favoriteModel");

const calcTotalFavoritePrice = (favorite) => {
  let tatalPrice = 0;
  favorite.favoriteItems.forEach((item) => {
    tatalPrice += item.quantity * item.price;
  });

  favorite.totalFavoritePrice = tatalPrice;

  favorite.totalPriceAfterDiscount = undefined;

  return tatalPrice;
};

//@Description -->   Add Book to favorite
//@Route -->         POST /api/v1/favorite
//@Access -->        User
exports.addBookToFavorite = asyncHandler(async (req, res, next) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  // 1- Get favorite for logged user
  let favorite = await Favorite.findOne({ user: req.user._id });

  if (!favorite) {
    // create favorite for this logged user with book
    favorite = await Favorite.create({
      user: req.user._id,
      favoriteItems: [{ book: bookId, price: book.price }],
    });
  } else {
    //if Book exixt in favorite, update book quantity
    const bookIndex = favorite.favoriteItems.findIndex(
      (item) => item.book.toString() === bookId
    );
    if (bookIndex > -1) {
      const favoriteItem = favorite.favoriteItems[bookIndex];
      favoriteItem.quantity += 1;
      favorite.favoriteItems[bookIndex] = favoriteItem;
    } else {
      //if not exixt, push Book to favoriteItem array
      favorite.favoriteItems.push({ book: bookId, price: book.price });
    }
  }

  //calculate total favorite price
  calcTotalFavoritePrice(favorite);

  await favorite.save();

  res.status(200).json({
    status: "success",
    message: "Book added to favorite successfuly",
    numOfFavoriteItems: favorite.favoriteItems.length,
    data: favorite,
  });
});

//@Description -->   Get logged user favorite
//@Route -->         GET /api/v1/favorite
//@Access -->        User
exports.getLoggedUserFavorite = asyncHandler(async (req, res, next) => {
  const favorite = await Favorite.findOne({ user: req.user._id });

  if (!favorite) {
    return next(
      new ApiError(
        `There is no favorite books for this user id: ${req.user._id}`,
        404
      )
    );
  }

  // Extract the bookIds from favoriteItems
  const bookIds = favorite.favoriteItems.map((item) => item.book);

  // Fetch book details for the bookIds
  const books = await Book.find({ _id: { $in: bookIds } });

  // Create a map to quickly access book details by bookId
  const bookMap = {};
  books.forEach((book) => {
    bookMap[book._id.toString()] = {
      bookName: book.bookName,
      image: book.image, // Assuming 'image' is the field for the book's image
    };
  });

  // Combine the favorite data with book details
  const favoriteWithBookDetails = {
    ...favorite.toObject(),
    favoriteItems: favorite.favoriteItems.map((item) => ({
      ...item.toObject(),
      bookDetails: bookMap[item.book.toString()], // Add book details
    })),
  };

  res.status(200).json({
    status: "success",
    numOfFavoriteItems: favorite.favoriteItems.length,
    data: favoriteWithBookDetails,
  });
});

//@Description -->   Remove specific favorite item
//@Route -->         DELETE /api/v1/favorite/:itemId
//@Access -->        User
exports.removeSpecificFavoriteItem = asyncHandler(async (req, res, next) => {
  const favorite = await Favorite.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { favoriteItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalFavoritePrice(favorite);

  favorite.save();

  res.status(200).json({
    status: "success",
    numOfFavoriteItems: favorite.favoriteItems.length,
    data: favorite,
  });
});

//@Description -->   Remove all items from favorite
//@Route -->         DELETE /api/v1/favorite
//@Access -->        User
exports.clearAllFavoriteItems = asyncHandler(async (req, res, next) => {
  await Favorite.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});

//@Description -->   Update specific favorite item quantity
//@Route -->         PUT /api/v1/favorite/:itemId
//@Access -->        User
exports.updateFavoriteItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const favorite = await Favorite.findOne({ user: req.user._id });

  if (!favorite) {
    return next(
      new ApiError(
        `There is no favorite for this user id: ${req.user._id}`,
        404
      )
    );
  }

  const itemIndex = favorite.favoriteItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex > -1) {
    const favoriteItem = favorite.favoriteItems[itemIndex];
    favoriteItem.quantity = quantity;
    favorite.favoriteItems[itemIndex] = favoriteItem;
  } else {
    return next(
      new ApiError(
        `There is no favorite books for this user id: ${req.user._id}`,
        404
      )
    );
  }

  calcTotalFavoritePrice(favorite);

  await favorite.save();

  res.status(200).json({
    status: "success",
    numOfFavoriteItems: favorite.favoriteItems.length,
    data: favorite,
  });
});
