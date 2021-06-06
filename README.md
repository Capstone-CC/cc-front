# How To Run

How to run web client on local enviroment with remote server

## Install

You need to install node -> https://nodejs.org/

You can check node is installed well by this commnad

``` 
$ npm -v 
> 6.14.5
```

And install npm package dependancy

```
$ npm run install
```

We preserve api with ssl. So, You need to modify ```hosts``` file

```
Window -> C:\Windows\System32\drivers\etc\hosts

Mac -> /etc/hosts
```

Then add this config to hosts file with sudo access

```
...
127.0.0.1	local.cauconnect.com
...
```

## Run

Just type command on local repository location

``` 
$ npm run start 
```

Now you can access ```local.cauconnect.com``` with remote server
