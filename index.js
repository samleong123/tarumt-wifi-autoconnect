const fs = require('fs');
const path = require('path');
const readline = require('readline');
const dns = require('dns');
const axios = require('axios');
const qs = require('qs');
const chalk = require('chalk');

const basePath = process.pkg ? process.cwd() : __dirname;
const filePath = path.join(basePath, 'account.json');


const tarumt_wifi_domain = "connect.tarc.edu.my";
const LOGIN_URL = 'https://connect.tarc.edu.my/login';
const TIMEOUT = 10000; // 10 seconds timeout
const MAX_RETRIES = 3; // Retry up to 3 times



// Use an async helper to ask questions
function askQuestion(promptText) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    // Print the prompt and then wait for input.
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function storeUsernamePwd(){
  const username = await askQuestion(chalk.cyan("🔹 Enter your TAR UMT WiFi Username: "));
  const password = await askQuestion(chalk.cyan("🔹 Enter your TAR UMT WiFi Password: "));
  const data = { username, password };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(chalk.green("✅ TAR UMT WiFi Account Data Saved!"));
}

async function init() {
    console.log(chalk.bold.green("TAR UMT WiFi Auto Connect Program"));
    console.log(chalk.green("Created by Sam Sam"));
    
    if (!fs.existsSync(filePath)) {
      console.log(chalk.yellow("⚠ No TAR UMT WiFi Account Data Found. Please provide your TAR UMT WiFi Account."));
      await storeUsernamePwd();
    } else {
      console.log(chalk.green("✅ TAR UMT WiFi Account Data Found!"));
    }
    
    checkIPAddress();
  }
  

function checkIPAddress() {
  dns.lookup(tarumt_wifi_domain, (err, address, family) => {
    if (err) {
      console.error(chalk.red("❌ You are not connected to TAR UMT WiFi"));
      exit();
    }

    if (address === "2.2.2.2") {
      console.log(chalk.green("✅ You are connected to TAR UMT WiFi"));
      initConnection();
    } else {
      console.log(chalk.red("❌ You are not connected to TAR UMT WiFi"));
      exit();
    }
  });
}

function getUsernamePwd(){
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function initConnection(retries = 0) {
  try {
    const accountData = getUsernamePwd();
    const data = qs.stringify({
      username: accountData.username,
      password: accountData.password,
      dst: 'https://google.com'
    });

    const config = {
      method: 'post',
      url: LOGIN_URL,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'Referer': 'https://wifi2.tarc.edu.my/',
        'Origin': 'https://wifi2.tarc.edu.my',
      },
      data: data
    };

    console.log(chalk.blue("🔄 Attempting to log in..."));

    const response = await axios.request(config);
    
    if (response.data.includes("<h1>You are logged in</h1>")) {
      console.log(chalk.green("✅ Login successful!"));
      console.log(chalk.green("✅ You are now connected to TAR UMT WiFi"));
        exit();
    } else {
      console.error(chalk.red("❌ Login failed. Please check your username and password and try again."));
      exit();
    }

  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.response?.status >= 500) {
      if (retries < MAX_RETRIES) {
        console.warn(chalk.yellow(`⚠ Request timed out. Retrying ${retries + 1}/${MAX_RETRIES}...`));
        return initConnection(retries + 1);
      } else {
        console.error(chalk.red("❌ Maximum retry attempts reached. Login failed."));
        exit();
        
      }
    } else {
      console.error(chalk.red(`❌ Login error: ${error.message}`));
      exit();
    }
  }
}

// Start the process
init();

function exit(){
    console.log(chalk.yellow("🔴 Press Enter to Exit Program"));
    // Wait for the user to press Enter
    process.stdin.resume();
    process.stdin.once('data', () => process.exit(1));
}

