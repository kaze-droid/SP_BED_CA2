// Using Jdenticon to generate random images for users

const jdenticon = require("jdenticon");
const fs = require("fs");

const size = 150;
const numOfImages = 1;

for (let i = 1; i <= numOfImages; i++) {
    // Generate a string
    let value = (Math.random() + 1).toString(36).substring(4);
    const png = jdenticon.toPng(value, size);
    fs.writeFileSync(`./profile${i}.png`, png);
}