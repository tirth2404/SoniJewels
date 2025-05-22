import React from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';

const ReviewsPage = () => {
  // Sample reviews data
  const reviews = [
    {
      id: 1,
      productName: 'Diamond Solitaire Ring',
      rating: 5,
      comment: 'Absolutely beautiful ring! The craftsmanship is exceptional.',
      date: '2024-02-19',
      productImage: 'https://images.pexels.com/photos/9946153/pexels-photo-9946153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 2,
      productName: 'Ruby Pendant Necklace',
      rating: 4,
      comment: 'Gorgeous necklace, but the chain could be slightly longer.',
      date: '2024-02-15',
      productImage: 'https://images.pexels.com/photos/12934506/pexels-photo-12934506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">My Reviews</h1>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start">
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-1">{review.productName}</h3>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'text-gold fill-gold' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-gray-400 hover:text-burgundy"
                        aria-label="Edit review"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-burgundy"
                        aria-label="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    Reviewed on {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;