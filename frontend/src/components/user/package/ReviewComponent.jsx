import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import { handleAddReviews } from "../../../redux/reducers/user/userReducer";
import jwtDecode from "jwt-decode";

const ReviewComponent = ({ packageId }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const access = useSelector((s) => s.user.authTokens?.access);
  const decoded = access ? jwtDecode(access) : null;

  const handleReviewSubmit = () => {
    // Validate review text and rating before dispatching the action
    if (!reviewText || rating === 0) {
      // Handle validation error, maybe show an error message to the user
      return;
    }

    const formData = {
      package: packageId,
      user:decoded.id,
      rating: rating,
      comment: reviewText,
    };

    dispatch(handleAddReviews(formData));
    
    // Clear the input fields after submitting the review
    setReviewText("");
    setRating(0);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-black">
        Reviews
      </h2>
      <div className="flex mt-4 flex-col">
        <StarRatings
          rating={rating}
          starRatedColor="#FFD700"
          changeRating={(newRating) => setRating(newRating)}
          numberOfStars={5}
          starDimension="20px"
          starSpacing="2px"
        />
        <textarea
          className="w-50 h-24 mt-5  px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-500"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        <button
          className="px-4 py-2 ml-4 mt-5 bg-blue-500 text-white rounded"
          onClick={handleReviewSubmit}
        >
          Post Review
        </button>
      </div>
    </div>
  );
};

export default ReviewComponent;
