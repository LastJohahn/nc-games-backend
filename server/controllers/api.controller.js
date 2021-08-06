exports.endpointsLister = (req, res, next) => {
  const endpoints = {
    endpoints: {
      "GET /api":
        "You are here! As you can see, I display all available endpoints for this API.",
      "GET /api/categories": "I respond with all the categories on this API.",
      "GET /api/reviews": `I will show you all the reviews on this API. By default, I sort by date posted in descending order, but please feel free to specify differently. I also filter by category if you tell me to! For this, please use the following queries: ?sort_by= [insert any valid column name] ?order=ASC/DESC ?category= [insert any valid category]`,
      "GET /api/reviews/:review_id":
        "I will tell you all about one specific review, including how many comments it has gotten!",
      "PATCH /api/reviews/:review_id": `With me, you can alter the vote count for a specific review. To do this, please pass me an object in the following format: {inc_votes: [A positive integer n if you want to add n votes, a negative integer if you wish to remove them]}`,
      "GET /api/reviews/:review_id/comments":
        "I respond with all the comments for the specified review!",
      "POST /api/reviews/:review_id/comments": `I will post a new comment to the review for you. Please just give me an object with the following information: {username: [your valid username], body: [whatever you would like your comment to be! Just please be nice of course :)]}`,
      "DELETE /api/comments/:comment_id":
        "I will delete the comment with the given id",
      "GET /api/users": "I will respond with all the users on the server",
      "GET /api/users/:username":
        "I will respond with the user with that username",
      "PATCH /api/comments/:comment_id":
        "I will update the votes on the specified comment, using the same syntax as used for PATCH requests to amend votes on a review",
      "POST /api/reviews": `I will post a review for you. Please pass me an object { owner: [a valid username], title: [the title of your review], review_body: [the body of your review], designer: [the designer who made the game], category: [a valid category from the server]}. I will respond with the newly created review`,
      "POST /api/categories": `I will create a new category for you. Please pass me an object {slug: [category name], description: [description of the kinds of games in this category]}. I will respond with the newly created category.`,
      "DELETE /api/reviews/:review_id":
        "I will delete the specified review for you.",
    },
  };
  res.status(200).send(endpoints);
};
