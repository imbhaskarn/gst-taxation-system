This project is a minimal gst taxation system. I have built this project with node.js. For data storage mongoDB database is used. This app is an backend api.


This app has three user types. First user role(basic) is for taxpayes. user role accountant is for tax accountant and the third one is admin that is app admin.

*These users have following rights:*

# basic
--can create a tax return
--can view his own tax return.
--can pay his own tax return.

# accountant
--can update certain details in tax return created by user.
--can set due date for a specific tax return
--can mark a tax return reviewed
--can delete a tax return created by user
--can view all tax return

# admin
--can inherit right of a basic user except creating and paying a tax return
--can update certain details in a tax return
--can view all tax return

# api routes

"api/signup" for user sign up
{
	"name":"john doe",
	"username":"username",
	"role":"basic", 
	"password": "johndoe1"
}

"api/signin" for user login 

{
	"username":"username",
	"password": "johndoe"
}

method post

--after succefull login we get an api token that is used for further requests.

'api/new' isLoggedIn,
this route is for  creating new tax return. This route takes parameters as follows:

method:post

{
   "name":"mr john",
   "companyname":"bright star ltd",
   "netsale":2668692,
   "salaryincome":974958,
   "statecode":35,
   "sharemarketincome":50000

}

'api/all', 
this is get route and return all tax returns. For basic user this only returns own tax returns

'api/one/:id'  method:get
returns single record returns empty if user is basic

'api/review/:id',  method: post 

this route is for reviewing tax returns and takes follwing parameters.
{
 "pan": "abcd12k",
 "totalincometax": 80000,
  "gstno":"raj008indgst"
 }


'/createdue', method:post

{
   "date": "2022-03-11",
   "id": "622ea27a4c499b0ff41ac867"
   
}

--This route takes two parameters record id and date(iso fromat)
-- On success returns updated document
-- This route can be accessed by accountant only

'/pay:id',

This is a get request and returns with updated records


'/delete/:id',
this route is for deleting a certain tax record and can be accessed by admin or accountant


'/delete/user/:id', isLoggedIn, isAdmin

for deleting a certain user this route is admin only.



### required environment variables

SECRET="5acbd1911e44"
PORT: 3000
MONGO_DB_URI=mongodb://mongo_db:27017/testdb