# Init Project

1. npm init
2. npm install -save sequelize
3. npm install -g sequelize-cli
4. sequelize init
5. edit connection inside config


# Edit Data Models

1. Create model by command line
~~~ shell
	sequelize model:create --name Todo --attributes "title:string, complete:boolean,UserId:integer"
~~~

2. Manual Edit on models\* folder

# Mirgate & setting up DB

sequelize db:migrate



##Ref
http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.V8z7Mfl96Co