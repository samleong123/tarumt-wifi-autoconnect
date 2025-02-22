

# TAR UMT WiFi Auto Connect Program

**TAR UMT WiFi Auto Connect Program** is a Node.js application that automatically logs you into the TAR UMT WiFi network using your provided credentials. If no account data is found, the program will prompt you to enter your username and password and create an `account.json` file. It then checks your network connection via DNS and, if connected to the TAR UMT network, automatically sends a login request.

## Features

- **Automatic Credential Setup:**  
  Prompts the user to input credentials if `account.json` is missing and saves them for future use.

- **Network Verification:**  
  Uses DNS lookup to verify whether you are connected to TAR UMT WiFi.

- **Automated Login:**  
  Sends a POST request with your credentials to log in to the network automatically.

- **Colorful Console Output:**  
  Uses [Chalk](https://www.npmjs.com/package/chalk) to display colored messages for a better user experience.

- **Executable Build:**  
  Easily build standalone executables for Windows, macOS, and Linux using [pkg](https://github.com/vercel/pkg).

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)
- (For building executables) [pkg](https://www.npmjs.com/package/pkg) installed globally:
  ```bash
  npm install -g pkg
  ```

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/samleong123/tarumt-wifi-autoconnect.git
   cd tarumt-wifi-autoconnect
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

## Usage

1. **Run the Application:**
   ```bash
   npm run connect
   ```
   - On the first run, if `account.json` is not found, you will be prompted to enter your TAR UMT WiFi username and password.
   - The application checks if you are connected to TAR UMT WiFi (by verifying the DNS resolution) and then attempts to log you in.

2. **Console Output:**
   - Successful operations and errors are displayed in color for clear feedback.

## Building an Executable

This project can be packaged into a standalone executable using `pkg`.

1. **Ensure pkg is installed:**
   ```bash
   npm install -g pkg
   ```

2. **Build the Executable:**
   ```bash
   npm run build
   ```
   This command builds executables for Windows, macOS, and Linux (using Node.js v18) and places them in the `bin` directory.




## License
This project is licensed under the ISC License.

## Author
Created by [Sam Sam](https://www.samsam123.name.my)
