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

const showCast = (id) => {
    $("#cast").html("");
    let castURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${APIkey}`
    fetch(castURL)
    .then(res => res.json())
        .then(cast => {
            let htmlStr = "";
            for (let i=0;i<cast.cast.length;i++){
                if (cast.cast[i].profile_path){
                htmlStr += `<div id="${cast.cast[i].id}" onclick="showCastMemberDetails(this.id)" style="margin:1px;width:61px;height:60px;float:left;">
                            <img src="https://image.tmdb.org/t/p/w500/${cast.cast[i].profile_path}" style="border-radius:5%;width:61px;height:60px;">
                            </div>`;
                }
            }
            $("#cast").html(htmlStr);
        })
}

// called when the user clicks one of the cast members
const showCastMemberDetails = (id) => {
    $("#castMember").html("");
    let castMemberUrl = ` https://api.themoviedb.org/3/person/${id}?api_key=${APIkey}&language=en-US`;
    fetch(castMemberUrl)
    .then(res => res.json())
        .then(castMember => {
            let htmlStr = "";
            htmlStr+=`<img src="https://image.tmdb.org/t/p/w500/${castMember.profile_path}" style="border:1px solid black;max-width:100%;">
                      <br/>
                      <h1>${castMember.name}</h1>
                      <br/>
                      <img src="img/star.png" style="width:20px;height:20px"> Popularity: ${castMember.popularity}
                      <br/>
                      (b) ${castMember.birthday} ${castMember.place_of_birth} 
                      <br/>
                      (d) ${castMember.deathday}
                      <br/>
                      <p><div style="font-size:10pt">${castMember.biography.replace(/\n/g,'<br/>')}</div>
                      <br/>
                    `
            $("#castMember").html(htmlStr);
        })
}

// gets the deeper API data for each individual movie
// ie; budget, revenue, etc
const showMovieDetails = (id) => {
    let detailsHTML = "";
    let detailsURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${APIkey}`;
    fetch(detailsURL)
    .then(res => res.json())
        .then(movie => {
            detailsHTML += `<h2>${movie.tagline}</h2>
                            <br/>
                            <img src="img/star.png" style="width:20px;height:20px"> Popularity: ${movie.popularity}
                            Votes: ${movie.vote_count}  Avg: ${movie.vote_average}
                            <p/>
                            Runtime: ${movie.runtime} min
                            <p>
                            Budget: $${movie.budget}  Revenue: $${movie.revenue}
                            <p>
                            Status: ${movie.status}   Release Date: ${movie.release_date}
                            <p/>
                            Genre(s): `;
            
            for (let i=0;i<movie.genres.length;i++) {
                detailsHTML += movie.genres[i].name + " ";
            }

            $("#movieDetails").html(detailsHTML);
        })
}

// called when the user clicks one of the movie posters
const showDetails = (id) => {
    let htmlStr  = "";
    let titleStr = "";
    let descStr  = "";
    let movieUrl = "";

    clearDetailsPanel();

    for (let i=0;i<movies.length;i++) {
        if (movies[i].id === id) {
            if (movies[i].backdrop_path) {
                movieUrl = movies[i].backdrop_path;
            } else movieUrl = movies[i].poster_path;

            htmlStr+= `<div><img style="max-width:100%;border-radius:5%;" src="https://image.tmdb.org/t/p/w500/${movieUrl}"></div>`;
            titleStr+= `<div><h1>${movies[i].title}</h1></div>`;
            descStr +=  `<div style="padding-bottom:50px;">${movies[i].overview}</div>`;
   
        }
    }
    $("#pictureDiv").html(htmlStr);
    $("#titleDiv").html(titleStr);
    $("#descriptionDiv").html(descStr);
    showCast(id);
    showReviews(id);
    showMovieDetails(id);
}

// clears out the current contents of the details panel
const clearDetailsPanel = () => {
    let pictureDivHTML = `<div id="tempDiv" style= "margin-right:20px;background: url(img/filmReel.png);max-width:100%;text-align:center;background-size: cover;">
    <img src="img/flix.png" style="margin:50px;transform: scale(1.5);">
   </div> `;
    $("#pictureDiv").html(pictureDivHTML);
    $("#titleDiv").html("");
    $("#descriptionDiv").html("");
    $("#castMember").html("");
    $("#movieDetails").html("");
    $("#cast").html("");
    $("#details").scrollTop(0);
}

///////////////////////////////////////////
//
// HTML Control functions
//


// called when the user changes genre
const filterGenre = (id) => {
    clearDetailsPanel();
    page=1;
    genre = id;
    $("#output").html("");
    getMoviesByYear(releaseYear,page);
}

// called when the user changes year
const refreshMovies = (year) => {
    clearDetailsPanel();
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
    for (let year=1888;year<2021;year++){
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
