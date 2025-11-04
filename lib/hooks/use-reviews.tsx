"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Review } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'author'>) => void;
  getReviewsForProduct: (productId: string) => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

export const ReviewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = useCallback((review: Omit<Review, 'id' | 'date' | 'author'>) => {
    const newReview: Review = {
      ...review,
      id: uuidv4(),
      date: new Date().toISOString(),
      author: "Anonymous", // In a real app, you'd get the logged-in user's name
    };
    setReviews((prevReviews) => [...prevReviews, newReview]);
  }, []);

  const getReviewsForProduct = useCallback((productId: string) => {
    return reviews.filter((review) => review.productId === productId);
  }, [reviews]);

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, getReviewsForProduct }}>
      {children}
    </ReviewsContext.Provider>
  );
};
