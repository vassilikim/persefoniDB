# Application Installation Steps

To install the application from GitHub and connect it to a local MySQL database, please follow the steps below:

1. Install NodeJS:

   - Visit the NodeJS website (https://nodejs.org/) and download the latest version of NodeJS for your operating system.
   - Follow the installation instructions provided for your system.

2. Install MySQL:

   - Download and install the latest version of MySQL for your operating system from the official MySQL website (https://www.mysql.com/).
   - Follow the installation instructions provided for your system.
   - Note down the username and password you will use to access the database.

3. Download and install the application from GitHub:

   - Visit the application's repository page on GitHub.
   - Click on the "Code" button and copy the repository's URL.
   - Open a command prompt and navigate to the C:// directory by executing "cd C://".
   - Run the command "git clone <repository_url>" to install the application files into a directory named "persefoniDB".

4. Install project dependencies:

   - In the same command prompt run the command "cd persefoniDB/backend" to navigate to the "backend" folder.
   - Execute the command "npm install" to install all the dependencies required by the project. This will create a "node_modules" folder with all the packages needed by the application.

5. Configure the database connection and other configurations:

   - Open the "config.env" file in the "backend" folder and modify it as follows:
     - Replace <db_username> and <db_password> with the username and password you set during the database installation.
     - Replace <db_instancename> and <db_port> with the name and port of your specific MySQL instance (e.g., root and 3036).
     - Replace <db_name> with the name of your database.

6. Run the application:
   - In the command prompt, execute the command "npm start" inside the "backend" folder.
   - Open a browser of your choice and go to "http://localhost:3000".

To create a backup of the database and restore the system from it as the main administrator of the system, follow the steps below to allow MySQL to access the folder with the application files:

- Open File Explorer and in the top bar, select View -> Hidden Items to show hidden files.
- Select Program Data -> MySQL -> MySQL Server 8.0 and open the my.ini file with administrator privileges using an editor of your choice.
- Locate the "secure_file_priv" system variable in the file and change its value to an empty string as follows: secure_file_priv: "".
- Restart MySQL by opening services.msc, finding the MySQL option, and selecting Restart.

Finally, to create your local database and populate it with data, you can execute the SQL scripts found in the "DML+DDL scripts" folder (first run create_database.sql and then legitdummydata.sql), replacing <db_name> with the name you have given to your database.
