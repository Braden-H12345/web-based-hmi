This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project is the start of a web based modbus communication protocol for building HMIs.

Currently (as of 12/9/25) the pages can be made via uploading or creating a csv (technically a scsv as one of the properties is raw JSON which needs commas, so pure csv wont work). Once a csv file is present you can run the "build HMIs" batch file and all will be rebuilt (including any that were edited). Then just refresh the page if the page is open. To launch the app simply run "run-server.bat" this should launch both the PLC backend server and the web server in a single command prompt window

Packages needed

modbus-serial, for express server communication with PLCs: https://www.npmjs.com/package/modbus-serial

cors to allow cross origin port communication. Purely for running both servers in one window: https://www.npmjs.com/package/cors

csv-parse to parse the csv files: https://www.npmjs.com/package/csv-parse

express to host the modbus-serial API: https://expressjs.com/

react as that is the framework this is built on: https://react.dev/

Node js to be able to use node packages: https://nodejs.org/

Additional packages (not needed as of now, but may be in the future)

react-dnd this allows for drag and drop functionality. I figure it may be useful for editing pages quickly, but did not see an eloquent way to implement it immediatly as I would have needed to essentially duplicate components so that there are draggable and nondraggable versions of the same thing: https://www.npmjs.com/package/react-dnd

