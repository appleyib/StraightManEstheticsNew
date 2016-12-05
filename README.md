# StraightManEsthetics
Note: please run in ***Chrome***, because we have added extra features to use cookies to store current user information locally! Firefox does not support local cookies.

***How to run the app:***

Just directly go to this url through Chrome:

[obscure-scrubland-69547.herokuapp.com](obscure-scrubland-69547.herokuapp.com/)

will let you see our final product.


***How to run locally:***

Open terminal and cd to project dir. Use npm install to install all needed node modules.

type: node server.js

Open ***CHROME*** and type localhost:3000. You will see the login page!


***How to unit test the backend:***


Open terminal and execute following command:

npm test


***Project***


We plan to design a social network application to provide a platform for people who desire to public their ideas anonymously and discuss the ideas with other users. The purpose of this application is provide a chance to public some dissimliar thoughts without facing the risk of continuous attack from other users. Our main target users is the morden youngers who prefer to communicate with others through texts rather than face-to-face or telephone also the people who would like to try some new social networks.



Our main data will be user's profile and posts, since the relationship between the data is simple we decide to use MongoDB to load/save the data of the application. Here is the detail of the features:



***Features of the application:***

When login, app will check whether the user is an admin or not.



If the user is a normal user, he will then see a main page of his own.

If the user is an admin, he will see an admin control pannel page.



***Normal User:***

A normal user can make a post , see/comment/like all his own/friends'(who the normal user fllows) posts and search possible users by key words(regex representation supported) through his main page.


A normal user can see all his follows or followers by clicking follow/followers button on the main page.


In the profile page, all of the personal information except password of a user will be displayed. The posts of such an user with attaching comments can also be seen on this page. A normal user can follow/unfollow any other user through that user's profile page.


A normal user can see all other users' profile but can not edit them. However, a normal user can edit his own personal information and change password through his own profile page.


When a normal user clicks some other's username in any way, he will enter such a user's profile page.


A normal user can deletes his own posts and comments through main page or through profile page.



***Admin:***

An admin can see a list of all users, search possible users by key words, deletes users, creates new users and repopulates the database through the admin control pannel page.


An admin can click any normal users' username on the user's list to enter the profile page of such an user. 


In the profile page, an admin can edit anyone's personal information and passwords, and the admin can also see/deletes any posts of this person with the attached comments.



***Creativity Additional Features:***


We successfully deployed the app on the heroku.


We used cookies to handle the front end data and the user data can remain  between different views until the user logs out!


We used mongodb to store all data and we put the database remotely in mLab and it can continuously run.


For security, we will never put password to front end: all actions that involves password will be done in the back end. There is no way to retrieve password from front end.


Users can follow/unfollow each others.


Users can ***comment*** and ***like*** each other's posts.


We used Mocha to unit test the backend node.js!


We spent some time to make a very user friendly UI and it is a really innovative one!
