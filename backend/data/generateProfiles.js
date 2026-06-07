const fs = require('fs');

const maleFirstNames = ["Arjun","Rohan","Vikram","Rahul","Aditya","Karan","Nikhil","Siddharth","Amit","Raj","Akash","Vivek","Suresh","Manish","Deepak","Rohit","Sachin","Piyush","Gaurav","Varun","Ashish","Pranav","Tarun","Shivam","Ankit"];
const femaleFirstNames = ["Priya","Neha","Pooja","Anjali","Shreya","Ananya","Divya","Riya","Meera","Kavya","Nisha","Sunita","Aisha","Rekha","Swati","Sakshi","Pallavi","Simran","Tanvi","Kriti","Isha","Radhika","Megha","Sonia","Tanya"];
const lastNames = ["Sharma","Gupta","Patel","Singh","Kumar","Mehta","Shah","Joshi","Mishra","Verma","Agarwal","Reddy","Nair","Iyer","Bose","Kapoor","Malhotra","Khanna","Chauhan","Pandey","Rao","Pillai","Srivastava","Bansal","Tiwari"];
const cities = ["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Pune","Kolkata","Ahmedabad","Jaipur","Lucknow","Chandigarh","Indore","Bhopal","Noida","Gurgaon"];
const companies = ["TCS","Infosys","Wipro","HCL","Accenture","Deloitte","KPMG","Amazon","Google","Microsoft","Flipkart","Swiggy","Zomato","HDFC Bank","ICICI Bank","Goldman Sachs","JP Morgan","McKinsey","BCG","Bain"];
const designations = ["Software Engineer","Analyst","Manager","Consultant","Product Manager","Data Scientist","Marketing Executive","Financial Analyst","HR Manager","Operations Lead","Senior Engineer","Associate","Director","VP"];
const colleges = ["IIT Delhi","IIT Bombay","IIM Ahmedabad","SRCC","Lady Shri Ram","St. Stephens","Bits Pilani","VIT","Manipal University","Jadavpur University","Christ University","Symbiosis","NIT Trichy","Delhi University","Pune University"];
const degrees = ["B.Tech","B.Com","MBA","B.Sc","BA","M.Tech","CA","LLB","BBA","M.Sc"];
const castes = ["Brahmin","Kshatriya","Vaishya","Kayastha","Agarwal","Jain","Marwari","Patel","Nair","Iyer"];
const religions = ["Hindu","Muslim","Christian","Sikh","Jain","Buddhist"];
const languages = [["Hindi","English"],["Tamil","English"],["Telugu","Hindi"],["Bengali","English","Hindi"],["Marathi","Hindi","English"],["Gujarati","Hindi","English"],["Kannada","English"],["Malayalam","English"]];
const hobbiesPool = ["Reading","Travel","Yoga","Cricket","Cooking","Music","Photography","Gaming","Fitness","Dancing","Painting","Movies"];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(startYear, endYear) {
  const y = randInt(startYear, endYear);
  const m = String(randInt(1, 12)).padStart(2, '0');
  const d = String(randInt(1, 28)).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const profiles = [];


for (let i = 0; i < 50; i++) {
  const firstName = rand(femaleFirstNames);
  const lastName = rand(lastNames);
  profiles.push({
    id: `f${String(i+1).padStart(3,'0')}`,
    firstName, lastName,
    gender: "Female",
    dateOfBirth: randDate(1993, 2000),
    country: "India",
    city: rand(cities),
    height: randInt(152, 172),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
    phone: `9${randInt(100000000, 999999999)}`,
    ugCollege: rand(colleges),
    degree: rand(degrees),
    income: randInt(400000, 2500000),
    company: rand(companies),
    designation: rand(designations),
    maritalStatus: rand(["Never Married","Divorced","Widowed"]),
    languages: rand(languages),
    siblings: randInt(0, 3),
    caste: rand(castes),
    religion: rand(religions),
    wantKids: rand(["Yes","No","Maybe"]),
    openToRelocate: rand(["Yes","No","Maybe"]),
    openToPets: rand(["Yes","No","Maybe"]),
    diet: rand(["Vegetarian","Non-Vegetarian","Eggetarian"]),
    smoke: rand(["No","Occasionally","Yes"]),
    drink: rand(["No","Occasionally","Yes"]),
    familyType: rand(["Nuclear","Joint"]),
    complexion: rand(["Fair","Wheatish","Dark"]),
    manglik: Math.random() > 0.7,
    hobbies: hobbiesPool.sort(() => 0.5 - Math.random()).slice(0, 3),
    about: "Looking for a compatible life partner.",
    status: rand(["Active","Matched","On Hold"]),
    assignedMatchmaker: "matchmaker1"
  });
}


for (let i = 0; i < 50; i++) {
  const firstName = rand(maleFirstNames);
  const lastName = rand(lastNames);
  profiles.push({
    id: `m${String(i+1).padStart(3,'0')}`,
    firstName, lastName,
    gender: "Male",
    dateOfBirth: randDate(1990, 1998),
    country: "India",
    city: rand(cities),
    height: randInt(165, 185),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
    phone: `9${randInt(100000000, 999999999)}`,
    ugCollege: rand(colleges),
    degree: rand(degrees),
    income: randInt(600000, 4000000),
    company: rand(companies),
    designation: rand(designations),
    maritalStatus: rand(["Never Married","Divorced","Widowed"]),
    languages: rand(languages),
    siblings: randInt(0, 3),
    caste: rand(castes),
    religion: rand(religions),
    wantKids: rand(["Yes","No","Maybe"]),
    openToRelocate: rand(["Yes","No","Maybe"]),
    openToPets: rand(["Yes","No","Maybe"]),
    diet: rand(["Vegetarian","Non-Vegetarian","Eggetarian"]),
    smoke: rand(["No","Occasionally","Yes"]),
    drink: rand(["No","Occasionally","Yes"]),
    familyType: rand(["Nuclear","Joint"]),
    complexion: rand(["Fair","Wheatish","Dark"]),
    manglik: Math.random() > 0.7,
    hobbies: hobbiesPool.sort(() => 0.5 - Math.random()).slice(0, 3),
    about: "Looking for a compatible life partner.",
    status: rand(["Active","Matched","On Hold"]),
    assignedMatchmaker: "matchmaker1"
  });
}

fs.writeFileSync('./profiles.json', JSON.stringify(profiles, null, 2));
console.log(`Generated ${profiles.length} profiles!`);