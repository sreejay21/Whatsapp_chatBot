// // // // const express = require("express");
// // // // const app = express();

// // // // app.use(express.json());

// // // // app.post("/webhook", (req, res) => {
// // // //   try {
// // // //     const value =
// // // //       req.body.entry?.[0]?.changes?.[0]?.value;

// // // //     const contact = value?.contacts?.[0];

// // // //     if (contact) {
// // // //       const phoneNumber = contact.wa_id;
// // // //       const whatsappName = contact.profile.name;

// // // //       console.log("Phone:", phoneNumber);
// // // //       console.log("WhatsApp Name:", whatsappName);

// // // //       // Save to DB here
// // // //     }

// // // //     res.sendStatus(200);
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.sendStatus(500);
// // // //   }
// // // // });


// // // let arr = [5, 1, 9, 3,3, 7,4,1,12,4,9,5,8,6];
// // // // // let min=arr[0]
// // // // // for(i =0 ;i<arr.length;i++){
// // // // //   if(arr[i]<min){
// // // // //     min=arr[i]
// // // // //   }
// // // // // }
// // // // // console.log("Min value is:",min)
// // // // let target = 9

// // // // // for(i=0;i<arr.length;i++){
// // // // //   if(arr[i]===target){
// // // // //     console.log("Target found at index:",i)
// // // // //   }else{
// // // // //     console.log("Not found at index:",i)
// // // // //   }
// // // // // }


// // // // let found = false;
// // // // for(let i = 0; i < arr.length; i++){
// // // //     if(arr[i] === target){
// // // //         found = true;
// // // //         console.log("Target found at index:", i);
// // // //         break;
// // // //     }
// // // // }
// // // // if(!found){
// // // //     console.log("Target not found in array");
// // // // }

// // // // for(let i =arr.length-1; i>=0; i--){
// // // //     console.log(arr[i])
// // // // }

// // // let seen={}
// // // let resut = []
// // // console.log("Original array:",arr)
// // // for(let i=0;i<arr.length;i++){
// // //     if(!seen[arr[i]]){
// // //         seen[arr[i]]=true
// // //         resut.push(arr[i])
// // //     }
// // // }
// // // console.log("Resultant array with unique values:",resut)



// // // // let arr =[1,4,0,4,3,5,0,2,3,1]
// // // // let zeroCount=0
// // // // let result = []

// // // // for(let i=0;i<arr.length;i++){
// // // //   if(arr[i]===0){
// // // //     zeroCount++
// // // //   }else{
// // // //     result.push(arr[i])
// // // //   }
// // // // }
// // // // for(let i=0;i<zeroCount;i++){
// // // //   result.push(0)
// // // // }

// // // // console.log("Array after moving zeros to the end:",result)



// // // // let arr = [1, 2, 3, 4, 5];
// // // // let target = 5;

// // // // let seen = {};

// // // // for (let i = 0; i < arr.length; i++) {
// // // //     let needed = target - arr[i];
// // // //     if (seen[needed]) {
// // // //         console.log(needed, arr[i]);
// // // //     } else {
// // // //         seen[arr[i]] = true;
// // // //     }
// // // // }


// // // // let arr = ["bat", "mat", "tab", "tam", "tom", "sat", "tas"];

// // // // let map = {};
// // // // let count = 0;
// // // // for (let i = 0; i < arr.length; i++) {
// // // //     let word = arr[i];

// // // //     // sort the word to create a key
// // // //     let key = word.split("").sort().join("");
// // // //     console.log(key);
// // // //     // if key does not exist, create empty array
// // // //     if (!map[key]) {
// // // //          map[key] = [];
// // // //      }

// // // //     // // push word into its anagram group
// // // //     map[key].push(word);

// // // // }

// // // // // convert object values to array
// // // // let result = Object.values(map);

// // // // console.log(result);


// // // // let arr = ["bat", "mat", "tab", "tam", "tom", "sat", "tas"];

// // // // let map = {};

// // // // for (let i = 0; i < arr.length; i++) {
// // // //     let key = arr[i].split("").sort().join("");

// // // //     if (!map[key]) {
// // // //         map[key] = 1;
// // // //     } else {
// // // //         map[key]++;
// // // //     }
// // // // }

// // // // let count = Object.keys(map).length;

// // // // console.log("Number of anagram groups:", count);




// // const axios = require("axios");
// // require("dotenv").config();

// // console.log("WHATSAPP_PHONE_NUMBER_ID:", process.env.WHATSAPP_PHONE_NUMBER_ID);
// // console.log("TOKEN EXISTS:", !!process.env.WHATSAPP_TOKEN);

// // async function checkWhatsAppNumber(phone) {
// //   try {
// //     await axios.post(
// //       `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
// //       {
// //         messaging_product: "whatsapp",
// //         to: phone,
// //         type: "template",
// //         template: {
// //           name: "hello_world",
// //           language: { code: "en_US" }
// //         }
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
// //           "Content-Type": "application/json"
// //         }
// //       }
// //     );

// //     return true;
// //   } catch (err) {
// //     const code = err.response?.data?.error?.code;
// //     if (code === 131026) return false;
// //     console.error("RAW ERROR:", err.response?.data);
// //     throw err;
// //   }
// // }

// // (async () => {
// //   const result = await checkWhatsAppNumber("+917293809755");
// //   console.log("Is WhatsApp number?", result);
// // })();

// // let arr =[1, 2, 2, 3, 3, 3, 7,74,8,767];

// // let result = {}

// // for(let i=0;i<arr.length;i++){
// //     if(result[arr[i]]){
// //         result[arr[i]]++
// //     }else{
// //         result[arr[i]]=1
// //     }
// // }

// // console.log(result)
// //  let min =arr[0]
// //   for(let i=0;i<arr.length;i++){

// //     if(arr[i]<min){
// //         min=arr[i]
// //     }
// //   }
// //   console.log("Min value is:",min)

// // let target = 3;
// // let found = false;

// // for (let i=0;i<arr.length;i++){
// //     if(arr[i]===target){
// //         console.log("Target found at index:",i)
// //         found = true;
// //         break;
// //     }

// // }
// // if(!found){
// //     console.log("Not found at index:")
// // }

// // let arr = [3, 4, 5, 1, 2];
// // let count = 0;
// // let result = []
// //  for(let i=0;i<arr.length;i++){
// //     if(arr[i]<arr[i+1]){
// //         count++
// //         result.push(arr[i])
// //     }
// //  }
// //   console.log("Number out of order is:",count,result)
// // let sentences = ["alice and bob love leetcode", "i think so too", "this is great thanks very much"]
// // var mostWordsFound = function(sentences) {
// //     let maxWords = 0;
// //     for(let i =0;i<sentences.length;i++){
// //         let words = sentences[i].split(" ")
// //         console.log("Words in sentence",i,":",words.length)
// //         if(words.length > maxWords){
// //             maxWords = words.length;
// //         }
// //     }
// //     console.log("Maximum number of words in a sentence:",maxWords)
// // };

// // mostWordsFound(sentences);



// // let arr =[3,0,2,0,4,0,5]
// // let target = 10
// // let count = 0;
// // let largest = -Infinity;
// // let secondLargest = -Infinity;
// // for(let i=0;i<arr.length;i++){
// //     if(arr[i]>largest){
// //         secondLargest = largest;
// //         largest = arr[i]
// //     }   
// // }
// // console.log("Largest value is:",largest)
// // console.log("Second Largest value is:",secondLargest)


// // for(let i=arr.length-1;i>=0;i--){
// //     if(arr[i]===target){
// //         console.log("Target found at index:",i)
// //         found = true;
// //     }
// // }
// // if(!found){ 
// //     console.log("Target not found in array")
// // }
 
// // for(let i=0;i<arr.length;i++){
// //     if(arr[i]===target){
// //         count++
// //     }
// // }
// // console.log("Number of times target found:",count)


// // // remove duplicates from array
// // let arr = [1, 2, 2, 3, 4, 4];
// // let seen = {}
// // let duplicates = []
// // for(let i=0;i<arr.length;i++){
// //     if(!seen[arr[i]]){
// //         seen[arr[i]]=true
// //     }else{
// //         duplicates.push(arr[i])
// //     }
// // }
// // console.log("Duplicate values are:",duplicates)


// // const arr = [1, 2, 3, 4, 5];
// // const target = 7;

// // function findPairWithSum(arr, target) {
// //     const seen = {};
// //     for (let i = 0; i < arr.length; i++) {
// //         const needed = target - arr[i];
// //         if (seen[needed]) {
// //             console.log("Pair found:", needed, arr[i]);
// //             return;
// //         } else {
// //             seen[arr[i]] = true;
// //         }
// //     }
// //     console.log("No pair found with the given sum.");
// // }
// // findPairWithSum(arr, target);


// //plus one problem
// // let digits = [9,9,9]
// // for(let i=digits.length-1;i>=0;i--){
// //     if(digits[i]===9){
// //         digits[i]=0
// //     }else{
// //         digits[i]++;
// //         break;
// //     }

// // const prices = [7, 1, 5, 3, 6, 4];
// // let minPrice = prices[0];
// // let maxProfit = 0;
// // for(let i=1;i<prices.length;i++){
// //     if(prices[i]<minPrice){
// //         minPrice = prices[i]
// //         console.log("New minimum price found:", minPrice)
// //     }
// //     else if(prices[i]-minPrice > maxProfit){
// //         maxProfit = prices[i]-minPrice
// //         console.log("New maximum profit found:", maxProfit, "by selling at price:", prices[i], "and buying at price:", minPrice)
// //     }
// // }
// // console.log("Maximum profit is:", maxProfit)


// //Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.
// // let nums = [1, 2, 3];
// // let k = 1;
// // function containsNearbyDuplicate(nums, k) {
// //     const seen = {};
// //     for (let i = 0; i < nums.length; i++) {
// //         if (seen[nums[i]] !== undefined && i - seen[nums[i]] <= k) {
// //             console.log("Nearby duplicate found:", nums[i], "at indices", seen[nums[i]], "and", i);
// //             return true;
// //         }
// //         seen[nums[i]] = i;
// //     }
// //     console.log("No nearby duplicates found.");
// //     return false;
// // }
// // containsNearbyDuplicate(nums, k);

// // let result = {}

// // for(let i=0;i<nums.length;i++){
// //     if(result[nums[i]]){
// //         result[nums[i]]++
// //     }else{
// //         result[nums[i]]=1

// //     }
// //     }

// //     console.log(result)


// // let seen = {}
// // let result = []

// // for(let i=0;i<nums.length;i++){
// //     if(!seen[nums[i]]){
// //     seen[nums[i]]=true
// //     result.push(nums[i])
// //     }
// // }
// // console.log(result)
// // ___________________________________________________________________________________________//

// // TECH PROBLEM SOLVING CODE BELOW:


// // Reverse a string without using built-in functions
// // function reverseString(str) {
// //     let arr = [];

// //     for (let i = str.length - 1; i >= 0; i--) {
// //         arr.push(str[i]);
// //     }

// //     return arr.join('');
// // }

// // let str = "Hello, World!";
// // let result = reverseString(str);

// // console.log(result)

// // Check array is sorted or not
// // function isSorted(arr) {
// //     for (let i = 1; i < arr.length; i++) {
// //         if (arr[i] < arr[i - 1]) {   
// //             return false;
// //         }
// //     }
// //     return true;
// // }

// // let arr = [1, 2, 3, 4, 5];
// // let result = isSorted(arr);

// //Second largest number in array
// // let arr =[10]
// // let largest = -Infinity;
// // let secondLargest = -Infinity;
// // for(let i=0;i<arr.length;i++){
// //     if(arr.length===0){
// //     console.log("Array is empty")
// // } else if(arr.length===1){
// //     console.log("Only one element in array:",arr[0])
// // }
// //     if(arr[i]>largest){
// //         secondLargest = largest;
// //         largest = arr[i]
// //     }
// // }
// // console.log("Largest value is:",largest)
// // console.log("Second Largest value is:",secondLargest)


// // let arr =[3,0,2,0,4,0,5]
// // let target = 5

// // for(let i=arr.length-1;i>=0;i--){
// //     for(let j=i-1;j>=0;j--){
// //         if(arr[i]+arr[j]===target){
// //             console.log("Pair found:", arr[i], arr[j], "at indices", i, "and", j);
// //         }
// //     }
// // }

// // let arr1 = [1, 2, 3, 4, 5];
// // let arr2 = [4, 5, 6, 7, 8];
// // let result = []
// // // for(let i=0;i<arr1.length;i++){
// // //     for(let j=0;j<arr2.length;j++){
// // //         if(arr1[i]===arr2[j]){
// // //             result.push(arr1[i])
// // //         }
// // //     }
// // // }
// // // console.log("Common elements between arr1 and arr2:", result)

// // //Merge two sorted arrays

// // for(let i=0;i<arr1.length;i++){
// //     result.push(arr1[i])
// // }
// // for(let j=0;j<arr2.length;j++){
// //     result.push(arr2[j])
// // }
// const buf = Buffer.from("Hello");
// console.log(buf);


// function shift_zeros_to_the_end(nums) {
//   // Write your code here
//   let left =0
//   for(let right=1;right<nums.length-1;right++){
//     if(nums[right]!==0){
//         let temp =nums[left]
//         nums[left]=nums[right]
//         nums[right]=temp
//     }
//   }
//   return nums
// }
// shift_zeros_to_the_end([0,2,35,5,0,5])

let arr= [2,3,4,7,11,15]
let target =15

let left=0
let right = arr.length-1

while(left<right){
  let sum= arr[left] + arr[right]
  if(sum===target){
    return [left,right]
  }
  else if(sum<target){
    left ++
  }else{
    right --
  }
 
}
 return []