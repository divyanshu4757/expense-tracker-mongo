# expense-tracker-major

1st step : created frontend for signup screen using bootstrap

# expense-tracker-major-project
# expense-tracker-major-project
# expense-tracker-major-project

#file system notes



we should not store our files in the server because when we scale up horizontally , how would be a access the file which is only in main server 



aws s3 for storing files. every server can access it if permissions are granted
- 99.999% availability



AWS

-Admin account-root(CTO, senior manager)->read,write ,delete permission
-IAM roles->given to juniors->restricted access for employees(like if employee is working on 1 product so he will get only that product related files access)


        - dev environment->delete,read,write and update
        -product environment->only read
 
-We created(through root account) an IAM user named ramu and gave him only s3 access




s3

- bucket(basically a folder)
-bucket versioning-to keep history


use s3 with code

- make an IAM user who atleast has s3 access(eg name-> s3bot)

in code we will write go ahead and upload this file -> .csv , .txt.  ,.mov ,.jpeg and specify in which bucket to upload 

only the iam user can upload (identify him with accesskeyId and secret key);

we have to make the  file url public

then we will get a response{
    location: "http://type",

}and then send it to frontend

error{
    log the error 
    send a respnse backe to frontend as failure
}


ssl/tsl->protect data in transition

commits are basically snapshots of our code and we can easilt switch between them.

branches  facilitates  maintain different versions of the code i.e. separated development of new features and bugfixing.

remote repositories  allows storing code ,commits

# new_expenses
# expense-tracker-mongo
