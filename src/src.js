////////////////////////////////////////////
//                                        //
//                F L I X                 //
//                                        //
//                  2020                  //
//         crazyhappyfuntime.com          //
//                   for                  //
//         Austin Coding Academy          //
//                  JS311                 //
////////////////////////////////////////////

///////////////////////////////////////////
//
// Establish our global variables
//

let pageNum = 1;
let releaseYear = 2020;
let genre = "";
let movies = [];

///////////////////////////////////////////
//
// API functions
//

const getMoviesByYear = (year,page) => {
    // when the user changes genres, we need to clear
    // the movies array out instead of just filtering
    // so it doesn't add the same movie twice
    if (page===1) {movies=[];}
    // url to the API
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${APIkey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=${year}&page=${page}`;
    // if there's a specific genre, add it to the url
    if (genre != "") {url+= `&with_genres=${genre}`};
    let htmlStr = "";
    // the root path to the image files
    let imgPath = `https://image.tmdb.org/t/p/w154/`;
    fetch(url)
        .then(results => results.json())
        .then(data => {
            for (let i = 0;i<data.results.length;i++){
            if (data.results[i].poster_path) {
            movies.push(data.results[i]);
            htmlStr+=`<div id = "${data.results[i].id}" onclick="showDetails(${data.results[i].id})" class="imgDiv"><img src="${imgPath}${data.results[i].poster_path}" style="height:230px;width:154px;border-radius:5%;"></div>`;
            }
            }
            document.getElementById("output").innerHTML+= htmlStr;
        })
}

const showReviews = (id) => {
    $("#reviewsDiv").html("");
    let reviewUrl = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${APIkey}`;
    fetch(reviewUrl)
    .then(res => res.json())
        .then(review => {
            let htmlStr = ``;
            for (let i=0;i<review.results.length;i++) {
                htmlStr += `<p>Author: ${review.results[i].author}<br/>
                            <br><div style="font-size:10pt">${review.results[i].content.replace(/\n/g,'<br/>')}<br/></div>
                            <br/><hr>`;
            }

            $("#reviewsDiv").append(htmlStr);
        })
}

///////////////////////////////////////////
//
//  Output functions
//

const showDetails = (id) => {
    let htmlStr  = "";
    let titleStr = "";
    let descStr  = "";
    let movieUrl = "";
    $("#pictureDiv").html("");
    $("#titleDiv").html("");
    $("#descriptionDiv").html("");
    
    for (let i=0;i<movies.length;i++) {
        if (movies[i].id === id) {
            if (movies[i].backdrop_path) {
                movieUrl = movies[i].backdrop_path;
            } else movieUrl = movies[i].poster_path;

            htmlStr+= `<div><img style="max-width:100%;border-radius:5%;" src="https://image.tmdb.org/t/p/w500/${movieUrl}"></div>`;
            titleStr+= `<div><h1>${movies[i].title}</h1></div>`;
            descStr +=  `<div style="padding-bottom:100px;">${movies[i].overview}</div>`;
   
        }
    }
    $("#pictureDiv").html(htmlStr);
    $("#titleDiv").html(titleStr);
    $("#descriptionDiv").html(descStr);
    showReviews(id);
}

///////////////////////////////////////////
//
// HTML Control functions
//


// called when the user changes genre
const filterGenre = (id) => {
    page=1;
    genre = id;
    $("#output").html("");
    getMoviesByYear(releaseYear,page);
}

// called when the user changes year
const refreshMovies = (year) => {
    page=1;
    releaseYear=year
    document.getElementById("output").innerHTML="";
    getMoviesByYear(releaseYear,page);
}

///////////////////////////////////////////
//
// Startup functions
//

const loadMovies = (pageNum) => {
   getMoviesByYear(releaseYear,pageNum)
}

// this event-handler checks if the scrollbar is at the
// bottom of the page and if it is it fetches another
// set of records
$(window).scroll(function () {
    // End of the document reached?
    if ($(document).height() - $(this).height() == $(this).scrollTop()) {
        pageNum++
       loadMovies(pageNum)
    }
}); 

// sets up the select pulldown for the years 1929-2020
const populateYearSelect = () => {
    let yearSelect = document.getElementById("yearSelect");
    for (let year=1929;year<2021;year++){
        yearSelect.options[yearSelect.options.length] = new Option(year, year);
        if (year===releaseYear) {
            yearSelect.options[yearSelect.options.length-1].selected=true;
        }
    }
}

// sets up the pulldown for the genres (fetched from the API)
const populateGenreSelect = () => {
    let genrelistUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIkey}`;
    let genreSelect = document.getElementById("genreSelect");
    fetch(genrelistUrl)
        .then(res => res.json())
            .then(data => {
                for (let i=0;i<data.genres.length;i++) {
                genreSelect.options[genreSelect.options.length] = new Option(data.genres[i].name,data.genres[i].id)
                }
            })
}

// everything starts here!
window.onload = () => {
    populateYearSelect();
    populateGenreSelect();
    loadMovies(pageNum);
}
