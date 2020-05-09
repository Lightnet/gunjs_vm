# gunjs_vm

# Created by: Lightnet

# License: MIT

# Packages:
 * vue
 * polka
 * gun
 * gulp
 * webpack

Note there are other packages.

# Information:
 Testing vuejs for gunjs functions to work with chat.

 Chat function that work with the RAD. It to load byte size and not whole map list.
 
 Note the gun send to other clients will get node null data but key id send. (It may break in latest gun 0.2020.430 version. gun 0.2020.116 works)

# Features:
 * Login / Register UI (seajs functions)
 * Forgot Passphrase Hint UI
 * Hint Passphrase UI
 * Change Passphrase UI (seajs functions)
 * Simple Chat Test (It may break in latest gun 0.2020.430 version. gun 0.2020.116 works)
 * Users Contacts (wip)
 * Public Chat with simple seajs
 * Private Messages Public Key
 * Private Chat (not build yet)

# Install and Run:

```
    npm install
    gulp default
```
`gulp default` will run auto build and server web.

## Notes:
 * There are two build.
 * gulp default ( auto build and web server )
 * npm start (webpack dev)

# Links:
 * https://webomnizz.com/setup-vuejs-with-webpack-4/
 * https://www.w3schools.com/howto/howto_css_loader.asp
