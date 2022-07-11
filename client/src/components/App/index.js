import * as React from 'react'
import { useState } from 'react'
import { Grid, Typography, Box, Select, MenuItem, TextField, FormControlLabel, Radio, RadioGroup, FormLabel, Button } from '@material-ui/core';
const serverURL = "ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3016"
const App = () => {
  let [error, setError] = useState(null)
  let [message, setMessage] = useState('')
  let [show, setShow] = useState(false)
  let [selectedMovie, setSelectedMovie] = useState('')
  let [enteredTitle, setEnteredTitle] = useState('')
  let [enteredReview, setEnteredReview] = useState('')
  let [selectedRating, setSelectedRating] = useState('')
  
  //D3
  let [userID, setUserID] = useState(1)
  let [movies, setMovies] = useState([])
  React.useEffect(()=>{
    loadMovies()
  },[])
  const loadMovies = () => {
    callApiLoadMovies().
    then(res => {
        var parsed = JSON.parse(res.express);
        console.log(parsed)
        setMovies(parsed)
    })
  }
  const callApiLoadMovies = async () => {
    const url = serverURL + "/api/getMovies";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  }

  const callApiAddReview = async () => {
    const url = serverURL + "/api/addReview"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewTitle : enteredTitle,
        reviewContent : enteredReview,
        reviewScore : selectedRating,
        User_userID : userID,
        movies_id : selectedMovie
      })
    });
    const body = await response.json();
    if (response.status !== 200){
      throw Error(body.message)
      setError(body.message)
      setShow(false)
    }else{
      setError(null)
      setShow(true)
      setMessage("Your review has been received")
    }

  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!enteredTitle) {
      setMessage()
      setShow(false)
      setError("Please enter your review title")
    }
    if (!enteredReview) {
      setMessage()
      setShow(false)
      setError("Please enter your review")
    }
    if (!selectedRating) {
      setMessage()
      setShow(false)
      setError("Please select the rating")
    }
    if (enteredTitle && enteredReview && selectedRating) {
      callApiAddReview()
      setShow(true)
      setMessage("Successful submission")
    }
  }
  const handleMovieChange = (e) => {
    setSelectedMovie(e.target.value)
  }
  const handleTitleChange = (e) => {
    setEnteredTitle(e.target.value)
  }
  const handleReviewChange = (e) => {
    setEnteredReview(e.target.value)
  }
  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value)
  }
  return (
    <Grid container rowSpacing={0}>
      {/* Review Form  */}
      <Grid item xs={3}>
        <Box m={2} pl={2}>
          {/* Header */}
          <Typography variant="h3"> 
            Movie Review
          </Typography>

          {/* Review begins */}
          <MovieSelection movie={selectedMovie} onChange={handleMovieChange} movies = {movies} />
          <Typography variant="h6" style={{ color: 'blue' }}>Your Review</Typography>
          <ReviewTitle title={enteredTitle} onChange={handleTitleChange} />
          <ReviewBody body={enteredReview} onChange={handleReviewChange} />
          <ReviewRating rating={selectedRating} onChange={handleRatingChange} />
          {/* Submit Button */}
          <Button variant="contained" color="primary" style={{ marginTop: 7 }} onClick={handleSubmit}>Submit</Button>

          {/* Output messages */}
          <div>
            {error && (<Typography variant="h7" style={{ color: 'red' }}>Error : {error}</Typography>)}
            {message && (<Typography variant="h7" style={{ color: 'green' }}>{message}</Typography>)}
            {show &&
              <div>
                <strong>Your submission is : </strong>
                <p><i>Review title</i> : {enteredTitle}</p>
                <p><i>Review body</i> : {enteredReview}</p>
                <p><i>Review rating</i> : {selectedRating}</p>
              </div>}
          </div>
        </Box>
      </Grid>
      {/* Image */}
      <Grid item xs={9}>
        <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWVzfGVufDB8fDB8fA%3D%3D&w=1000&q=80" style={{ height: '800px', width: '100%' }} />
      </Grid>
    </Grid>
  );
}
const ReviewTitle = ({ title, onChange }) => {
  return (
    <Box sx={{ mt: -1 }}>
      <TextField label="Title" value={title} onChange={onChange} />
    </Box>
  )
}
const ReviewBody = ({ body, onChange }) => {
  return (
    <Box>
      <TextField label="Body" multiline rows={4} value={body} onChange={onChange} />
    </Box>
  )
}
const ReviewRating = ({ rating, onChange }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <FormLabel component="legend">Rating</FormLabel>
      <RadioGroup aria-label="Rating" name="rating" value={rating} onChange={onChange}>
        <FormControlLabel value="1" control={<Radio />} label="1" />
        <FormControlLabel value="2" control={<Radio />} label="2" />
        <FormControlLabel value="3" control={<Radio />} label="3" />
        <FormControlLabel value="4" control={<Radio />} label="4" />
        <FormControlLabel value="5" control={<Radio />} label="5" />
      </RadioGroup>
    </Box>
  )
}
const MovieSelection = ({ movie, onChange, movies}) => {
  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Typography variant="h6" style={{ color: 'blue' }}>Select a movie</Typography>
      <Select
        labelId="selection-label"
        value={movie}
        onChange={onChange}
      >

            {movies.map(({id,name,year,quality})=>(
              <MenuItem value = {id}>{name}</MenuItem>
            ))}

        {/* <MenuItem value={"Ho Chi Minh Documentary"}>Ho Chi Minh Documentary</MenuItem>
        <MenuItem value={"Vietnam Tourism"}>Vietnam Tourism</MenuItem>
        <MenuItem value={"War for Independence against the Mongols - 1"}>War for Independence against the Mongols - 1</MenuItem>
        <MenuItem value={"War for Independence against the Mongols - 2 "}>War for Independence against the Mongols - 2</MenuItem>
        <MenuItem value={"War for Independence against the Mongols - 3"}>War for Independence against the Mongols - 3</MenuItem> */}
      </Select>
    </Box>
  )
}
export default App;