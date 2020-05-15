#!/usr/bin/env node

const axios = require("axios");

console.log("**Calculating**");

axios.defaults.baseURL = "http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com";

const category = "Air Conditioners";
let page = "/api/products/1";

main();
async function main() {
  const totalItems = [];

  while (page) {
    try {
      const result = await get(page);
      const { next = null, objects = [] } = result;
      page = next;
      
      const items = objects.filter(object => {
        if (object.category === category) {
          object.cubicWieght = getCubicWeight(object.size);
          return true;
        }
        return false;
      });
      totalItems.push(...items);
    } catch (e) {
      console.error(e);
      break;
    }   
  }

  const averageCubicWeight = getAverageCubicWeight(totalItems);
  console.log(`The average cubic weight of all ${totalItems.length} ${category} is: ${averageCubicWeight.toFixed(2)}kg`);
}

function getCubicWeight(size) {
  const { width, length, height } = size;
  return convertCMtoM(height) * convertCMtoM(width) * convertCMtoM(length) * 250;
}

function getAverageCubicWeight(items) {
  const sum = items.reduce((p, c) => c.cubicWieght += p, 0);
  return sum / items.length;
}

function convertCMtoM(number) {
  return number / 100;
}
async function get(page) {
  const items = await axios.get(page);
  return items.data;
}