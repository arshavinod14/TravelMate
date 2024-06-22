import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleAllReviews } from '../../redux/reducers/user/userReducer';
import { handleFetchingUsers } from '../../redux/reducers/admin/adminReducer';
import StarRatings from "react-star-ratings";
import defaultImg from '../../assets/default_person.png'

function Testimonials() {
    const dispatch = useDispatch();
    const [filteredReviews, setFilteredReviews] = useState([]);
    const reviews = useSelector((state) => state.user?.reviews);
    const users = useSelector((state) => state.admin?.users);

    useEffect(() => {
        dispatch(handleAllReviews());
        dispatch(handleFetchingUsers());
    }, []);

    useEffect(() => {
        if (reviews && users) {
            const userReviewMap = {};
            const filtered = reviews.filter(review => review.rating > 4.5);
            const uniqueReviews = [];
            filtered.forEach(review => {
                if (!userReviewMap[review.user] && uniqueReviews.length < 3) {
                    userReviewMap[review.user] = true;
                    uniqueReviews.push(review);
                }
            });
            setFilteredReviews(uniqueReviews);
        }
    }, [reviews, users]);

    return (
        <div className='m-10'>
            <section className="px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h3 className="mb-6 text-3xl font-bold">Testimonials</h3>
                    <p className="mb-6 pb-2 text-neutral-500 dark:text-neutral-300 md:mb-12">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit,
                        error amet numquam iure provident voluptate esse quasi, veritatis
                        totam voluptas nostrum quisquam eum porro a pariatur veniam.
                    </p>
                </div>

                <div className="flex justify-center items-center space-x-40">
                    {filteredReviews.map(rev => {
                        const customerObj = users?.user?.find(user => user?.id === rev?.user);
                        const customerName = customerObj ? `${customerObj.first_name} ${customerObj.last_name}` : "N/A";

                        return (
                            <div key={rev.id} className="flex flex-col items-center mb-0">
                                <div className="mb-6 flex justify-center">
                                    <img
                                        src={defaultImg}
                                        alt="Images"
                                        className="w-16 h-16 rounded-full shadow-lg dark:shadow-black/30"
                                    />
                                </div>
                                <StarRatings
                                    className="ml-4"
                                    rating={rev.rating}
                                    starRatedColor="#FFD700"
                                    numberOfStars={5}
                                    starDimension="15px"
                                    starSpacing="2px"
                                />
                                <p className="my-4 italic text-neutral-500 dark:text-neutral-300">
                                    "{rev.comment}"
                                </p>
                                <p  className="-mt-2">{customerName}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default Testimonials;
