var Users = require('../models/users');


/**
 * Finds a user by given user name.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
function findByUsername(req, res) {
    console.log("finds by user name");
    // tries to find the user
    Users.findOne({ userName: req.query.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }
        console.log(user);
        var result = Object.assign({}, user._doc);
        // hide some important attribute!
        delete result.password;
        delete result.postedTotal;
        return res.json(result);
    })
}

/**
 * Finds a user info when the user is on his own main page.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
function findSelfOnMainPage(req, res) {
    console.log("on main page");
    // tries to find the current user
    Users.findOne({ userName: req.query.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }
        // tries to find all users followed by current user
        Users.find({ userName: { "$in": user._doc.follow } },
            function(err, followedByCurrent) {
                if (err) {
                    throw err;
                }
                var result = user._doc;
                result.postsOnPage = [];
                console.log(followedByCurrent);
                // puts all posts of users followed by current user
                // in to the respond body
                for (index in followedByCurrent) {
                    result.postsOnPage =
                        result.postsOnPage.concat(followedByCurrent[index]._doc.posts);
                }
                // puts current user's own posts into result
                result.postsOnPage = result.postsOnPage.concat(user._doc.posts);
                console.log(result);
                // removes important attributes
                delete result.password;
                delete result.postedTotal;
                return res.json(result);
            })
    })
}

/**
 * Finds all users by given username key words.
 * If keywords is not given, send all users list to
 * front end.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
function findByNameKeyWords(req, res) {
    console.log("finds by user name key words");
    if (req.query.searchName) {
        var searchName = req.query.searchName;
    } else {
        var searchName = "";
    }
    // tries to find all users with key word
    Users.find({ userName: { $regex: searchName } }, function(err, users) {
        if (err) {
            throw err;
        }
        var result = [];
        for (index in users) {
            // adds each user to respound
            result.push({
                userName: users[index]._doc.userName,
                gender: users[index]._doc.gender,
                introduction: users[index]._doc.introduction
            });
        }
        console.log(result);
        res.json(result);
    })
}

/**
 * Handles GET request on \users
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.find = function(req, res) {

    if (req.query.userName) {
        if (req.query.mainPage) {
            return findSelfOnMainPage(req, res);
        } else {
            return findByUsername(req, res);
        }
    } else {
        return findByNameKeyWords(req, res);
    }
}

/**
 * Makes a new post.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.post = function(req, res) {
    // tries to find current user who posted
    Users.findOne({ userName: req.body.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }
        // creates the new post
        var newPost = {
            id: user._doc.postedTotal,
            userName: req.body.post.userName,
            content: req.body.post.content,
            commentedTotal: 0,
            comment: [],
            likes: [],
            time: req.body.post.time
        }

        // sets some attribute
        user.set({
            posts: user._doc.posts.concat([newPost]),
            // postedTotal indicates the total number posted(including deleted)
            postedTotal: user._doc.postedTotal + 1
        });
        console.log(user);
        // saves changes
        user.save(function(err, book) {
            if (err) {
                throw err;
            }
            console.log("posted from " + req.body.post.userName);
            res.json(JSON.stringify({ "posted from": req.body.post.userName }));
        })
    })
}

/**
 * Makes a comment under a post by a id number
 * of a certain post.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.commentAndLike = function(req, res) {
    // tries to find the user who commented
    Users.findOne({ userName: req.body.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }
        // loops through all posts
        for (index in user._doc.posts) {
            if (user._doc.posts[index].id == req.body.id) {

                // in case of a comment
                if (req.url == "/comment") {
                    // new comment
                    var newComment = {
                            id: user._doc.posts[index].commentedTotal,
                            userName: req.body.comment.userName,
                            content: req.body.comment.content,
                            time: req.body.comment.time
                        }
                        // add the comment
                    user.posts[index].comment =
                        (user._doc.posts)[index].comment.concat([newComment]);
                    user.posts[index].commentedTotal += 1;
                } else {
                    // in case of a like
                    var likes = Object.assign([],
                        (user._doc.posts)[index].likes);
                    console.log(likes);
                    // adds the like if the liker hasn't liked this post
                    if (!likes.includes(
                            req.body.userNameLiked)) {
                        (user.posts)[index].likes =
                            (user._doc.posts)[index].likes.concat(
                                [req.body.userNameLiked]);
                    }
                }

                console.log(user);
                // saves changes
                user.save(function(err, book) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log("comment/like on " + req.body.userName);
                    return res.json(
                        JSON.stringify({ "commented/liked on": req.body.userName }));
                })
                return
            }
        }
        res.status(400).json("Error: no such post");
    })
}

/**
 * Updates the user's information.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.modifyUser = function(req, res) {
    // finds the user who want to updates information
    Users.findOne({ userName: req.body.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }

        // If request body contains such an attribute,
        // then updates that attribute.
        // If some attributes doesn't exist in the request body,
        // then do nothing with those attributes.
        if (req.body.password) {
            user.password = req.body.password;
        }
        if (req.body.birthday) {
            user.birthday = req.body.birthday;
        }
        if (req.body.gender) {
            user.gender = req.body.gender;
        }
        if (req.body.introduction) {
            user.introduction = req.body.introduction;
        }

        console.log(user);

        // saves changes
        user.save(function(err, book) {
            if (err) {
                throw err;
            }
            console.log("information update of " + req.body.userName);
            res.json(JSON.stringify({
                "information undate of ": req.body.userName
            }));
        })
    })
}

/**
 * Let the current user to follow another user.
 * If the current user has already followed the other user,
 * let the current user unfollow that user.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.follow = function(req, res) {
    // finds the follower.
    Users.findOne({ userName: req.body.followFrom }, function(err, followFrom) {
        if (err) {
            throw err;
        }
        if (!followFrom) {
            return res.status(400).json("Error: no such user");
        }
        // finds the user followed
        Users.findOne({ userName: req.body.followTo },
            function(err, followTo) {
                if (err) {
                    throw err;
                }
                if (!followTo) {
                    return res.status(400).json("Error: no such user");
                }
                // If such a followFrom already follows followTo,
                // let the followFrom unfollows followTo.
                if (followFrom._doc.follow.includes(
                        req.body.followTo)) {
                    var temp = followFrom._doc.follow;
                    temp.splice(
                        followFrom._doc.follow.indexOf(req.body.followTo), 1);
                    followFrom.follow = temp;
                    temp = followTo._doc.followers;
                    temp.splice(followTo._doc.followers.indexOf(req.body.followFrom), 1);
                    followTo.followers = temp;
                    // If such a followFrom has not followed followTo,
                    // let the followFrom unfollows followTo.
                } else {
                    followFrom.follow =
                        followFrom._doc.follow.concat([req.body.followTo]);
                    followTo.followers =
                        followTo._doc.followers.concat([req.body.followFrom]);
                }

                // saves changes on followFrom
                followFrom.save(function(err, user) {
                    if (err) {
                        throw err;
                    }
                    // saves changes on follow To
                    followTo.save(function(err, user) {
                        if (err) {
                            throw err;
                        }
                        console.log("follow from " +
                            req.body.followFrom + " to " + req.body.followTo);
                        res.json(JSON.stringify({
                            "followFrom": req.body.followFrom,
                            "followTo": req.body.followTo
                        }))
                    })
                })
            })
    })
}


/**
 * Deletes a user by given username in request.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.deleteUser = function(req, res) {
    // tries to find the user and deletes it
    Users.findOneAndRemove({ userName: req.query.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }
        // tries to find all follows and followers of this deleted user
        Users.find({
            userName: {
                "$in": user._doc.follow.concat(user._doc.followers)
            }
        }, function(err, users) {
            for (index in users) {
                // deletes the deleted user from all user's follows
                if (users[index]._doc.follow.includes(req.query.userName)) {
                    var temp = users[index]._doc.follow;
                    temp.splice(
                        users[index]._doc.follow.indexOf(req.query.userName), 1);
                    users[index].follow = temp;
                }
                // deletes the deleted user from all user's followers
                if (users[index]._doc.followers.includes(req.query.userName)) {
                    var temp = users[index]._doc.followers;
                    temp.splice(users[index]._doc.followers.indexOf(req.query.userName), 1);
                    followTo.followers = temp;
                }
                // saves current user's changes
                users[index].save();
            }
        });
        res.json(JSON.stringify("Success"));
    })
}


/**
 * Deletes a post with given username and id of the post.
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.deletePost = function(req, res) {
    // tries to find the user of the post that need to be deleted
    Users.findOne({ userName: req.query.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }

        //loops through all posts of current user
        for (index in user._doc.posts) {
            // in case that such a post found
            if (user._doc.posts[index].id == parseInt(req.query.postId)) {
                var temp = user._doc.posts;
                temp.splice(index, 1);
                user.posts = temp;
                // saves changes
                return user.save(function(err, user) {
                    if (err) {
                        throw err
                    };
                    return res.json(JSON.stringify("Success"));
                })
            }
        }
        return res.status(400).json(JSON.stringify("Error: no such post!"));
    })
}


/**
 * Deletes a comment by given username, id of post and id of comment
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.deleteComment = function(req, res) {
    // tries to find the user who has the post in which there is a comment
    // that need to be deleted
    Users.findOne({ userName: req.query.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }
        // loops through posts
        for (index in user._doc.posts) {
            // post found
            if (user._doc.posts[index].id == parseInt(req.query.postId)) {
                // loops through all comments of current post
                for (indexComment in user._doc.posts[index].comment) {
                    // such a comment is found
                    if (user._doc.posts[index].comment[indexComment].id ==
                        parseInt(req.query.commentId)) {
                        var temp = user._doc.posts[index].comment;
                        temp.splice(indexComment, 1);
                        user.posts[index].comment = temp;
                        // saves changes
                        return user.save(function(err, user) {
                            if (err) {
                                throw err
                            };
                            return res.json(JSON.stringify("Success"));
                        })
                    }
                }
                return res.status(400).json(JSON.stringify("Error: no such comment!"));
            }

        }
        return res.status(400).json(JSON.stringify("Error: no such post!"));
    })
}

/**
 * Login!
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.login = function(req, res) {
    Users.findOne({ userName: req.body.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json("Error: no such user");
        }
        if (user._doc.password != req.body.password) {
            return res.status(400).json("Error: password is not correect");
        }
        return res.json("Success")
    })
}


/**
 * Adds a new user!
 * @param  {Object} req request from front end
 * @param  {Object} res respond to front end
 * @return {Object}
 */
exports.newUser = function(req, res) {
    // checks if the user already exists
    Users.findOne({ userName: req.body.userName }, function(err, user) {
        if (err) {
            throw err;
        }
        // user already exists!
        if (user) {
            return res.status(400).json("Error: such user already exists!");
        }
        // creates a new user
        var newUser = new Users;
        // sets each attribute
        newUser.userName = req.body.userName;
        newUser.password = req.body.password;
        newUser.birthday = req.body.birthday;
        newUser.gender = req.body.gender;
        newUser.introduction = req.body.introduction;
        newUser.posts = [];
        newUser.postedTotal = 0;
        newUser.follow = [];
        newUser.followers = [];
        newUser.admin = false;
        console.log(newUser);

        // saves cahnges
        newUser.save(function(err, doc) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log("new use: " + req.body.userName);
            res.json(JSON.stringify({
                "new": req.body.userName
            }));
        })
    })
}
