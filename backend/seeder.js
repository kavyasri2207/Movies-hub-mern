import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Genre from "./models/Genre.js";
import Movie from "./models/Movie.js";

await connectDB();

const genreData = [
  { name: "Action" },
  { name: "Drama" },
  { name: "Sci-Fi" },
  { name: "Comedy" },
  { name: "Horror" },
  { name: "Romance" },
  { name: "Thriller" },
  { name: "Animation" },
];

const salt = await bcrypt.genSalt(10);
const adminPass = await bcrypt.hash("admin123", salt);
const userPass = await bcrypt.hash("user123", salt);

const userData = [
  { username: "Admin", email: "admin@moviesapp.com", password: adminPass, isAdmin: true },
  { username: "John Doe", email: "john@example.com", password: userPass, isAdmin: false },
  { username: "Jane Smith", email: "jane@example.com", password: userPass, isAdmin: false },
];

const seedDB = async () => {
  try {
    await Movie.deleteMany({});
    await Genre.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing data");

    const genres = await Genre.insertMany(genreData);
    console.log(`✅ ${genres.length} genres inserted`);
    const g = {};
    genres.forEach((genre) => (g[genre.name] = genre._id));

    const users = await User.insertMany(userData);
    const john = users[1];
    const jane = users[2];
    console.log(`✅ ${users.length} users inserted`);

    const movieData = [
      {
        name: "The Dark Knight",
        image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        year: 2008, genre: g["Action"], runtime: 152,
        trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
        detail: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Gary Oldman"],
        reviews: [{ name: "John Doe", rating: 5, comment: "Heath Ledger's Joker is absolutely iconic. Best superhero movie ever made.", user: john._id }],
        numReviews: 1, rating: 5,
      },
      {
        name: "Mad Max: Fury Road",
        image: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
        year: 2015, genre: g["Action"], runtime: 120,
        trailerUrl: "https://www.youtube.com/embed/hEJnMQG9ev8",
        detail: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland with the aid of a group of female prisoners and a drifter named Max.",
        cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "John Wick",
        image: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
        year: 2014, genre: g["Action"], runtime: 101,
        trailerUrl: "https://www.youtube.com/embed/C0BMx-qxsP4",
        detail: "An ex-hitman comes out of retirement to track down the gangsters that killed his dog and took everything from him.",
        cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "The Shawshank Redemption",
        image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        year: 1994, genre: g["Drama"], runtime: 142,
        trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco",
        detail: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
        reviews: [{ name: "Jane Smith", rating: 5, comment: "A timeless masterpiece. The ending hits different every time.", user: jane._id }],
        numReviews: 1, rating: 5,
      },
      {
        name: "Forrest Gump",
        image: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        year: 1994, genre: g["Drama"], runtime: 142,
        trailerUrl: "https://www.youtube.com/embed/bLvqoHBptjg",
        detail: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
        cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Whiplash",
        image: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
        year: 2014, genre: g["Drama"], runtime: 106,
        trailerUrl: "https://www.youtube.com/embed/7d_jQycdQGo",
        detail: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an obsessive instructor.",
        cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Inception",
        image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        year: 2010, genre: g["Sci-Fi"], runtime: 148,
        trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
        detail: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
        reviews: [{ name: "John Doe", rating: 5, comment: "Mind-bending from start to finish. Nolan at his best.", user: john._id }],
        numReviews: 1, rating: 5,
      },
      {
        name: "Interstellar",
        image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        year: 2014, genre: g["Sci-Fi"], runtime: 169,
        trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
        detail: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "The Matrix",
        image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        year: 1999, genre: g["Sci-Fi"], runtime: 136,
        trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
        detail: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
        cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Dune",
        image: "https://image.tmdb.org/t/p/w500/d5NXSklpcvkCJzO3RKvJ1RPzgct.jpg",
        year: 2021, genre: g["Sci-Fi"], runtime: 155,
        trailerUrl: "https://www.youtube.com/embed/n9xhJrPXop4",
        detail: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Oscar Isaac"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "The Grand Budapest Hotel",
        image: "https://image.tmdb.org/t/p/w500/nX5XotM9yprCKarRE4QnRa4OoZH.jpg",
        year: 2014, genre: g["Comedy"], runtime: 99,
        trailerUrl: "https://www.youtube.com/embed/1Fg5iWmQjwk",
        detail: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy under an exceptional concierge.",
        cast: ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Knives Out",
        image: "https://image.tmdb.org/t/p/w500/pThyQovXQrws2Q6RNq30TrA32Db.jpg",
        year: 2019, genre: g["Comedy"], runtime: 130,
        trailerUrl: "https://www.youtube.com/embed/qGqiHJTsRkQ",
        detail: "A detective investigates the death of a patriarch of an eccentric, combative family.",
        cast: ["Daniel Craig", "Chris Evans", "Ana de Armas", "Jamie Lee Curtis"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Get Out",
        image: "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
        year: 2017, genre: g["Horror"], runtime: 104,
        trailerUrl: "https://www.youtube.com/embed/DzfpyUB60YY",
        detail: "A young African-American visits his white girlfriend's parents for the weekend, where his uneasiness about their reception of him eventually reaches a boiling point.",
        cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Hereditary",
        image: "https://image.tmdb.org/t/p/w500/4O0KZRSIecEzVDrDKaSYAWrYVCl.jpg",
        year: 2018, genre: g["Horror"], runtime: 127,
        trailerUrl: "https://www.youtube.com/embed/V6wWKNij_1M",
        detail: "A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.",
        cast: ["Toni Collette", "Alex Wolff", "Milly Shapiro"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "La La Land",
        image: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
        year: 2016, genre: g["Romance"], runtime: 128,
        trailerUrl: "https://www.youtube.com/embed/0pdqf4P9MB8",
        detail: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
        cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "The Notebook",
        image: "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
        year: 2004, genre: g["Romance"], runtime: 123,
        trailerUrl: "https://www.youtube.com/embed/k9KF0I3khSc",
        detail: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.",
        cast: ["Ryan Gosling", "Rachel McAdams", "James Garner"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Parasite",
        image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        year: 2019, genre: g["Thriller"], runtime: 132,
        trailerUrl: "https://www.youtube.com/embed/5xH0HfJHsaY",
        detail: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
        reviews: [{ name: "Jane Smith", rating: 5, comment: "A genre-defying masterpiece. Bong Joon-ho is a genius.", user: jane._id }],
        numReviews: 1, rating: 5,
      },
      {
        name: "Gone Girl",
        image: "https://image.tmdb.org/t/p/w500/2fpKOCOCatGHpzPHO1YSWGNjqMi.jpg",
        year: 2014, genre: g["Thriller"], runtime: 149,
        trailerUrl: "https://www.youtube.com/embed/2-_-1nJf8Vg",
        detail: "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent.",
        cast: ["Ben Affleck", "Rosamund Pike", "Neil Patrick Harris"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Spider-Man: Into the Spider-Verse",
        image: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
        year: 2018, genre: g["Animation"], runtime: 117,
        trailerUrl: "https://www.youtube.com/embed/g4Hbz2jLxvQ",
        detail: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
        cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
        reviews: [], numReviews: 0, rating: 0,
      },
      {
        name: "Spirited Away",
        image: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
        year: 2001, genre: g["Animation"], runtime: 125,
        trailerUrl: "https://www.youtube.com/embed/ByXuk9QqQkk",
        detail: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
        cast: ["Daveigh Chase", "Suzanne Pleshette", "Miyu Irino"],
        reviews: [], numReviews: 0, rating: 0,
      },
    ];

    const movies = await Movie.insertMany(movieData);
    console.log(`✅ ${movies.length} movies inserted`);
    console.log("\n🎬 Database seeded!\n");
    console.log("  Admin → admin@moviesapp.com / admin123");
    console.log("  User  → john@example.com    / user123\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedDB();
