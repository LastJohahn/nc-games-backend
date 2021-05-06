exports.endpointsLister = (req, res, next) => {
  const endpoints = {
    endpoints: [
      {
        "GET /api":
          "You are here! As you can see, I display all available endpoints for this API.",
        "GET /api/categories": "I respond with all the categories on this API.",
        "GET /api/reviews": `I will show you all the reviews on this API. 
          By default, I sort by date posted in descending order, but please feel free to specify differently. I also filter by category if you tell me to! For this, please use the following queries:
           ?sort_by= [insert any valid column name]
           ?order=ASC/DESC
           ?category= [insert any valid category]`,
        "GET /api/reviews/:review_id":
          "I will tell you all about one specific review, including how many comments it has gotten!",
        "PATCH /api/reviews/:review_id": `With me, you can alter the vote count for a specific review. To do this, please pass me an object in the following format:
           {inc_votes: [A positive integer n if you want to add n votes, a negative integer if you wish to remove them]}`,
        "GET /api/reviews/:review_id/comments":
          "I respond with all the comments for the specified review!",
        "POST /api/reviews/:review_id/comments": `I will post a new comment to the review for you. Please just give me an object with the following information:
           {username: [your valid username], 
           body: [whatever you would like your comment to be! Just please be nice of course :)]}`,
      },
    ],
  };
  res.status(200).send(endpoints);
};
